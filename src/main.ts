import { NestFactory } from "@nestjs/core";
import * as compression from "compression";
import { json } from "body-parser";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { SwaggerModule } from "@nestjs/swagger";
import { SwaggerConfig } from "./config/swagger.config";
import { ForbiddenException, ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ConfigService } from "@nestjs/config";
import { AppClusterService } from "./app-cluster.service";
import { AllHttpExceptionFilter } from "./exceptions/all-exceptions.filter";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    // Please remove contant security if using backend as https
    app.use(helmet({ contentSecurityPolicy: true }));
    const configService = app.get<ConfigService>(ConfigService);

    // app.enableCors({ credentials: true });
    const whiteList = configService.get("server.origin");
    app.enableCors({
        origin: function (origin, callback) {
            // !origin -> This valie is used for postman when postman hits an api we get origin as undefaied.
            if (!origin || whiteList.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                console.log("Your origin", origin);
                callback(new ForbiddenException("Not allowed by CORS"));
            }
        },
        methods: "GET,PUT,PATCH,POST,DELETE",
        credentials: true
    });
    app.use(json({ limit: "15mb" }));
    app.use(compression());

    app.setGlobalPrefix("v1");

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new AllHttpExceptionFilter());

    const document = SwaggerModule.createDocument(app, SwaggerConfig);
    SwaggerModule.setup("api", app, document);

    const serverPort = configService.get("server.port");
    await app.listen(serverPort);
}

AppClusterService.clusterize(4, bootstrap);

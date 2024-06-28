import { DocumentBuilder } from "@nestjs/swagger";

export const SwaggerConfig = new DocumentBuilder()
    .setTitle("PaisaPlanner API Doc")
    .addBearerAuth()
    .addCookieAuth("auth")
    .setDescription("The Financial Planning and Management App ")
    .setVersion("1.0")
    .build();

import { UserModule } from '../src/modules/user/user.module';
import { AuthModule } from '../src/modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { configuration } from 'config/configuration';
import { validationSchema } from "config/validation";
import { SpendingsModule } from './modules/spendings/spendings.module';


// const mailConfig = config.get('email');

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/development.env`,
      load: [configuration],
      validationSchema,
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    AuthModule,
    UserModule,
    SpendingsModule
    // MailerModule.forRoot({
    //   transport: {
    //     host: mailConfig.host,
    //     port: mailConfig.port,
    //     ignoreTLS: true,
    //     secure: mailConfig.secure,
    //     auth: {
    //       user: mailConfig.user,
    //       pass: mailConfig.pass
    //     }
    //   },
    //   defaults: {
    //     from: `"Apple & More" <${mailConfig.user}>`,
    //   },
    //   template: {
    //     dir: 'src/shared/email_templates',
    //     adapter: new HandlebarsAdapter(),
    //     options: {
    //       strict: true,
    //     },
    //   },
    // }),
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],
})
export class AppModule { }

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import * as config from 'config';

/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { ResetTokenRepository } from './reset-token.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SendMailerUtility } from 'src/shared/utility/send_mailer.utility';


@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: "jwt"
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => {
                return {
                    secret: config.get<string>("jwt.secret"),
                    signOptions: {
                        expiresIn: config.get<number>("jwt.expire_in")
                    }
                };
            },
            inject: [ConfigService]
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, ConfigService, JwtStrategy, UserRepository, ResetTokenRepository, SendMailerUtility],
    exports: [JwtStrategy, PassportModule]
    // imports: [PassportModule.register({
    //     defaultStrategy: 'jwt'
    // }),
    // JwtModule.register({
    //     secret: jwtConfig.SecretKey,
    //     signOptions: {
    //         expiresIn: jwtConfig.ExpireIn
    //     }
    // }),
    // TypeOrmModule.forFeature([UserRepository,ResetTokenRepository]),
    // ],
    // controllers: [
    //     AuthController,],
    // providers: [
    //     AuthService,
    //     JwtStrategy
    // ],
    // exports:[
    //     JwtStrategy,
    //     PassportModule
    // ]
})
export class AuthModule { }

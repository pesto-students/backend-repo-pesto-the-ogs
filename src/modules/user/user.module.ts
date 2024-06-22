import { UserService } from './user.service';
import * as config from 'config';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';


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
    controllers: [UserController],
    providers: [ConfigService, UserService, UserRepository]
})
export class UserModule { }

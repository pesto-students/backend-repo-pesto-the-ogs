import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtPayload } from "../jwt-payload.interface";
import { User } from "src/shared/entity/user.entity";
import { UserRepository } from "../../user/user.repository";
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { Request } from "express";

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
        configService: ConfigService,
    ) {
        super({
            passReqToCallback: true,
            ignoreExpiration: true,
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    // const auth = request?.signedCookies["auth"];
                    const auth = request?.headers["authorization"]?.split(" ")[1];
                    console.log("====auth=====",auth)
                    if (!auth) {
                        return null;
                    }
                    return auth;
                }
            ]),
            secretOrKey: configService.get("jwt.secret")
        });
    }

    async validate(req: Request, payload: JwtPayload): Promise<User> {
        if (!payload) throw new UnauthorizedException();

        if (payload.exp < Date.now() / 1000) {
            throw new UnauthorizedException("ERR_JWT_EXPIRED");
        }

        const { id } = payload;
        const user = await User.findOne({ where: { id: id, isActive: true } });
        if (!user) throw new UnauthorizedException();

        // const token = req.headers["authorization"]?.split(" ")[1];
   

        return user;
    }
}



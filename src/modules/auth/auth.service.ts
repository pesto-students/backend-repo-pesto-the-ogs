/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './jwt-payload.interface';
import * as config from "config";
import { Otp } from 'src/shared/entity/otp.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { OtpVerifyDto } from './dto/otp-verify.dto';
import { SendMailerUtility } from 'src/shared/utility/send_mailer.utility';
import { MobileLoginDto } from './dto/mobile-login.dto';
import * as md5 from "md5";
import { User } from 'src/shared/entity/user.entity';
import { In } from 'typeorm';
import { GenerateOtpNumber } from 'src/shared/utility/generate-otp.utility';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { changePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import crypto = require('crypto');
import { ResetPasswordToken } from 'src/shared/entity/reset-password-token.entity';
import { ResetLinkDto } from './dto/reset-link.dto';
import { ResetTokenRepository } from './reset-token.repository';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForceUpdateDto } from './dto/force-update.dto';
import { ConfigService } from '@nestjs/config';
import { throwException } from 'src/shared/utility/throw-exception';
import { AppResponse } from 'src/shared/interfaces/app-response.interface';

@Injectable()
export class AuthService {

    tokenExpireTime;
    resetLinkExpireTime;

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private readonly configService: ConfigService,
        @InjectRepository(ResetTokenRepository)
        private resetTokenRepository: ResetTokenRepository,
        private jwtService: JwtService,
        private readonly mailerService: SendMailerUtility,

    ) {
        this.tokenExpireTime = this.configService.get<number>("app.forgotToken.expire_time");
    }


    /**
     * 
     * @param loginUser 
     * @returns 
     * Login user with email and password with otp and with out otp based on set config otp value
     */
    async loginUser(loginUser: LoginDto): Promise<{ data: { access_token: string, user: User }, message: string }> {

        try {
            const {
                email,
                password
            } = loginUser;

            const user = await User.findOne({
                where: {
                    email,
                    isActive: true
                },
            });

            if (!user) {
                throw new NotFoundException(`USER_NOT_FOUND`)
            }

            if (await user.validatePassword(password)) {

                const token = this.generateJWTToken(user);

                delete user.password
                delete user.salt
                delete user.createdAt
                delete user.createdBy
                delete user.updatedAt
                delete user.updatedBy

                return {
                    data: {
                        access_token: token,
                        user
                    },
                    message: "You have logged in successfully."
                };

            } else {
                throw new UnauthorizedException(`Incorrect credentials.`);
            }
        } catch (error) {
            throwException(error);
        }
    }


    /**
 *
 * @param forgotPasswordDto
 * Forgot password generate link and sent email
 */
    async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<AppResponse> {
        try {
            const { email } = forgotPasswordDto;

            const user = await User.findOne({ where: { email } });

            if (!user) {
                throw new NotFoundException("USER_NOT_FOUND");
            } else if (!user.isActive) {
                throw new NotAcceptableException("User not active.");
            }

            const resetToken = crypto.randomBytes(32).toString("hex");
            const expireTime = new Date().getTime() + this.tokenExpireTime * 60000;
            let resetLink;

            const forgotPasswordToken = new ResetPasswordToken();

            forgotPasswordToken.token = resetToken;
            forgotPasswordToken.user = user;
            forgotPasswordToken.expireTime = expireTime;

            await forgotPasswordToken.save();


            resetLink = `${this.configService.get(
                "app.frontend_base_url"
            )}account/reset-password?token=${resetToken}&id=${user.id}`;


            await this.mailerService.ResetPasswordLink(resetLink, user);

            return {
                message: "Reset password link sent your email address.",
                data: {}
            };
        } catch (error) {
            throwException(error);
        }
    }

    /**
       *
       * @param resetLinkDto
       * Verify Reset password link
       */
    async verifyLink(resetLinkDto: ResetLinkDto): Promise<AppResponse> {
        try {
            const { reset_token, user_id } = resetLinkDto;

            const findResetToken = await ResetPasswordToken.findOne({
                where: { token: reset_token, userId: user_id }
            });

            if (!findResetToken) {
                throw new NotFoundException(`INVALID_LINK`);
            } else if (findResetToken.isActive) {
                throw new NotAcceptableException(`IN_ACTIVE_LINK`);
            }

            const currentTime = new Date().getTime();

            if (currentTime > findResetToken.expireTime) {
                throw new NotAcceptableException("EXPIRE_LINK");
            }

            findResetToken.isActive = true;

            await findResetToken.save();

            return {
                message: "Reset password link verified successfully.",
                data: {}
            };
        } catch (error) {
            throwException(error);
        }
    }


    /**
     * Reset password
     */
    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<AppResponse> {
        try {
            const { user_id, reset_token, new_password } = resetPasswordDto;


            const findToken = await this.resetTokenRepository.findToken(reset_token, user_id);

            const currentTime = new Date().getTime();

            if (!findToken) {
                throw new NotFoundException(`NOT_FOUND`);
            } else if (!findToken.user.isActive) {
                throw new NotAcceptableException(`NOT_ACTIVE`);
            } else if (!findToken.isActive) {
                throw new NotAcceptableException("NOT_VERIFY");
            } else if (currentTime > findToken.expireTime) {
                throw new NotAcceptableException("EXPIRE_LINK");
            }

            const salt = await bcrypt.genSalt();
            findToken.user.password = await bcrypt.hash(new_password, salt);
            findToken.user.salt = salt;
            findToken.isActive = false;

            await findToken.user.save();
            await findToken.save()

            return {
                message: "Your password has been reset successfully",
                data: {}
            };
        } catch (error) {
            throwException(error);
        }
    }


    /**
     * Change password if user is login
     */
    async changePassword(changePasswordDto: changePasswordDto, user: User): Promise<AppResponse> {
        try {
            const { old_password, new_password } = changePasswordDto;

            const userId = user.id;
            const findUser = await User.findOne({ where: { id: userId } });

            const hashPassword = await bcrypt.hash(old_password, findUser.salt);

            if (hashPassword == findUser.password) {
                const salt = await bcrypt.genSalt();
                findUser.password = await bcrypt.hash(new_password, salt);
                findUser.salt = salt;

                await findUser.save();
            } else {
                throw new NotAcceptableException("NOT_MATCH_PASSWORD");
            }

            return {
                message: "Your password had been changed successfully.",
                data: {}
            };
        } catch (error) {
            throwException(error);
        }
    }

    /**
     * 
     * @param user 
     * @returns 
     * Generate JWT token with user payload
     */
    generateJWTToken(user) {
        const payload: JwtPayload = {
            id: user.id,
            email: user.email,
            username: user.firstName + " " + user.lastName,
            firstName: user.firstName,
            date: Date.now().toString(),
            phone: user.phoneNo,
            lastName: user.lastName,
            role: user.role,
            isActive: user.isActive
        };
        if (user.profilePic) {
            payload["profilePic"] = this.configService.get("app.doc_url") + user.profilePic;
        }

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get("jwt.secret"),
            expiresIn: this.configService.get("jwt.expire_in")
        });

        return accessToken;
    }

}

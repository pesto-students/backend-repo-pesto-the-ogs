
import { MailerService } from '@nestjs-modules/mailer';
import { forgotPasswordMail } from '../../shared/email_templates/forgot-password-mail.html';
import { forgotPasswordMailAdmin } from '../email_templates/forgot-password-admin-mail.html';




export class SendMailerUtility {

    // static mailerService: MailerService;

    constructor(
        private mailerService: MailerService,

    ) { }


    async VerifyEmailOtpSend(user, otp) {
        await this.mailerService.sendMail({
            template: './verify-email',
            context: {
                otp: otp
            },
            subject: `OTP - Verify email verification`,
            to: user.email
        });
    }

    async LoginOtpSend(user, otp) {
        await this.mailerService.sendMail({
            template: './login-otp',
            context: {
                otp: otp
            },
            subject: `OTP - Login verification`,
            to: user.email
        });
    }

    // Send reset password email to user
    async ResetPasswordLink(resetLink, user) {
        await this.mailerService.sendMail({
            template: "./reset-password-link",
            context: {
                resetLink: resetLink
            },
            subject: `Reset Forgot Password Link`,
            to: user.email
        });
    }

    async ResetPasswordOtp(otp, user) {

        this.mailerService
            .sendMail({
                to: user.email,
                from: "no-reply@shoploba.com",
                subject: "Forgot Password",
                html: forgotPasswordMail({
                    username: user.firstName,
                    otp: otp
                })
            })
            .then((res) => {
                console.log("res", res);
            })
            .catch((err) => {
                console.log("err", err);
            });

    }
}
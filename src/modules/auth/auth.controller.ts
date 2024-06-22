/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post, Put, Query, UseFilters, UseGuards, UseInterceptors, ValidationPipe, Res, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Role } from 'src/shared/enums/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { LogInUser } from 'src/shared/decorators/login.decorator';
import { User } from 'src/shared/entity/user.entity';
import { changePasswordDto } from './dto/change-password.dto';
import { StatusFilter } from 'src/shared/interceptors/status_exception/status.filter';
import { StatusInterceptor } from 'src/shared/interceptors/status_exception/statusInterceptor.interceptor';
import { AppResponse } from 'src/shared/interfaces/app-response.interface';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetLinkDto } from './dto/reset-link.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

	constructor(
		private authService: AuthService
	) { }


	@Post("login")
    @ApiOperation({ summary: "Login for registered user" })
    @ApiResponse({ status: 200, description: "Api success" })
    @ApiResponse({ status: 406, description: "Not Acceptable error" })
    @ApiResponse({ status: 422, description: "Bad Request or API error message" })
    @ApiResponse({ status: 401, description: "Invalid Login credentials." })
    @ApiResponse({ status: 500, description: "Internal server error!" })
    signIn(
        @Body(ValidationPipe) authCredentialDto: LoginDto
    ): Promise<AppResponse> {
        return this.authService.loginUser(authCredentialDto);
	}
	

	@Post("forgot-password")
    @ApiOperation({ summary: "Reset password in case of forgotten. Will send link to registered email." })
    @ApiResponse({ status: 200, description: "Api success" })
    @ApiResponse({ status: 406, description: "Not Acceptable errord" })
    @ApiResponse({ status: 422, description: "Bad Request or API error message" })
    @ApiResponse({ status: 401, description: "Invalid Login credentials." })
    @ApiResponse({ status: 500, description: "Internal server error!" })
    // @HttpCode(200)
    forgotPassword(@Body(ValidationPipe) forgotPasswordDto: ForgotPasswordDto): Promise<AppResponse> {
        return this.authService.forgotPassword(forgotPasswordDto);
	}
	

	@Get("verify-link")
    @ApiOperation({ summary: "Verify forgot password link" })
    @ApiResponse({ status: 200, description: "Api success" })
    @ApiResponse({ status: 406, description: "Not Acceptable error" })
    @ApiResponse({ status: 422, description: "Bad Request or API error message" })
    @ApiResponse({ status: 401, description: "Invalid Login credentials." })
    @ApiResponse({ status: 500, description: "Internal server error!" })
    verifyResetLink(@Query(ValidationPipe) resetLinkDto: ResetLinkDto): Promise<AppResponse> {
        return this.authService.verifyLink(resetLinkDto);
	}
	

	@Put("reset-password")
    @ApiOperation({ summary: "Reset forgotten password" })
    @ApiResponse({ status: 200, description: "Api success" })
    @ApiResponse({ status: 406, description: "Not Acceptable error" })
    @ApiResponse({ status: 422, description: "Bad Request or API error message" })
    @ApiResponse({ status: 401, description: "Invalid Login credentials." })
    @ApiResponse({ status: 500, description: "Internal server error!" })
    // @HttpCode(200)
    resetPassword(@Body(ValidationPipe) resetPasswordDto: ResetPasswordDto): Promise<AppResponse> {
        return this.authService.resetPassword(resetPasswordDto);
    }



    @Put("change-password")
    @ApiOperation({ summary: "Change password if user is login" })
    @ApiResponse({ status: 200, description: "Api success" })
    @ApiResponse({ status: 406, description: "Not Acceptable error" })
    @ApiResponse({ status: 422, description: "Bad Request or API error message" })
    @ApiResponse({ status: 401, description: "Invalid Login credentials." })
    @ApiResponse({ status: 500, description: "Internal server error!" })
    // @HttpCode(200)
    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    changePassword(
        @Body(ValidationPipe) changePasswordData: changePasswordDto,
        @LogInUser() user: User
    ): Promise<AppResponse> {
        return this.authService.changePassword(changePasswordData, user);
    }
}

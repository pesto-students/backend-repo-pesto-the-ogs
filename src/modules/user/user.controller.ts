/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post, ValidationPipe, Put, Param, UseGuards, Get, Patch, BadRequestException, Query, HttpCode, UseInterceptors, UploadedFiles, Req, UseFilters, Delete } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dto/signup-user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/edit_user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.dacorator';
import { AddUserDto } from './dto/add_user.dto';
import { PageQueryDto } from 'src/shared/dtos/list_query.dto';
import { StatusInterceptor } from 'src/shared/interceptors/status_exception/statusInterceptor.interceptor';
import { AppResponse } from 'src/shared/interfaces/app-response.interface';

@Controller('user')
@ApiTags('User')
export class UserController {

	constructor(
		private userService: UserService
	) { }

	

	//@Post("/add")
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	@ApiOperation({ summary: "Add New User" })
	@ApiResponse({ status: 200, description: "Api success" })
	@ApiResponse({ status: 422, description: "Bad Request or API error message" })
	@ApiResponse({ status: 404, description: "Not found!" })
	@ApiResponse({ status: 409, description: "User Already Exist" })
	@ApiResponse({ status: 500, description: "Internal server error!" })
	@UseInterceptors(StatusInterceptor)
	@ApiHeader({
		name: 'language',
		description: 'Enter language code(ex. en)',
		example: 'en'
	})
	async addUser(
		@Body() createUser: AddUserDto,
		@GetUser() user
	) {
		return await this.userService.addUser(createUser, user.id);
	}


	@Post("/signup")
    @ApiOperation({ summary: "Signup user" })
    @ApiResponse({ status: 200, description: "Api success" })
    @ApiResponse({ status: 422, description: "Bad Request or API error message" })
    @ApiResponse({ status: 404, description: "Not found!" })
    @ApiResponse({ status: 409, description: "User Already Exist" })
    @ApiResponse({ status: 500, description: "Internal server error!" })
    signUp(@Body(ValidationPipe) createUser: CreateUserDto): Promise<AppResponse> {
        return this.userService.signUp(createUser);
    }

	//@Get("/:id")
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	@ApiOperation({ summary: "Get user details" })
	@ApiResponse({ status: 200, description: "Api success" })
	@ApiResponse({ status: 422, description: "Bad Request or API error message" })
	@ApiResponse({ status: 404, description: "Not found!" })
	@ApiResponse({ status: 409, description: "User Already Exist" })
	@ApiResponse({ status: 500, description: "Internal server error!" })
	@ApiHeader({
		name: 'language',
		description: 'Enter language code(ex. en)',
		example: 'en'
	})
	getUser(
		@Param('id') id: string
	) {
		return this.userService.getUser(id);
	}

	// @Put("profile/edit")
	// @UseGuards(AuthGuard('jwt'))
	// @ApiBearerAuth()
	// @ApiConsumes("multipart/form-data")
	// @ApiOperation({ summary: "Edit personal profile details" })
	// @ApiResponse({ status: 200, description: "Api success" })
	// @ApiResponse({ status: 422, description: "Bad Request or API error message" })
	// @ApiResponse({ status: 404, description: "Not found!" })
	// @ApiResponse({ status: 409, description: "User Already Exist" })
	// @ApiResponse({ status: 500, description: "Internal server error!" })
	// @ApiHeader({
	//     name: 'language',
	//     description: 'Enter language code(ex. en)',
	//     example: 'en'
	// })
	// @UseInterceptors(
	// 	FileFieldsInterceptor(
	// 		[
	// 			{ name: "profilePic" },
	// 		],
	// 		{
	// 			storage: diskStorage({
	//                 destination: `./assets/profile-pic`,
	// 				filename: editFileName,
	// 			}),
	// 			fileFilter: imageFileFilter,
	// 		},
	// 	),
	// )
	// editUser(
	// 	@Body(ValidationPipe) updateUser: UpdateUserDto,
	// 	@GetUser() user,
	// 	@UploadedFiles() fileDto: FileDto,
	// 	@Req() req
	// ) {		
	// 	return this.userService.editUser(updateUser, user, fileDto);
	// }
	//@Put("/edit")
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	@ApiOperation({ summary: "Edit user details" })
	@ApiResponse({ status: 200, description: "Api success" })
	@ApiResponse({ status: 422, description: "Bad Request or API error message" })
	@ApiResponse({ status: 404, description: "Not found!" })
	@ApiResponse({ status: 409, description: "User Already Exist" })
	@ApiResponse({ status: 500, description: "Internal server error!" })
	@ApiHeader({
		name: 'language',
		description: 'Enter language code(ex. en)',
		example: 'en'
	})
	editUser(
		@Body(ValidationPipe) updateUser: UpdateUserDto,
		@GetUser() user,
	) {
		return this.userService.editUser(updateUser, user);
	}

	//	@Get("profile/get-details")
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	@ApiOperation({ summary: "Get user profile details" })
	@ApiResponse({ status: 200, description: "Api success" })
	@ApiResponse({ status: 422, description: "Bad Request or API error message" })
	@ApiResponse({ status: 404, description: "Not found!" })
	@ApiResponse({ status: 409, description: "User Already Exist" })
	@ApiResponse({ status: 500, description: "Internal server error!" })
	@ApiHeader({
		name: 'language',
		description: 'Enter language code(ex. en)',
		example: 'en'
	})
	getUserProfile(
		@GetUser() user
	) {
		return this.userService.getUser(user.id);
	}


	//@Get("/")
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	@ApiOperation({ summary: "Get user list" })
	@ApiResponse({ status: 200, description: "Api success" })
	@ApiResponse({ status: 422, description: "Bad Request or API error message" })
	@ApiResponse({ status: 404, description: "Not found!" })
	@ApiResponse({ status: 409, description: "User Already Exist" })
	@ApiResponse({ status: 500, description: "Internal server error!" })
	@ApiHeader({
		name: 'language',
		description: 'Enter language code(ex. en)',
		example: 'en'
	})
	getUserList(
		@Query() query: PageQueryDto,
	) {
		console.log("======= listData ====", query);
		return this.userService.getUserList(query);
	}

	//	@Get("/static-urls/list")
	@ApiOperation({ summary: "Get list of static links" })
	@ApiResponse({ status: 200, description: "Api success" })
	@ApiResponse({ status: 422, description: "Bad Request or API error message" })
	@ApiResponse({ status: 404, description: "Not found!" })
	@ApiResponse({ status: 500, description: "Internal server error!" })
	@ApiHeader({
		name: 'language',
		description: 'Enter language code(ex. en)',
		example: 'en'
	})
	getStaticLinks() {
		return this.userService.getStaticLinks();
	}

}

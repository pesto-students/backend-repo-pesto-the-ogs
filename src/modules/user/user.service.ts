/*
https://docs.nestjs.com/providers#services
*/

import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/signup-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from "bcrypt";
import { User } from 'src/shared/entity/user.entity';
import { UpdateUserDto } from './dto/edit_user.dto';
import { UuidValidation } from 'src/shared/validation/uuid-validation';
import { AddUserDto } from './dto/add_user.dto';
import { PageQueryDto } from 'src/shared/dtos/list_query.dto';
import { CompleteSetupDto } from './dto/complete_user_setup.dto';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { throwException } from 'src/shared/utility/throw-exception';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private readonly configService: ConfigService,
        // private mailerService: MailerService,
        private jwtService: JwtService,
    ) { }


    async signUp(createUser: CreateUserDto) {
        try {
            const {
                first_name,
                last_name,
                email,
                password,
                country_code,
                phone_number
            } = createUser;

            const userExist = await User.findOne({
                where: {
                    email: email,
                    isActive: true
                }
            });

            if (userExist)
                throw new ConflictException(`Email address already exists.`);


            const user = new User();
            const salt = await bcrypt.genSalt();

            user.firstName = first_name;
            user.lastName = last_name;
            user.email = email;
            user.countryCode = country_code || "";
            user.phoneNumber = phone_number || "";
            user.salt = salt;
            user.password = password;

            await user.save();


            let token
            if (await user.validatePassword(password)) {

                token = this.generateJWTToken(user);

            }

            delete user.password;
            delete user.salt;
            let userData: any = {};
            userData.fristName = user.firstName;
            userData.lastName = user.lastName;
            userData.email = user.email;
            userData.id = user.id;
            userData.countryCode = user.countryCode;
            userData.phoneNumber = user.phoneNumber;
            userData.token = token;
            userData.message = "Your account has been created successfully.";
            return userData;
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


        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get("jwt.secret"),
            expiresIn: this.configService.get("jwt.expire_in")
        });

        return accessToken;
    }
    /**
     * Fetch User details from ID
     * @author Rajesh
     * @param id  => User id
     */
    async getUser(id) {

        UuidValidation.validate(id);
        // Check user exists with given ID
        const user = await this.userRepository.getUser(id);

        if (!user) {
            throw new NotFoundException(`User with given id is not exists.`);
        }

        let userDetail = {
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNo: user.phoneNumber,
        }

        return {
            message: "User detail fetch successfully.",
            userDetail
        }

    }

    async editUser(updateUser: UpdateUserDto, user: User) {
        UuidValidation.validate(updateUser.userId);
        // Check user exists with given ID
        // const userExist = await this.userRepository.findOne({ id: user.id });
        // if (!userExist)
        //     throw new NotFoundException(`User with given id not exists.`);

        // Check if Duplicate Email


        const update = await this.userRepository.editUser(updateUser, user);
        return {
            message: "User updated successfully."
        }
    }

    async completeUserSetup(completeSetup: CompleteSetupDto, userId) {
        let userExists = await this.userRepository.findOne({ where: { id: completeSetup.user_id } })
        if (!userExists)
            throw new NotFoundException(`User not found.`);

        await this.userRepository.completeUserSetup(completeSetup, userExists, userId);
        return {
            message: "User set up completed successfully. "
        }
    }

    async addUser(createUser: AddUserDto, userId) {
        const isEmailUnique = await this.userRepository.findOne({ where: { email: createUser.email } });
        if (isEmailUnique)
            throw new ConflictException(`Email address already exists.`);

        const update = await this.userRepository.addUser(createUser, userId);
        delete update.password
        delete update.salt
        return {
            user: update,
            message: "User added successfully."
        }
    }


    async getUserList(query: PageQueryDto) {
        const { users, page } = await this.userRepository.fetchAllUsers(query);
        return {
            users, page,
            message: "User list fetch successfully."
        };
    }

    async imageUpload(imagePath, userId) {
        UuidValidation.validate(userId);
        const isUserExist = await this.userRepository.findOne({ where: { id: userId } });
        if (!isUserExist)
            throw new NotFoundException(`User with given id not exists.`);

        const saveImagePath = await this.userRepository.saveImage(isUserExist, imagePath);
        return {
            message: "User image uploaded successfully.",
            //profilePic: config.get('getUrl')+isUserExist.profilePic
        }
    }

    async getStaticLinks() {
        let list = [];
        list.push({ facebook: "https://www.facebook.com/LobaPillOrganizers", instagram: "https://www.instagram.com/shop.loba/", pinterest: "https://www.pinterest.ca/shoploba/_saved/", termsAndConditions: "http://google.com/", privacyPolicy: "http://google.com/" });

        return { staticLinks: list }


    }
}

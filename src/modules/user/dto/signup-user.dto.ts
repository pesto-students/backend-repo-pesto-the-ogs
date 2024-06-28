import { IsNotEmpty, IsEmail, ValidationArguments, IsEnum, ValidateIf, IsOptional, MaxLength, MinLength, Matches } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Role } from 'src/shared/enums/role.enum';
import { errorMessage } from 'src/config/common.config';
import { IsEqualTo } from 'src/shared/decorators/password.decorator';


export class CreateUserDto {

    @IsNotEmpty({
        message: `Please enter first name.`
    })
    @ApiProperty({
        description: `Enter First Name`,
        example: `Dhrumil`
    })
    first_name: string;

    @ApiPropertyOptional({
        description: `Enter Last Name`,
        example: `Shah`
    })
    last_name: string;

    @ValidateIf(o => o.email != '')
    @IsEmail(
        {},
        {
            message: (args: ValidationArguments) => {
                if (typeof args.value != "undefined" && args.value != "") {
                    return `Please enter valid email address.`;
                } else {
                    return `Please enter email address.`
                }
            }
        }
    )
    @IsNotEmpty({
        message: `Please enter email address.`
    })
    @ApiProperty({
        description: `Enter Email Id`,
        example: `djdonmil@gmail.com`
    })
    email: string;

    @IsNotEmpty({
        message: `Please enter password.`
    })
    @ApiProperty({
        description: `Enter Password`,
        example: `Jondoe123@`
    })
    @MaxLength(20)
    @MinLength(8, { message: `Password is too short. It should be minimum 8 characters.&&&password` })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: `Your password must be 8 characters long, should contain at least 1 uppercase, 1 lowercase, 1 numeric or special character.&&&password`,
    })
    password: string;

    @ApiProperty({
        description: `Enter confirm password`,
        example: `Jondoe123@`,
    })
    @IsEqualTo(`password`)
    @IsNotEmpty()
    confirm_password: string;


    @ApiPropertyOptional({
        description: `Enter country code`,
        example: `+91`
    })
    country_code: string;


    @ApiPropertyOptional({
        description: `Enter phone number`,
        example: `8000002828`
    })
    phone_number: string;



}
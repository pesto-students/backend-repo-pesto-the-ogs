import { IsNotEmpty, IsEmail, ValidationArguments, MaxLength, MinLength, Matches, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEqualTo } from 'src/shared/decorators/password.decorator';

export class AddUserDto {

    @IsNotEmpty({
        message: `Please enter your first name.&&&first_name`
    })
    @ApiProperty({
        description: `Enter First Name`,
        example: `Jon`
    })
    first_name: string;

    @IsNotEmpty({
        message: `Please enter your last name.&&&last_name`
    })
    @ApiProperty({
        description: `Enter Last Name`,
        example: `Doe`
    })
    last_name: string;

    @IsEmail(
        {},
        {
            message: (args: ValidationArguments) => {
                if (typeof args.value == "undefined" || args.value == "") {
                    return `Please enter email address.&&&email`;
                } else {
                    return `Please Enter valid email address.&&&email`;
                }
            },
        },
    )
    @ApiProperty({
        description: `Enter Email Id`,
        example: `jon.doe@gmail.com`
    })
    email: string;

    @IsNotEmpty({
        message: `Please enter your contact number.&&&phone_no`
    })
    @ApiProperty({
        description: `Enter phone number`,
        example: `8452456712`
    })
    phone_no: string;

    @IsOptional()
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
    @IsOptional()
    confirm_password: string;

    @ApiPropertyOptional({
        description: `Enter Gender`,
        example: `Male`
    })
    gender: string;

    @IsNotEmpty({
        message: `Please enter role id.&&&role_id`,
    })
    @ApiProperty({
        description: `SUPER_ADMIN=1, ADMIN=2,DEALER=3,END_USER=4,SC_USER=5`,
        example: 3
    })
    role_id: number;
}
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, Matches, MaxLength, MinLength, ValidateIf, ValidationArguments } from "class-validator";
import { IsEqualTo } from "src/shared/decorators/password.decorator";

export class ResetPasswordDto {


    @ApiPropertyOptional({
        description: 'Enter reset password token',
        example: '1eea5c520107cca102d85469f989596594860e86142620e3aab5e935aeee7d38'
    })
    reset_token: string;


    @ApiPropertyOptional({
        description: 'Enter user id',
        example: 'f66cb3ab-093f-4fd3-91ff-46dd3574258f'
    })
    user_id: string;

    @IsNotEmpty({
        message: `Please enter your new password.&&&password`
    })
    @ApiProperty({
        description: `Enter new password`,
        example: `Jondoe123@`
    })
    @MaxLength(20)
    @MinLength(8, { message: `New password is too short. It should be minimum 8 characters.&&&password` })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: `Your new password must be 8 characters long, should contain at least 1 uppercase, 1 lowercase, 1 numeric or special character.&&&password`,
    })
    new_password: string;

    @ApiProperty({
        description: `Enter confirm password`,
        example: `Jondoe123@`,
    })
    @IsEqualTo(`new_password`)
    @IsNotEmpty({
        message: `Please enter your confirm password.&&&confirm_password`,
    })
    confirm_password: string;

}
import { IsNotEmpty, IsEmail, ValidationArguments, MaxLength, MinLength, Matches, IsOptional, IsEnum } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEqualTo } from 'src/shared/decorators/password.decorator';
import { SpendingEnum } from 'src/shared/enums/spending.enum';

export class ExpenseOrEarningDto {

    @IsNotEmpty({
        message: `Please select your role.&&&role`
    })
    @IsEnum(['INCOME','EXPENSE'], {
        message: (args: ValidationArguments) => {
            if (typeof args.value == "undefined" || args.value == "") {
                return `Please select your finance type.`;
            } else {
                return `Please select valid type('INCOME','EXPENSE').`
            }
        }
    })
    @ApiProperty({
        description: `Select type ('INCOME','EXPENSE')`,
        example: "EXPENSE"
    })
    type: string;

    @IsNotEmpty({
        message: `Please enter amount.&&&amount`
    })
    @ApiProperty({
        description: `Enter Amount in INR`,
        example: 10000
    })
    amount: number;

    @IsNotEmpty({
        message: `Please enter Name.&&&name`
    })
    @ApiProperty({
        description: `Enter Description`,
        example: `grocery`
    })
    name: string;

    @ApiPropertyOptional({
        description: `Enter Description`,
        example: `weekly grocery`
    })
    description: string;

    @IsOptional()
    @ApiPropertyOptional({
        description: `Enter Income source`,
        example: `primary`
    })
    income_source: string;

    @IsOptional()
    @ApiPropertyOptional({
        description: `Enter Income type`,
        example: `fixed`
    })
    income_type: string;


    @ApiPropertyOptional({
        description: `Enter date`,
        example: '2024-06-20T11:43:12Z'
    })
    date: Date;

    
}
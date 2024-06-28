import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsString, Matches, ValidationArguments, IsOptional } from "class-validator";
import { OrderDir } from "../enums/order_dir.enum";

export class PageQueryDto {

    
    @IsNotEmpty({ message: "Please enter count" })
    @ApiProperty({
        description: "Enter count ",
        example: 0
    })
    count: number;

    @IsNumberString({},{
        message: "Offset contain only number"
    })
    @IsNotEmpty({ message: "Please enter offset" })
    @ApiProperty({
        description: "Enter offset ",
        example: 0
    })
    offset: number;

    @IsNumberString({},{
        message: "Limit contain only number"
    })
    @IsNotEmpty({
        message: "Please enter limit"
    })
    @ApiProperty({
        description: "Enter limit ",
        example: 0
    })
    limit: number;

    @IsString({
        message:"Order by contain only string"
    })    
    @ApiProperty({
        description:"Please enter order by (createdAt)",
        example:'createdAt'
    })
    orderBy: string

    @IsEnum(['DESC', 'ASC'], {
        message: (args: ValidationArguments) => {
            if (typeof args.value == "undefined" || args.value == "" || args.value == null) {
                return `Please select order dir.`
            }
            else {
                return `Please select valid order dir('DESC', 'ASC').`
            }
        }
    })
    @ApiProperty({
        description: "Please select orderdir (DESC,ASC)",
        example: 'DESC'
    })
    orderDir: OrderDir;
        

    @IsOptional()
    @ApiPropertyOptional({
        required: false,
        description: "Enter income source",
        example:"primary"
    })
    income_source_filter: string

    @IsOptional()
    @ApiPropertyOptional({
        required: false,
        description: "Enter income type",
        example:"fixed"
    })
    income_type_filter: string

    @IsOptional()
    @ApiPropertyOptional({
        required: false,
        description: "Enter spend/finance type",
        example:"INCOME"
    })
    type_filter: string

    @IsOptional()
    @ApiPropertyOptional({
        required: false,
        description: "Enter recurring type",
        example:"0"
    })
    is_recurring_filter: number | string

    @ApiPropertyOptional({
        required: false,
        description: "Enter search"
    })
    search: string
}
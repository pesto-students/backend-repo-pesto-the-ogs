import { Controller, UseGuards, Post, Body, Put, Param, ValidationPipe, Patch, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SpendingsService } from './spendings.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.dacorator';
import { ExpenseOrEarningDto } from './dto/expense_or_earning.dto';
import { AppResponse } from 'src/shared/interfaces/app-response.interface';
import { UpdateSpendingDto } from './dto/update_spending.dto';
import { User } from 'src/shared/entity/user.entity';
import { PageQueryDto } from 'src/shared/dtos/list_query.dto';

@Controller('spendings')
@ApiTags('Spendings')

export class SpendingsController {
    constructor(
        private spendingService: SpendingsService
    ) { }


    @Post("/finance")
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: "Add finance. It can be of INCOME or EXPENSE type" })
    @ApiResponse({ status: 200, description: "Api success" })
    @ApiResponse({ status: 422, description: "Bad Request or API error message" })
    @ApiResponse({ status: 404, description: "Not found!" })
    @ApiResponse({ status: 500, description: "Internal server error!" })
    async addExpenseOrIncome(
        @Body() createExpenseOrEarning: ExpenseOrEarningDto,
        @GetUser() user: User
    ): Promise<AppResponse> {
        return await this.spendingService.addExpenseOrIncome(createExpenseOrEarning, user);
    }


    @Put(":id")
    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @ApiOperation({ summary: "Edit spending details" })
    @ApiResponse({ status: 200, description: "Api success" })
    @ApiResponse({ status: 422, description: "Bad Request or API error message" })
    @ApiResponse({ status: 404, description: "Not found!" })
    @ApiResponse({ status: 500, description: "Internal server error!" })
    editSpending(
        @Param("id") id: string,
        @Body(ValidationPipe) updateSpendingDto: UpdateSpendingDto,
        @GetUser() user: User
    ): Promise<AppResponse> {
        return this.spendingService.editSpending(updateSpendingDto, parseInt(id), user);
    }



    @Patch("delete/:id")
    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @ApiOperation({ summary: "In this API, we perform soft delete the spending by changing isActive flag to false." })
    @ApiResponse({ status: 200, description: "Api success" })
    @ApiResponse({ status: 422, description: "Bad Request or API error message" })
    @ApiResponse({ status: 404, description: "Not found!" })
    @ApiResponse({ status: 500, description: "Internal server error!" })
    deleteSpending(@Param() id: string, @GetUser() user: User): Promise<AppResponse> {

        return this.spendingService.deleteSpending(parseInt(id), user.id);
    }


    @Get("/")
    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @ApiOperation({ summary: "Get spending list for logged in user. We can search on basis of name and description. We can apply filter of income source(primary, secondary), spending type(EXPENSE,INCOME), income type(fixed, variable) and recurring type(0=false,1=true)" })
    @ApiResponse({ status: 200, description: "Api success" })
    @ApiResponse({ status: 422, description: "Bad Request or API error message" })
    @ApiResponse({ status: 404, description: "Not found!" })
    @ApiResponse({ status: 500, description: "Internal server error!" })
    getSpendingList(@Query() query: PageQueryDto, @GetUser() user: User): Promise<AppResponse> {
        return this.spendingService.getSpendingList(query, user.id);
    }


    @Get("/:id")
    @UseGuards(AuthGuard("jwt"))
    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @ApiOperation({ summary: "Get spending details by id" })
    @ApiResponse({ status: 200, description: "Api success" })
    @ApiResponse({ status: 422, description: "Bad Request or API error message" })
    @ApiResponse({ status: 404, description: "Not found!" })
    @ApiResponse({ status: 500, description: "Internal server error!" })
    getSpendingById(@Param("id") id: string, @GetUser() user: User): Promise<AppResponse> {
        return this.spendingService.getSpendingById(parseInt(id),user.id);
    }
}

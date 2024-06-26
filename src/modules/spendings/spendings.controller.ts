import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SpendingsService } from './spendings.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.dacorator';
import { ExpenseOrEarningDto } from './dto/expense_or_earning.dto';
import { AppResponse } from 'src/shared/interfaces/app-response.interface';

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
		@GetUser() user
	): Promise<AppResponse> {
		return await this.spendingService.addExpenseOrIncome(createExpenseOrEarning, user);
	}
}

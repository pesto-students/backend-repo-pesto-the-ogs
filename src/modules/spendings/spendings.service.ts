import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ExpenseOrEarningDto } from './dto/expense_or_earning.dto';
import { User } from 'src/shared/entity/user.entity';
import { throwException } from 'src/shared/utility/throw-exception';
import { InjectRepository } from '@nestjs/typeorm';
import { SpendingRepository } from './spending.repository';
import { SpendingEnum } from 'src/shared/enums/spending.enum';
import { UpdateSpendingDto } from './dto/update_spending.dto';
import { UserExpenseAndEarning } from 'src/shared/entity/user-expense-and-earning.entity';
import { PageQueryDto } from 'src/shared/dtos/list_query.dto';

@Injectable()
export class SpendingsService {
    constructor(
        @InjectRepository(SpendingRepository)
        private spendingRepository: SpendingRepository,
    ) { }

    async addExpenseOrIncome(addExpenseOrEarningDto: ExpenseOrEarningDto, user: User) {
        try {
            const {
                type,
                amount,
                name,
                description,
                income_source,
                income_type,
                date,
                is_recurring
            } = addExpenseOrEarningDto;
            let result: any = {}
            let is_expense: boolean = false
            let is_earning: boolean = false


            const userExist = await User.findOne({
                where: {
                    email: user.email,
                    isActive: true
                }
            });

            if (!userExist)
                throw new BadRequestException(`User not found.`);

            if (type === SpendingEnum.INCOME) {
                if (!income_source || !income_type) throw new BadRequestException("Income source and Income type should be entered.")
                result = await this.addIncome(amount, description, income_source, income_type, date, user.id, is_recurring, name);
                is_earning = true
            }
            if (type === SpendingEnum.EXPENSE) {
                result = await this.addExpense(amount, description, date, user.id, is_recurring, name)
                is_expense = true
            }

            result = {
                expense_earning_id: result.id,
                is_expense,
                is_earning,
                expense_date: date || new Date(),
                user_id: user.id,
                name,
                description,
                created_date: result.createdAt,
                updated_date: result.updatedAt,
                amount,
                income_source: income_source || "",
                income_type: income_type || "",
                is_recurring: is_recurring || false

            }

            return { message: "Income/Expense record added successfully.", data: result };

        } catch (error) {
            throwException(error);
        }
    }

    async addIncome(amount: number, description: string, income_source: string, income_type: string, date: Date = new Date(), userId: string, is_recurring: boolean, name: string) {
        try {
            return await this.spendingRepository.addIncome(amount, description, income_source, income_type, date, userId, is_recurring, name)

        } catch (error) {
            throwException(error);
        }
    }


    async addExpense(amount: number, description: string, date: Date = new Date(), userId: string, is_recurring: boolean, name: string) {
        try {
            return await this.spendingRepository.addExpense(amount, description, date, userId, is_recurring, name)

        } catch (error) {
            throwException(error);
        }
    }


    async editSpending(updateSpendingDto: UpdateSpendingDto, id: number, user: User) {

        let result: any = {}

        try {

            result = await this.spendingRepository.editSpending(updateSpendingDto, id, user)

            return { message: `${updateSpendingDto.type} updated successfully.`, data: result }


        } catch (error) {
            throwException(error);
        }

    }

    async deleteSpending(id: number, userId: string) {

        try {

            await this.spendingRepository.deleteSpending(id, userId)

            return { message: `Spending deleted successfully.`, data: {} }


        } catch (error) {
            throwException(error);
        }

    }

    async getSpendingList(query: PageQueryDto, userId: string) {
        try {
            const { spendings, page } = await this.spendingRepository.fetchAllSpending(query, userId);
            return {
                message: "Spending list fetched successfully.",
                data: { spendings, page }
            };
        } catch (error) {
            throwException(error);
        }
    }

    async getSpendingById(id: number, userId: string) {
        try {
            let result = await this.spendingRepository.getSpendingById(id, userId);

            return { message: "Spending details fetched successfully", data: result }

        } catch (error) {
            throwException(error);
        }
    }
}

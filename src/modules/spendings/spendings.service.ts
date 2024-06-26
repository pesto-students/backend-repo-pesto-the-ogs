import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ExpenseOrEarningDto } from './dto/expense_or_earning.dto';
import { User } from 'src/shared/entity/user.entity';
import { throwException } from 'src/shared/utility/throw-exception';
import { InjectRepository } from '@nestjs/typeorm';
import { SpendingRepository } from './spending.repository';
import { SpendingEnum } from 'src/shared/enums/spending.enum';

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
                date
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
                result = await this.addIncome(amount, description, income_source, income_type, date, user.id);
                is_earning = true
            }
            if (type === SpendingEnum.EXPENSE) {
                result = await this.addExpense(amount, description, date, user.id)
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
                income_type: income_type || ""

            }

            return { message: "Income/Expense record added successfully.", data: result };

        } catch (error) {
            throwException(error);
        }
    }

    async addIncome(amount: number, description: string, income_source: string, income_type: string, date: Date = new Date(), userId: string) {
        try {
            return await this.spendingRepository.addIncome(amount, description, income_source, income_type, date, userId)

        } catch (error) {
            throwException(error);
        }
    }


    async addExpense(amount: number, description: string, date: Date = new Date(), userId: string) {
        try {
            return await this.spendingRepository.addExpense(amount, description, date, userId)

        } catch (error) {
            throwException(error);
        }
    }
}

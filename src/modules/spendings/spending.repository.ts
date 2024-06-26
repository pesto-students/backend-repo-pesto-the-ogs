import { User } from "src/shared/entity/user.entity";
import { EntityRepository, getManager, Repository, Not, } from "typeorm";
import { UserExpenseAndEarning } from "src/shared/entity/user-expense-and-earning.entity";
import { SpendingEnum } from "src/shared/enums/spending.enum";
import { throwException } from "src/shared/utility/throw-exception";


@EntityRepository(UserExpenseAndEarning)
export class SpendingRepository extends Repository<UserExpenseAndEarning>{


    async addIncome(amount: number, description: string, income_source: string, income_type: string, date: Date, userId: string): Promise<UserExpenseAndEarning> {
        const income = new UserExpenseAndEarning();

        income.amount = amount;
        income.description = description;
        income.spendType = SpendingEnum.INCOME;
        income.incomeSource = income_source;
        income.userId = userId;
        income.incomeType = income_type;
        income.date = date || new Date();
        income.createdBy = userId

        try {
            const res = await income.save();
            return res;
        } catch (error) {
            throwException(error);
        }
    }


    async addExpense(amount: number, description: string, date: Date, userId: string): Promise<UserExpenseAndEarning> {

        const expense = new UserExpenseAndEarning();

        expense.amount = amount;
        expense.description = description;
        expense.spendType = SpendingEnum.EXPENSE;
        expense.userId = userId;
        expense.date = date || new Date();
        expense.createdBy = userId

        try {
            const res = await expense.save();
            return res;
        } catch (error) {
            throwException(error);
        }
    }

}


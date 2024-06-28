import { User } from "src/shared/entity/user.entity";
import { EntityRepository, getManager, Repository, Not, } from "typeorm";
import { UserExpenseAndEarning } from "src/shared/entity/user-expense-and-earning.entity";
import { SpendingEnum } from "src/shared/enums/spending.enum";
import { throwException } from "src/shared/utility/throw-exception";
import { UpdateSpendingDto } from "./dto/update_spending.dto";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PageQueryDto } from "src/shared/dtos/list_query.dto";


@EntityRepository(UserExpenseAndEarning)
export class SpendingRepository extends Repository<UserExpenseAndEarning>{


    async addIncome(amount: number, description: string, income_source: string, income_type: string, date: Date, userId: string, is_recurring: boolean, name: string): Promise<UserExpenseAndEarning> {
        const income = new UserExpenseAndEarning();

        income.amount = amount;
        income.description = description;
        income.spendType = SpendingEnum.INCOME;
        income.incomeSource = income_source;
        income.userId = userId;
        income.incomeType = income_type;
        income.date = date || new Date();
        income.createdBy = userId
        income.isRecurring = is_recurring || false
        income.name = name || null

        try {
            const res = await income.save();
            return res;
        } catch (error) {
            throwException(error);
        }
    }


    async addExpense(amount: number, description: string, date: Date, userId: string, is_recurring: boolean, name: string): Promise<UserExpenseAndEarning> {

        const expense = new UserExpenseAndEarning();

        expense.amount = amount;
        expense.description = description;
        expense.spendType = SpendingEnum.EXPENSE;
        expense.userId = userId;
        expense.date = date || new Date();
        expense.createdBy = userId;
        expense.isRecurring = is_recurring || false
        expense.name = name || null

        try {
            const res = await expense.save();
            return res;
        } catch (error) {
            throwException(error);
        }
    }

    async editSpending(updateSpendingDto: UpdateSpendingDto, id: number, user: User): Promise<UserExpenseAndEarning> {
        const { type, name, amount, description, expense_date, income_source, is_recurring, income_type } = updateSpendingDto;
        try {
            let spendingExists = await UserExpenseAndEarning.findOne({ where: { id, isActive: true } });
            if (!spendingExists) throw new NotFoundException("Spending not found.")

            spendingExists.spendType = type || spendingExists.spendType;
            spendingExists.name = name || spendingExists.name;
            spendingExists.amount = amount || spendingExists.amount;
            spendingExists.description = description || spendingExists.description;
            spendingExists.date = expense_date || spendingExists.date;
            spendingExists.incomeSource = income_source || spendingExists.incomeSource;
            spendingExists.isRecurring = is_recurring || spendingExists.isRecurring;
            spendingExists.incomeType = income_type || spendingExists.incomeType
            spendingExists.updatedAt = new Date();
            spendingExists.updatedBy = user.id

            await spendingExists.save()

            return spendingExists

        } catch (error) {
            throwException(error);
        }

    }

    async deleteSpending(id: number, userId: string): Promise<UserExpenseAndEarning> {
        try {
            let spendingExists = await UserExpenseAndEarning.findOne({ where: { id, isActive: true } });
            if (!spendingExists) throw new NotFoundException("Spending not found.")

            spendingExists.isActive = false;
            spendingExists.updatedAt = new Date();
            spendingExists.updatedBy = userId

            await spendingExists.save()

            return spendingExists

        } catch (error) {
            throwException(error);
        }
    }


    async fetchAllSpending(filterDto: PageQueryDto, userId: string) {
        try {
            const listQuery = this.manager
                .createQueryBuilder(UserExpenseAndEarning, "userExpenseAndEarning")
                .where("userExpenseAndEarning.userId =:userId", { userId })
                .andWhere("userExpenseAndEarning.is_active =:activeStatus", { activeStatus: true })

            if (filterDto) {
                listQuery.skip(filterDto.offset * filterDto.limit);
                listQuery.take(filterDto.limit);
                listQuery.orderBy(`userExpenseAndEarning.${filterDto.orderBy}`, filterDto.orderDir);
            }

            if (filterDto.income_type_filter) {
                listQuery.andWhere("userExpenseAndEarning.income_type =:income_type_filter", { income_type_filter: filterDto.income_type_filter })

            }

            if (filterDto.is_recurring_filter) {
                let recurringStatus = (filterDto.is_recurring_filter == 0 || "0") ? false : true
                listQuery.andWhere("userExpenseAndEarning.is_recurring =:recurringStatus", { recurringStatus })

            }

            if (filterDto.income_source_filter) {
                listQuery.andWhere("userExpenseAndEarning.income_source =:income_source_filter", { income_source_filter: filterDto.income_source_filter })

            }

            if (filterDto.search) {
                listQuery.andWhere(
                    "((userExpenseAndEarning.name like :search) or (userExpenseAndEarning.description like :search))",
                    { search: `%${filterDto.search}%` }
                );
            }

            const fetchAppSpendings = await listQuery.getManyAndCount();

            if (filterDto) {
                filterDto.count = fetchAppSpendings[1];
            }

            return { spendings: fetchAppSpendings[0], page: filterDto };
        } catch (error) {
            throwException(error);
        }
    }

    async getSpendingById(id: number, userId: string): Promise<UserExpenseAndEarning> {
        try {

            const getSpendingById = await UserExpenseAndEarning.findOne({ where: { id, isActive: true } })
            if (!getSpendingById) throw new NotFoundException("Spending not found.");

            if (getSpendingById.userId !== userId) throw new UnauthorizedException("You are not allowed to access this resource.");

            return getSpendingById

        } catch (error) {
            throwException(error);
        }

    }

}


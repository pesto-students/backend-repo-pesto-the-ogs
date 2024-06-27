import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SpendingEnum } from "../enums/spending.enum";
import { User } from "./user.entity";


@Entity('user-expenses-and-earning')
export class UserExpenseAndEarning extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;

    @Column("enum", { name: "spend_type", enum: SpendingEnum })
    spendType: string;

    @Column("character varying", { name: "name", nullable: true })
    name: string;

    @Column("character varying", { name: "description" })
    description: string;

    @Column("integer", { name: "amount" })
    amount: number;

    @Column("character varying", { name: "income_source", length: 255, nullable: true })
    incomeSource: string;

    @Column("character varying", { name: "income_type", length: 255, nullable: true })
    incomeType: string;

    @Column({
        type: 'timestamp with time zone',
        name: 'date'
    })
    date: Date;

    @Column({ name: "is_recurring", default: false })
    isRecurring: boolean

    @Column({ name: "is_active", default: true })
    isActive: boolean

    @CreateDateColumn({
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP(6)',
        name: 'created_at'
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
        name: 'updated_at'
    })
    updatedAt: Date;


    @Column("uuid", { name: "created_by", nullable: true })
    createdBy: string | null;

    @Column("uuid", { name: "updated_by", nullable: true })
    updatedBy: string | null;




    @ManyToOne(
        () => User,
        user => user.id
    )
    @JoinColumn([{ name: "userId", referencedColumnName: "id" }])
    user: User;


}
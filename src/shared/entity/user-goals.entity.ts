import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { GoalCategories } from "./goal-categories.entity";


@Entity('user-expenses-and-earnings')
export class UserExpenseAndEarning extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;

    @Column()
    goalCategoryId: number;

    @Column("character varying", { name: "name" })
    name: string;

    @Column("integer", { name: "expected_interval" })//no of months expected to complete goal
    expectedInterval: number;

    @Column({ name: "is_achieved", default: false })
    isAchieved: boolean;

    @Column({
        type: 'timestamp with time zone',
        name: 'max_completion_date'
    })
    maxCompletionDate: Date;//date by which the goal shall be completed

    @Column({ name: "is_active", default: true })
    isActive: boolean;

    @Column({ name: "is_deleted", default: false })
    isDeleted: boolean;


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


    @ManyToOne(
        () => GoalCategories,
        goalCategory => goalCategory.id
    )
    @JoinColumn([{ name: "goalCategoryId", referencedColumnName: "id" }])
    goalCategory: GoalCategories;


}
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('goal-categories')
export class GoalCategories extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    category_name: string;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        name: 'created_at'
    })
    createdAt: Date;

    @Column({ name: 'is_active', default: true })
    isActive: boolean
}
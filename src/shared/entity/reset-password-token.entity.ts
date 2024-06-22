import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('reset-password-tokens')
export class ResetPasswordToken extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column()
    userId: string;

    @Column({ default: false })
    isActive: boolean;

    @Column({ type: 'bigint' })
    expireTime: number;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        name: 'created_at'
    })
    createdAt: Date;


    @ManyToOne(
        () => User,
        user => user.id
    )
    @JoinColumn([{ name: "userId", referencedColumnName: "id" }])
    user: User;


}
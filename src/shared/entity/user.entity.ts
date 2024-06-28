import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { RegisteredVia } from "../enums/registered-via.enum";
import { Role } from "../enums/role.enum";

@Entity('users')
export class User extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column("character varying", { name: "first_name", length: 255 })
    firstName: string;

    @Column("character varying", { name: "last_name", length: 255, nullable: true })
    lastName: string;

    @Column("varchar", { name: "email", length: 150 })
    email: string;

    @Column("enum", { name: "role", enum: Role, default: Role.END_USER })
    role: Role;

    @Column({ name: "is_active", default: true })
    isActive: boolean;

    @Column("character varying", { name: "password", length: 255, nullable: true })
    password: string;

    @Column("character varying", { name: "phone_number", length: 15, nullable: true })
    phoneNumber: string | null;

    @Column("character varying", { name: "country_code", length: 15, nullable: true })
    countryCode: string | null;

    @Column({ type: 'timestamp with time zone', name: "dob", nullable: true })
    dob: Date | null;

    @Column("enum", { name: "registered_via", enum: RegisteredVia, default: RegisteredVia.WEB })
    registeredVia: RegisteredVia;

    @Column("varchar", { name: "social_account_id", length: 255, nullable: true })
    socialAccountId: string;

    @Column("varchar", { name: "salt", length: 50 })
    salt: string;


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


    @BeforeInsert()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, this.salt);
        }
    }

    async validatePassword(password: string): Promise<boolean> {

        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password ? true : false;

    }

}
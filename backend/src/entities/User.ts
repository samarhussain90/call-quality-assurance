import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Organization } from "./Organization";
import { Team } from "./Team";

export enum UserRole {
    ADMIN = "admin",
    MANAGER = "manager",
    AGENT = "agent",
    VIEWER = "viewer"
}

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    email: string;

    @Column()
    password_hash: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({ nullable: true })
    avatar_url: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.AGENT
    })
    role: UserRole;

    @Column({ default: true })
    is_active: boolean;

    @Column({ default: false })
    email_verified: boolean;

    @Column({ type: "jsonb", nullable: true })
    preferences: {
        theme: string;
        notifications: {
            email: boolean;
            slack: boolean;
        };
    };

    @ManyToOne(() => Organization, org => org.users)
    @JoinColumn({ name: "organization_id" })
    organization: Organization;

    @Column()
    organization_id: string;

    @OneToMany(() => Team, team => team.members)
    teams: Team[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
} 
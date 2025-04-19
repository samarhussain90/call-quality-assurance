import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Team } from "./Team";

@Entity("organizations")
export class Organization {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    slug: string;

    @Column({ nullable: true })
    logo_url: string;

    @Column({ default: true })
    is_active: boolean;

    @Column({ type: "jsonb", nullable: true })
    settings: {
        timezone: string;
        language: string;
        features: string[];
    };

    @OneToMany(() => User, user => user.organization)
    users: User[];

    @OneToMany(() => Team, team => team.organization)
    teams: Team[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
} 
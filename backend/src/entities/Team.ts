import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable, JoinColumn } from "typeorm";
import { Organization } from "./Organization";
import { User } from "./User";

@Entity("teams")
export class Team {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: true })
    is_active: boolean;

    @ManyToOne(() => Organization, org => org.teams)
    @JoinColumn({ name: "organization_id" })
    organization: Organization;

    @Column()
    organization_id: string;

    @ManyToMany(() => User, user => user.teams)
    @JoinTable({
        name: "team_members",
        joinColumn: {
            name: "team_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "user_id",
            referencedColumnName: "id"
        }
    })
    members: User[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
} 
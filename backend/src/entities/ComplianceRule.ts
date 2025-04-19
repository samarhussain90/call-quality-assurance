import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Organization } from "./Organization";

export enum RuleType {
    KEYWORD = "keyword",
    SENTIMENT = "sentiment",
    DURATION = "duration",
    TOPIC = "topic",
    CUSTOM = "custom"
}

export enum RuleSeverity {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}

@Entity("compliance_rules")
export class ComplianceRule {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({
        type: "enum",
        enum: RuleType,
        default: RuleType.KEYWORD
    })
    type: RuleType;

    @Column({
        type: "enum",
        enum: RuleSeverity,
        default: RuleSeverity.MEDIUM
    })
    severity: RuleSeverity;

    @Column({ type: "jsonb" })
    conditions: {
        field: string;
        operator: string;
        value: any;
    }[];

    @Column({ type: "jsonb", nullable: true })
    actions: {
        type: string;
        target: string;
        value: any;
    }[];

    @Column({ default: true })
    is_active: boolean;

    @Column({ type: "int", default: 0 })
    score_impact: number;

    @ManyToOne(() => Organization, org => org.id)
    @JoinColumn({ name: "organization_id" })
    organization: Organization;

    @Column()
    organization_id: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
} 
import { AppDataSource } from "../config/database";
import { ComplianceRule, RuleType, RuleSeverity } from "../entities/ComplianceRule";

interface Condition {
    field: string;
    operator: string;
    value: any;
}

interface Action {
    type: string;
    target: string;
    value: any;
}

interface CreateRuleData {
    name: string;
    description: string;
    type: RuleType;
    severity: RuleSeverity;
    conditions: Condition[];
    actions?: Action[];
    organization_id: string;
    score_impact?: number;
}

export class ComplianceService {
    private ruleRepository = AppDataSource.getRepository(ComplianceRule);

    async createRule(data: CreateRuleData) {
        const rule = this.ruleRepository.create(data);
        return await this.ruleRepository.save(rule);
    }

    async evaluateCall(callData: any, organization_id: string) {
        const rules = await this.ruleRepository.find({
            where: { organization_id, is_active: true }
        });

        const violations = [];
        let totalScoreImpact = 0;

        for (const rule of rules) {
            const isViolated = this.evaluateRule(rule, callData);
            if (isViolated) {
                violations.push({
                    rule_id: rule.id,
                    rule_name: rule.name,
                    severity: rule.severity,
                    impact: rule.score_impact
                });
                totalScoreImpact += rule.score_impact;

                // Execute rule actions if any
                if (rule.actions) {
                    await this.executeActions(rule.actions, callData);
                }
            }
        }

        return {
            violations,
            totalScoreImpact,
            finalScore: Math.max(0, 100 - totalScoreImpact)
        };
    }

    private evaluateRule(rule: ComplianceRule, callData: any): boolean {
        switch (rule.type) {
            case RuleType.KEYWORD:
                return this.evaluateKeywordRule(rule, callData);
            case RuleType.SENTIMENT:
                return this.evaluateSentimentRule(rule, callData);
            case RuleType.DURATION:
                return this.evaluateDurationRule(rule, callData);
            case RuleType.TOPIC:
                return this.evaluateTopicRule(rule, callData);
            case RuleType.CUSTOM:
                return this.evaluateCustomRule(rule, callData);
            default:
                return false;
        }
    }

    private evaluateKeywordRule(rule: ComplianceRule, callData: any): boolean {
        const keywords = callData.transcript?.keywords || [];
        return rule.conditions.some(condition => {
            if (condition.operator === "contains") {
                return keywords.includes(condition.value);
            }
            return false;
        });
    }

    private evaluateSentimentRule(rule: ComplianceRule, callData: any): boolean {
        const sentiment = callData.sentiment?.score || 0;
        return rule.conditions.some(condition => {
            if (condition.operator === "less_than") {
                return sentiment < condition.value;
            }
            if (condition.operator === "greater_than") {
                return sentiment > condition.value;
            }
            return false;
        });
    }

    private evaluateDurationRule(rule: ComplianceRule, callData: any): boolean {
        const duration = callData.duration || 0;
        return rule.conditions.some(condition => {
            if (condition.operator === "less_than") {
                return duration < condition.value;
            }
            if (condition.operator === "greater_than") {
                return duration > condition.value;
            }
            return false;
        });
    }

    private evaluateTopicRule(rule: ComplianceRule, callData: any): boolean {
        const topics = callData.topics || [];
        return rule.conditions.some(condition => {
            if (condition.operator === "contains") {
                return topics.includes(condition.value);
            }
            return false;
        });
    }

    private evaluateCustomRule(rule: ComplianceRule, callData: any): boolean {
        // Implement custom rule evaluation logic here
        return false;
    }

    private async executeActions(actions: Action[], callData: any) {
        for (const action of actions) {
            switch (action.type) {
                case "notify":
                    // Implement notification logic
                    break;
                case "flag":
                    // Implement flagging logic
                    break;
                case "escalate":
                    // Implement escalation logic
                    break;
                default:
                    break;
            }
        }
    }
} 
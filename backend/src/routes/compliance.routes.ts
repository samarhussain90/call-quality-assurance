import { Router, Request } from "express";
import { ComplianceService } from "../services/compliance.service";
import { authMiddleware, roleMiddleware, AuthRequest } from "../middleware/auth.middleware";
import { z } from "zod";
import { RuleType, RuleSeverity } from "../entities/ComplianceRule";

const router = Router();
const complianceService = new ComplianceService();

// Validation schemas
const conditionSchema = z.object({
    field: z.string(),
    operator: z.string(),
    value: z.any()
});

const actionSchema = z.object({
    type: z.string(),
    target: z.string(),
    value: z.any()
});

const createRuleSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(10),
    type: z.nativeEnum(RuleType),
    severity: z.nativeEnum(RuleSeverity),
    conditions: z.array(conditionSchema),
    actions: z.array(actionSchema).optional(),
    score_impact: z.number().min(0).max(100).optional()
});

// Create a new compliance rule
router.post("/rules", authMiddleware, roleMiddleware(["admin", "manager"]), async (req: AuthRequest, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const data = createRuleSchema.parse(req.body);
        const rule = await complianceService.createRule({
            ...data,
            organization_id: req.user.organizationId
        });
        res.json(rule);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Validation error", errors: error.errors });
        }
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: "An unknown error occurred" });
        }
    }
});

// Evaluate a call against compliance rules
router.post("/evaluate", authMiddleware, async (req: AuthRequest, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { callData } = req.body;
        if (!callData) {
            return res.status(400).json({ message: "Call data is required" });
        }

        const result = await complianceService.evaluateCall(callData, req.user.organizationId);
        res.json(result);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: "An unknown error occurred" });
        }
    }
});

export default router; 
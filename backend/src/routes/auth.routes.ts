import { Router } from "express";
import { AuthService } from "../services/auth.service";
import { z } from "zod";

const router = Router();
const authService = new AuthService();

// Validation schemas
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    organizationName: z.string().min(2)
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

// Register route
router.post("/register", async (req, res) => {
    try {
        const data = registerSchema.parse(req.body);
        const result = await authService.registerUser(data);
        res.json(result);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Validation error", errors: error.errors });
        }
        res.status(400).json({ message: error.message });
    }
});

// Login route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const result = await authService.loginUser(email, password);
        res.json(result);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Validation error", errors: error.errors });
        }
        res.status(400).json({ message: error.message });
    }
});

export default router; 
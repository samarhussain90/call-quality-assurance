import express from 'express';
import { signup, login } from '../controllers/authController';

const router = express.Router();

// Signup endpoint
router.post('/signup', signup);

// Login endpoint
router.post('/login', login);

export default router; 
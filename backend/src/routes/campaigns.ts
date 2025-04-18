import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { listCampaigns } from '../controllers/campaignsController';

const router = express.Router();

// Protected: list campaigns
router.get('/', authenticateJWT, listCampaigns);

export default router; 
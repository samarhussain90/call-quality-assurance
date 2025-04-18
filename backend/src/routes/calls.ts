import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { listCalls, getCallDetails, updateCall, bulkUpdateCalls } from '../controllers/callsController';

const router = express.Router();

// List and filter calls (with pagination)
router.get('/', authenticateJWT, listCalls);

// Get call details
router.get('/:callId', authenticateJWT, getCallDetails);

// Update a single call (notes, tags, status)
router.patch('/:callId', authenticateJWT, updateCall);

// Bulk update calls (status, tags)
router.post('/bulk', authenticateJWT, bulkUpdateCalls);

export default router; 
import express from 'express';
import { resultsCallback } from '../controllers/webhookController';

const router = express.Router();

// Results callback endpoint from Make.com
router.post('/callback/:callId', resultsCallback);

export default router; 
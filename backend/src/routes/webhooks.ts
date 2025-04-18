import express from 'express';

const router = express.Router();

// Ingestion endpoint stub
router.post('/ingest/:organizationId/:token', (req, res) => {
  res.status(202).json({ message: 'Ingestion received' });
});

export default router; 
import { Request, Response, RequestHandler } from 'express';
import pool from '../db';
import { AuthRequest } from '../middleware/authMiddleware';

// List campaigns for the authenticated organization
export const listCampaigns: RequestHandler = async (req, res) => {
  const { organizationId } = req as AuthRequest;
  try {
    const result = await pool.query(
      'SELECT id, name FROM campaigns WHERE organization_id = $1',
      [organizationId]
    );
    res.json({ campaigns: result.rows });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 
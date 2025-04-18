import { Request, Response } from 'express';
import pool from '../db';
import axios from 'axios';
import crypto from 'crypto';

const MAKE_TRIGGER_URL = process.env.MAKE_SCENARIO_WEBHOOK_URL!;
const API_BASE_URL = process.env.API_BASE_URL!;
const CALLBACK_SECRET = process.env.MAKE_CALLBACK_SECRET!;

// Ingestion controller: handle inbound call webhook, store call, and trigger Make.com
export const ingestWebhook = async (req: Request, res: Response) => {
  const { organizationId, token } = req.params;
  // Validate organization and token
  const orgRes = await pool.query(
    'SELECT id FROM organizations WHERE id = $1 AND token = $2',
    [organizationId, token]
  );
  if (orgRes.rowCount === 0) {
    return res.status(401).json({ error: 'Invalid organization or token' });
  }

  const { recordingUrl, agent, phoneNumber } = req.body;
  if (!recordingUrl) {
    return res.status(400).json({ error: 'Missing recording URL' });
  }

  try {
    // Determine default campaign for organization
    const campRes = await pool.query(
      'SELECT id FROM campaigns WHERE organization_id = $1 ORDER BY created_at LIMIT 1',
      [organizationId]
    );
    const campaignId = campRes.rows[0]?.id;
    if (!campaignId) {
      return res.status(404).json({ error: 'No campaign found' });
    }

    // Create new call record
    const callId = crypto.randomUUID();
    await pool.query(
      'INSERT INTO calls (id, organization_id, campaign_id, recording_url, status, agent, phone_number) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [callId, organizationId, campaignId, recordingUrl, 'pending', agent || null, phoneNumber || null]
    );

    // Build callback URL for Make.com to POST results
    const callbackUrl = `${API_BASE_URL}/api/v1/results/callback/${callId}`;

    // Trigger Make.com scenario
    axios.post(MAKE_TRIGGER_URL, {
      recordingUrl,
      callId,
      organizationId,
      campaignId,
      callbackUrl,
    }).catch(err => console.error('Error triggering Make scenario:', err));

    // Respond to sender
    res.status(202).json({ callId, status: 'pending' });
  } catch (error) {
    console.error('Ingestion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for handling results callback from Make.com
export const resultsCallback = (req: Request, res: Response) => {
  const { callId } = req.params;
  // TODO: validate and process analysis results payload from Make.com
  res.status(200).json({ message: `Results received for call ${callId}` });
}; 
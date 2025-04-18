import type { RequestHandler } from 'express';
import { Response } from 'express';
import pool from '../db';
import { AuthRequest } from '../middleware/authMiddleware';

interface GetCallsQuery {
  campaignId?: string;
  status?: string;
  agent?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: string;
  pageSize?: string;
  search?: string;
}

// List and filter calls with pagination
export const listCalls: RequestHandler = async (req, res) => {
  const { organizationId } = req as AuthRequest;
  const {
    campaignId,
    status,
    agent,
    dateFrom,
    dateTo,
    page = '1',
    pageSize = '10',
    search,
  } = req.query as Record<string, string>;

  if (!campaignId) {
    return void res.status(400).json({ error: 'campaignId is required' });
  }
  const pageNum = parseInt(page, 10);
  const sizeNum = parseInt(pageSize, 10);
  const offset = (pageNum - 1) * sizeNum;

  const params: unknown[] = [organizationId, campaignId];
  let whereClause = 'WHERE organization_id = $1 AND campaign_id = $2';

  if (status) {
    params.push(status);
    whereClause += ` AND status = $${params.length}`;
  }
  if (agent) {
    params.push(`%${agent}%`);
    whereClause += ` AND agent ILIKE $${params.length}`;
  }
  if (dateFrom) {
    params.push(dateFrom);
    whereClause += ` AND created_at >= $${params.length}`;
  }
  if (dateTo) {
    params.push(dateTo);
    whereClause += ` AND created_at <= $${params.length}`;
  }
  if (search) {
    params.push(`%${search}%`);
    whereClause += ` AND notes ILIKE $${params.length}`;
  }

  try {
    // total count
    const totalRes = await pool.query(
      `SELECT COUNT(*) AS count FROM calls ${whereClause}`,
      params
    );
    const total = parseInt(totalRes.rows[0].count, 10);

    // fetch paginated rows
    const dataParams = [...params, sizeNum, offset];
    const dataRes = await pool.query(
      `SELECT id, recording_url, status, agent, phone_number, created_at, notes, tags
       FROM calls
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
      dataParams
    );

    res.json({ calls: dataRes.rows, pagination: { total, page: pageNum, pageSize: sizeNum } });
  } catch (err) {
    console.error('Error listing calls:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single call details
export const getCallDetails: RequestHandler = async (req, res) => {
  const { organizationId } = req as AuthRequest;
  const { callId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM calls WHERE id = $1 AND organization_id = $2',
      [callId, organizationId]
    );
    if (result.rowCount === 0) {
      return void res.status(404).json({ error: 'Call not found' });
    }
    res.json({ call: result.rows[0] });
  } catch (err) {
    console.error('Error fetching call details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a single call (notes, tags, status)
export const updateCall: RequestHandler = async (req, res) => {
  const { organizationId } = req as AuthRequest;
  const { callId } = req.params;
  const { notes, tags, status } = req.body;

  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (notes !== undefined) {
    fields.push(`notes = $${idx++}`);
    values.push(notes);
  }
  if (tags !== undefined) {
    fields.push(`tags = $${idx++}`);
    values.push(tags);
  }
  if (status !== undefined) {
    fields.push(`status = $${idx++}`);
    values.push(status);
  }
  if (fields.length === 0) {
    return void res.status(400).json({ error: 'No fields to update' });
  }

  values.push(callId, organizationId);
  const sql = `UPDATE calls SET ${fields.join(', ')} WHERE id = $${idx++} AND organization_id = $${idx} RETURNING *`;

  try {
    const result = await pool.query(sql, values);
    if (result.rowCount === 0) {
      return void res.status(404).json({ error: 'Call not found' });
    }
    res.json({ call: result.rows[0] });
  } catch (err) {
    console.error('Error updating call:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Bulk update calls (status and tags)
export const bulkUpdateCalls: RequestHandler = async (req, res) => {
  const { organizationId } = req as AuthRequest;
  const { callIds, tagsToAdd, tagsToRemove, status } = req.body as Record<string, any>;

  if (!Array.isArray(callIds) || callIds.length === 0) {
    return void res.status(400).json({ error: 'callIds array is required' });
  }

  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      if (status) {
        await client.query(
          'UPDATE calls SET status = $1 WHERE id = ANY($2::text[]) AND organization_id = $3',
          [status, callIds, organizationId]
        );
      }
      if (Array.isArray(tagsToAdd) && tagsToAdd.length) {
        await client.query(
          `UPDATE calls SET tags = array(
             SELECT DISTINCT unnest(coalesce(tags, '{}')::text[]) UNION ALL SELECT unnest($1::text[])
           ) WHERE id = ANY($2::text[]) AND organization_id = $3`,
          [tagsToAdd, callIds, organizationId]
        );
      }
      if (Array.isArray(tagsToRemove) && tagsToRemove.length) {
        for (const tag of tagsToRemove) {
          await client.query(
            'UPDATE calls SET tags = array_remove(tags, $1) WHERE id = ANY($2::text[]) AND organization_id = $3',
            [tag, callIds, organizationId]
          );
        }
      }
      await client.query('COMMIT');
      res.json({ message: 'Bulk update applied' });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Bulk update error:', err);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Bulk update connection error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get calls with filtering and pagination
export const getCalls: RequestHandler = async (req, res) => {
  const {
    campaignId,
    status,
    agent,
    dateFrom,
    dateTo,
    page = '1',
    pageSize = '10',
    search,
  } = req.query as GetCallsQuery;

  try {
    // Build the WHERE clause dynamically
    const conditions = ['campaign_id = $1'];
    const values = [campaignId];
    let paramCount = 1;

    if (status) {
      paramCount++;
      conditions.push(`status = $${paramCount}`);
      values.push(status);
    }

    if (agent) {
      paramCount++;
      conditions.push(`agent = $${paramCount}`);
      values.push(agent);
    }

    if (dateFrom) {
      paramCount++;
      conditions.push(`created_at >= $${paramCount}`);
      values.push(dateFrom);
    }

    if (dateTo) {
      paramCount++;
      conditions.push(`created_at <= $${paramCount}`);
      values.push(dateTo);
    }

    if (search) {
      paramCount++;
      conditions.push(`(
        agent ILIKE $${paramCount} OR
        notes ILIKE $${paramCount} OR
        phone_number ILIKE $${paramCount}
      )`);
      values.push(`%${search}%`);
    }

    // Calculate offset for pagination
    const pageNum = Number(page);
    const pageSizeNum = Number(pageSize);
    const offset = (pageNum - 1) * pageSizeNum;
    paramCount++;
    values.push(pageSizeNum.toString());
    paramCount++;
    values.push(offset.toString());

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM calls
      WHERE ${conditions.join(' AND ')}
    `;
    const { rows: [{ total }] } = await pool.query(countQuery, values.slice(0, -2));

    // Get paginated results
    const query = `
      SELECT
        id,
        recording_url,
        status,
        agent,
        phone_number,
        notes,
        tags,
        created_at as date,
        EXTRACT(EPOCH FROM duration) as duration,
        score
      FROM calls
      WHERE ${conditions.join(' AND ')}
      ORDER BY created_at DESC
      LIMIT $${paramCount - 1}
      OFFSET $${paramCount}
    `;

    const { rows: calls } = await pool.query(query, values);

    // Format the results
    const formattedCalls = calls.map(call => ({
      ...call,
      duration: formatDuration(call.duration),
      date: formatDate(call.date),
      score: Math.round(call.score * 100),
    }));

    res.json({
      calls: formattedCalls,
      total: Number(total),
    });
  } catch (error) {
    console.error('Error fetching calls:', error);
    res.status(500).json({ error: 'Could not fetch calls' });
  }
};

// Helper functions for formatting
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Update call status
export const updateCallStatus: RequestHandler = async (req, res) => {
  const { callId } = req.params;
  const { status } = req.body;

  try {
    const { rows } = await pool.query(
      'UPDATE calls SET status = $1 WHERE id = $2 RETURNING *',
      [status, callId]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Call not found' });
      return;
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating call status:', error);
    res.status(500).json({ error: 'Could not update call status' });
  }
};

// Update call tags
export const updateCallTags: RequestHandler = async (req, res) => {
  const { callId } = req.params;
  const { tags } = req.body;

  try {
    const { rows } = await pool.query(
      'UPDATE calls SET tags = $1 WHERE id = $2 RETURNING *',
      [tags, callId]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Call not found' });
      return;
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating call tags:', error);
    res.status(500).json({ error: 'Could not update call tags' });
  }
};

// Update call notes
export const updateCallNotes: RequestHandler = async (req, res) => {
  const { callId } = req.params;
  const { notes } = req.body;

  try {
    const { rows } = await pool.query(
      'UPDATE calls SET notes = $1 WHERE id = $2 RETURNING *',
      [notes, callId]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Call not found' });
      return;
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating call notes:', error);
    res.status(500).json({ error: 'Could not update call notes' });
  }
}; 
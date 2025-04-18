import { RequestHandler } from 'express';
import pool from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Signup controller: create user, organization, default campaign, and return JWT
export const signup: RequestHandler = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    res.status(400).json({ error: 'Missing fields' });
    return;
  }
  try {
    console.log('Starting signup process for:', email);
    const hashed = await bcrypt.hash(password, 10);
    const client = await pool.connect();
    try {
      console.log('Connected to database, starting transaction');
      await client.query('BEGIN');
      // Create organization
      const organizationId = crypto.randomUUID();
      const organizationName = `${fullName}'s Organization`;
      const organizationToken = crypto.randomUUID();
      console.log('Creating organization:', organizationName);
      await client.query(
        'INSERT INTO organizations (id, name, token) VALUES ($1, $2, $3)',
        [organizationId, organizationName, organizationToken]
      );
      // Create default campaign
      const campaignId = crypto.randomUUID();
      console.log('Creating default campaign');
      await client.query(
        'INSERT INTO campaigns (id, name, organization_id) VALUES ($1, $2, $3)',
        [campaignId, 'Default Campaign', organizationId]
      );
      // Create user
      const userId = crypto.randomUUID();
      console.log('Creating user:', email);
      const insertUser = await client.query(
        'INSERT INTO users (id, full_name, email, password_hash, organization_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, full_name, email',
        [userId, fullName, email, hashed, organizationId]
      );
      await client.query('COMMIT');
      console.log('Transaction committed successfully');
      const user = insertUser.rows[0];
      const token = jwt.sign({ userId: user.id, organizationId }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user: { id: user.id, fullName: user.full_name, email: user.email }, organizationId });
    } catch (err: any) {
      await client.query('ROLLBACK');
      console.error('Signup transaction error:', err);
      res.status(500).json({ error: 'Could not complete signup', details: err.message });
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Could not complete signup', details: err.message });
  }
};

// Login controller: verify credentials and return JWT
export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Missing fields' });
    return;
  }
  try {
    const userRes = await pool.query(
      'SELECT id, full_name, email, password_hash, organization_id FROM users WHERE email = $1',
      [email]
    );
    if (userRes.rowCount === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const user = userRes.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const token = jwt.sign({ userId: user.id, organizationId: user.organization_id }, JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token, user: { id: user.id, fullName: user.full_name, email: user.email } });
    return;
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 
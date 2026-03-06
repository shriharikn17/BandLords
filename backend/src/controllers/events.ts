import { Request, Response } from 'express';
import { query } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { city, band_id } = req.query;

    let queryString = 'SELECT e.*, b.name as band_name, b.band_image_url FROM events e JOIN bands b ON e.band_id = b.id WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (city) {
      queryString += ` AND e.city ILIKE $${paramIndex}`;
      params.push(`%${city}%`);
      paramIndex++;
    }

    if (band_id) {
      queryString += ` AND e.band_id = $${paramIndex}`;
      params.push(band_id);
      paramIndex++;
    }

    queryString += ' ORDER BY e.event_date ASC';

    const result = await query(queryString, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Server error fetching events' });
  }
};

export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT e.*, b.name as band_name, b.band_image_url FROM events e JOIN bands b ON e.band_id = b.id WHERE e.id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Server error fetching event details' });
  }
};

export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, lineup, venue, location, city, event_date, poster_image_url, ticket_link } = req.body;
    const user_id = req.user.id;

    // Get band id for the current user
    const bandResult = await query('SELECT id FROM bands WHERE user_id = $1', [user_id]);

    if (bandResult.rows.length === 0) {
      res.status(403).json({ error: 'Only bands can create events' });
      return;
    }

    const band_id = bandResult.rows[0].id;

    const newEvent = await query(
      `INSERT INTO events (band_id, title, description, lineup, venue, location, city, event_date, poster_image_url, ticket_link)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [band_id, title, description, lineup, venue, location, city, event_date, poster_image_url, ticket_link]
    );

    res.status(201).json(newEvent.rows[0]);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Server error creating event' });
  }
};

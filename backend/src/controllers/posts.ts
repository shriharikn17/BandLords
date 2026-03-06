import { Request, Response } from 'express';
import { query } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { band_id } = req.query;

    let queryString = 'SELECT p.*, b.name as band_name, b.band_image_url FROM posts p JOIN bands b ON p.band_id = b.id WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (band_id) {
      queryString += ` AND p.band_id = $${paramIndex}`;
      params.push(band_id);
      paramIndex++;
    }

    queryString += ' ORDER BY p.created_at DESC';

    const result = await query(queryString, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Server error fetching posts' });
  }
};

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, content, image_url } = req.body;
    const user_id = req.user.id;

    // Get band id for the current user
    const bandResult = await query('SELECT id FROM bands WHERE user_id = $1', [user_id]);

    if (bandResult.rows.length === 0) {
      res.status(403).json({ error: 'Only bands can create posts' });
      return;
    }

    const band_id = bandResult.rows[0].id;

    const newPost = await query(
      `INSERT INTO posts (band_id, type, content, image_url)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [band_id, type || 'announcement', content, image_url]
    );

    res.status(201).json(newPost.rows[0]);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Server error creating post' });
  }
};

import { Request, Response } from 'express';
import { query } from '../config/db';

// Get all merch
export const getAllMerch = async (req: Request, res: Response): Promise<void> => {
    try {
        const { band_id } = req.query;

        let queryStr = 'SELECT m.*, b.name as band_name FROM merch m JOIN bands b ON m.band_id = b.id';
        const queryParams: any[] = [];

        if (band_id) {
            queryStr += ' WHERE m.band_id = $1';
            queryParams.push(band_id);
        }

        queryStr += ' ORDER BY m.created_at DESC';

        const result = await query(queryStr, queryParams);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching merch:', error);
        res.status(500).json({ error: 'Server error fetching merch' });
    }
};

// Get single merch item
export const getMerchById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await query(
            'SELECT m.*, b.name as band_name FROM merch m JOIN bands b ON m.band_id = b.id WHERE m.id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Merch not found' });
            return;
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching merch item:', error);
        res.status(500).json({ error: 'Server error fetching merch item' });
    }
};

// Create new merch (Band only)
export const createMerch = async (req: any, res: Response): Promise<void> => {
    try {
        // Check if user is a band
        if (req.user.role !== 'band') {
            res.status(403).json({ error: 'Only bands can create merch' });
            return;
        }

        // Get band id for the user
        const bandResult = await query('SELECT id FROM bands WHERE user_id = $1', [req.user.id]);
        if (bandResult.rows.length === 0) {
            res.status(404).json({ error: 'Band profile not found' });
            return;
        }

        const bandId = bandResult.rows[0].id;
        const { name, description, price, currency, type, image_url, stock_quantity } = req.body;

        const result = await query(
            `INSERT INTO merch 
       (band_id, name, description, price, currency, type, image_url, stock_quantity) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
            [bandId, name, description, price, currency || 'USD', type, image_url, stock_quantity || 0]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating merch:', error);
        res.status(500).json({ error: 'Server error creating merch' });
    }
};

// Update merch
export const updateMerch = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, price, type, image_url, stock_quantity } = req.body;

        // Verify ownership
        const merchCheck = await query(
            'SELECT m.* FROM merch m JOIN bands b ON m.band_id = b.id WHERE m.id = $1 AND b.user_id = $2',
            [id, req.user.id]
        );

        if (merchCheck.rows.length === 0) {
            res.status(403).json({ error: 'Not authorized to update this merch' });
            return;
        }

        const result = await query(
            `UPDATE merch 
       SET name = COALESCE($1, name), 
           description = COALESCE($2, description), 
           price = COALESCE($3, price), 
           type = COALESCE($4, type), 
           image_url = COALESCE($5, image_url), 
           stock_quantity = COALESCE($6, stock_quantity),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 
       RETURNING *`,
            [name, description, price, type, image_url, stock_quantity, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating merch:', error);
        res.status(500).json({ error: 'Server error updating merch' });
    }
};

// Delete merch
export const deleteMerch = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Verify ownership
        const merchCheck = await query(
            'SELECT m.* FROM merch m JOIN bands b ON m.band_id = b.id WHERE m.id = $1 AND b.user_id = $2',
            [id, req.user.id]
        );

        if (merchCheck.rows.length === 0) {
            res.status(403).json({ error: 'Not authorized to delete this merch' });
            return;
        }

        await query('DELETE FROM merch WHERE id = $1', [id]);
        res.json({ message: 'Merch deleted successfully' });
    } catch (error) {
        console.error('Error deleting merch:', error);
        res.status(500).json({ error: 'Server error deleting merch' });
    }
};

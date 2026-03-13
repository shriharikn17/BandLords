import { Request, Response } from 'express';
import { query } from '../config/db';

export const createOrder = async (req: any, res: Response): Promise<void> => {
    try {
        const { items, total_amount } = req.body;
        const user_id = req.user.id;

        if (!items || items.length === 0) {
            res.status(400).json({ error: 'Order must contain items' });
            return;
        }

        // Begin transaction
        await query('BEGIN', []);

        // Create the order
        const orderResult = await query(
            'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING id',
            [user_id, total_amount, 'pending']
        );
        const orderId = orderResult.rows[0].id;

        // Create order items
        for (const item of items) {
            // Get current price of merch to ensure it's recorded accurately
            const merchResult = await query('SELECT price, stock_quantity FROM merch WHERE id = $1', [item.merch_id]);

            if (merchResult.rows.length === 0) continue;

            const merch = merchResult.rows[0];

            await query(
                'INSERT INTO order_items (order_id, merch_id, quantity, price_at_time) VALUES ($1, $2, $3, $4)',
                [orderId, item.merch_id, item.quantity, merch.price]
            );

            // Decrease stock
            const newStock = Math.max(0, merch.stock_quantity - item.quantity);
            await query('UPDATE merch SET stock_quantity = $1 WHERE id = $2', [newStock, item.merch_id]);
        }

        // Commit transaction
        await query('COMMIT', []);

        res.status(201).json({ id: orderId, message: 'Order created successfully' });
    } catch (error) {
        await query('ROLLBACK', []);
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Server error creating order' });
    }
};

export const getUserOrders = async (req: any, res: Response): Promise<void> => {
    try {
        const user_id = req.user.id;

        const result = await query(
            `SELECT o.*, 
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', oi.id, 
            'merch_id', oi.merch_id, 
            'quantity', oi.quantity, 
            'price_at_time', oi.price_at_time,
            'merch_name', m.name,
            'band_name', b.name
          )
        ) as items
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN merch m ON oi.merch_id = m.id
       JOIN bands b ON m.band_id = b.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
            [user_id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ error: 'Server error fetching user orders' });
    }
};

export const getBandOrders = async (req: any, res: Response): Promise<void> => {
    try {
        if (req.user.role !== 'band') {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }

        const bandResult = await query('SELECT id FROM bands WHERE user_id = $1', [req.user.id]);
        if (bandResult.rows.length === 0) {
            res.status(404).json({ error: 'Band not found' });
            return;
        }
        const bandId = bandResult.rows[0].id;

        // Fetch all orders that contain merch from this band
        const result = await query(
            `SELECT DISTINCT o.*, u.name as user_name, u.email as user_email
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN merch m ON oi.merch_id = m.id
       JOIN users u ON o.user_id = u.id
       WHERE m.band_id = $1
       ORDER BY o.created_at DESC`,
            [bandId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching band orders:', error);
        res.status(500).json({ error: 'Server error fetching band orders' });
    }
};

export const updateOrderStatus = async (req: any, res: Response): Promise<void> => {
    try {
        if (req.user.role !== 'band') {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }

        const { id } = req.params;
        const { status } = req.body;

        // Verify a band is updating the order
        // In a full implementation we'd check if the order contains this band's items specifically

        const result = await query(
            'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Server error updating order' });
    }
};

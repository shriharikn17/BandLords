import { Router } from 'express';
import { createOrder, getUserOrders, getBandOrders, updateOrderStatus } from '../controllers/orders';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Protected routes (User must be logged in to order or see their orders)
router.post('/', authenticateToken, createOrder);
router.get('/my-orders', authenticateToken, getUserOrders);

// Protected routes (Bands only)
router.get('/band-orders', authenticateToken, getBandOrders);
router.put('/:id/status', authenticateToken, updateOrderStatus);

export default router;

import { Router } from 'express';
import { getAllMerch, getMerchById, createMerch, updateMerch, deleteMerch } from '../controllers/merch';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllMerch);
router.get('/:id', getMerchById);

// Protected routes (Bands only)
router.post('/', authenticateToken, createMerch);
router.put('/:id', authenticateToken, updateMerch);
router.delete('/:id', authenticateToken, deleteMerch);

export default router;

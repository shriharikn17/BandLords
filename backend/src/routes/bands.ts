import { Router } from 'express';
import { getBands, getBandById, createBandProfile, updateBandProfile } from '../controllers/bands';
import { authenticateToken, requireBandRole } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getBands);
router.get('/:id', getBandById);

// Protected band routes
router.post('/', authenticateToken, requireBandRole, createBandProfile);
router.put('/:id', authenticateToken, requireBandRole, updateBandProfile);

export default router;

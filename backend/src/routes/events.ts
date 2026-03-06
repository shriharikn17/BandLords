import { Router } from 'express';
import { getEvents, getEventById, createEvent } from '../controllers/events';
import { authenticateToken, requireBandRole } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected band routes
router.post('/', authenticateToken, requireBandRole, createEvent);

export default router;

import { Router } from 'express';
import { getPosts, createPost } from '../controllers/posts';
import { authenticateToken, requireBandRole } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getPosts);

// Protected band routes
router.post('/', authenticateToken, requireBandRole, createPost);

export default router;

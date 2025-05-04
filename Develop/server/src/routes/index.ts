import { Router } from 'express';
import apiRoutes from './api/index.js';
import htmlRoutes from './htmlRoutes.js';

const router = Router();

router.use('/', apiRoutes);
router.use('/', htmlRoutes);

export default router;

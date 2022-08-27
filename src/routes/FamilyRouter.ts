import { Router } from 'express';
import FamilyController from '../controllers/FamilyController';

const router = Router();

// router.post('/join', FamilyController.joinFamily);
router.post('/', FamilyController.createFamily);
export default router;

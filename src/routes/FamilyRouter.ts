import { Router } from 'express';
import FamilyController from '../controllers/FamilyController';

const router = Router();

router.post('/', FamilyController.createFamily);
router.post('/join', FamilyController.joinFamily);

export default router;

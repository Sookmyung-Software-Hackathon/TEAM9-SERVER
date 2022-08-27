import { Router } from 'express';
import PhotoController from '../controllers/PhotoController';
import auth from '../middlewares/auth';

const router = Router();

router.get('/', auth, PhotoController.getPhoto);

export default router;

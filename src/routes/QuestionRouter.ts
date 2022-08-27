import { Router } from 'express';
import QuestionController from '../controllers/QuestionController';
import auth from '../middlewares/auth';
const router = Router();

router.get('/testQuestion', QuestionController.addQuestion);
router.get('/', auth, QuestionController.getQuestion);

export default router;

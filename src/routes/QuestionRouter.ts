import { Router } from 'express';
import QuestionController from '../controllers/QuestionController';
import auth from '../middlewares/auth';
const router = Router();

router.get('/', auth, QuestionController.getQuestion);
router.get('/testQuestion', QuestionController.addQuestion);
export default router;

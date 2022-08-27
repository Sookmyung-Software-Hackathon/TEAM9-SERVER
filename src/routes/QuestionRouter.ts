import { Router } from 'express';
import QuestionController from '../controllers/QuestionController';
import auth from '../middlewares/auth';
const router = Router();

router.post('/family', auth, QuestionController.postQuestion);
router.get('/testQuestion', QuestionController.addQuestion);
router.get('/list', auth, QuestionController.getWeekList);

router.get('/', auth, QuestionController.getQuestion);
router.post('/', auth, QuestionController.postAnswer);
export default router;

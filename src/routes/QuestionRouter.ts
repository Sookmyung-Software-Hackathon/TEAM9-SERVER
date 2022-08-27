import { Router } from 'express';
import QuestionController from '../controllers/QuestionController';
import auth from '../middlewares/auth';
import upload from '../config/multer';
const router = Router();

router.post('/family', auth, QuestionController.postQuestion);
router.get('/testQuestion', QuestionController.addQuestion);
router.post('/list/:week', upload.single('file'), auth, QuestionController.addPhoto);
router.get('/list/:week', auth, QuestionController.getWeekQuestion);
router.get('/list', auth, QuestionController.getWeekList);

router.get('/', auth, QuestionController.getQuestion);
router.post('/', auth, QuestionController.postAnswer);
export default router;

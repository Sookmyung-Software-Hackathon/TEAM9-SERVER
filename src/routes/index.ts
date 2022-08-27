//router index file
import { Router } from 'express';

import QuestionRouter from './QuestionRouter';
import FamilyRouter from './FamilyRouter';

const router: Router = Router();

router.use('/family', FamilyRouter);
router.use('/question', QuestionRouter);
export default router;

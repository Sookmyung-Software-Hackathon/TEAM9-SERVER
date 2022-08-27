//router index file
import { Router } from 'express';

import QuestionRouter from './QuestionRouter';
import FamilyRouter from './FamilyRouter';
import PhotoRouter from './PhotoRouter';
const router: Router = Router();

router.use('/family', FamilyRouter);
router.use('/question', QuestionRouter);
router.use('/photo', PhotoRouter);
export default router;

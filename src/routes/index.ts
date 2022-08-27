//router index file
import { Router } from 'express';

import FamilyRouter from './FamilyRouter';

const router: Router = Router();

router.use('/family', FamilyRouter);

export default router;

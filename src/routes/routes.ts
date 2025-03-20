import express from 'express';
import mailRouter from '@modules/onboarding/onboarding.routes';

const router = express.Router();

router.use('/onboarding', mailRouter);

export default router;

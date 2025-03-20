import express from 'express';
import onboardingRoutes from '@modules/onboarding/onboarding.routes';

const router = express.Router();

router.use('/onboarding', onboardingRoutes);

export default router;

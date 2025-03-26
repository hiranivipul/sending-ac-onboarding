import express from 'express';
import {
    normalOnboarding,
    priorityOnboarding,
    validateTokenAndConfirmUser,
} from './onboarding.controller';
import { validateAuthToken } from '@/middleware/auth.middleware';

const onboarding = express.Router();

onboarding.post('/', normalOnboarding);
onboarding.post('/priority', priorityOnboarding);
onboarding.get(
    '/validate-token/:token',
    validateAuthToken,
    validateTokenAndConfirmUser,
);
// onboarding.get('/send-reminder', sendOnboardingReminders);

export default onboarding;

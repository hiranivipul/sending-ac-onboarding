import express from 'express';
import { normalOnboarding, priorityOnboarding } from './onboarding.controller';

const onboarding = express.Router();

onboarding.post('/', normalOnboarding);
onboarding.post('/priority', priorityOnboarding);

export default onboarding;

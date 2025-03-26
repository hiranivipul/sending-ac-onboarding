import cron from 'node-cron';
import { sendOnboardingReminders } from '@modules/onboarding/onboarding.controller';

cron.schedule(
    '0 2 * * *',
    () => {
        console.log('🚀 Running the onboarding reminder job at 2 AM GMT...');
        sendOnboardingReminders();
    },
    {
        timezone: 'Etc/UTC', // Ensures it runs based on GMT (UTC 0)
    },
);

console.log(
    '⏳ Cron job scheduled: Onboarding reminders will run every minute (for testing).',
);

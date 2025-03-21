import { config } from 'dotenv';

const envFile = `.env`;
config({ path: envFile });

const getEnv = (key: string, defaultValue?: string) => {
    return process.env[key] || defaultValue;
};

export const PORT = getEnv('PORT');
export const NODE_ENV = getEnv('NODE_ENV');
export const BASE_URL = getEnv('BASE_URL');

export const DB_PORT = getEnv('DB_PORT');
export const DB_USERNAME = getEnv('DB_USERNAME');
export const DB_PASSWORD = getEnv('DB_PASSWORD');
export const DB_NAME = getEnv('DB_NAME');
export const DB_HOST = getEnv('DB_HOST');
export const DB_DIALECT = getEnv('DB_DIALECT');

export const MAIN_APP_URL = getEnv('MAIN_APP_URL');

export const getMailAccounts = (): Record<
    string,
    { user: string; pass: string }
> => {
    try {
        const rawEnv = process.env.MAIL_ACCOUNTS || '{}';
        return JSON.parse(rawEnv);
    } catch (error) {
        console.error('❌ Failed to parse MAIL_ACCOUNTS:', error);
        return {};
    }
};

export const getMailConfigByName = (accountName: string) => {
    const accounts = getMailAccounts();
    const selectedAccount = accounts[accountName];
    if (!selectedAccount) {
        throw new Error(
            `❌ Email configuration for "${accountName}" not found.`,
        );
    }

    return {
        host: process.env.MAIL_HOST || 'sandbox.smtp.mailtrap.io',
        port: parseInt(process.env.MAIL_PORT || '587', 10),
        auth: {
            user: selectedAccount.user,
            pass: selectedAccount.pass,
        },
    };
};

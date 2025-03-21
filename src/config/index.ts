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

export const mailConfig = {
    host: getEnv('MAIL_HOST', 'smtp.gmail.com'),
    port: parseInt(getEnv('MAIL_PORT', '587'), 10),
    auth: {
        user: getEnv('MAIL_USER'),
        pass: getEnv('MAIL_PASS'),
    },
    from: `<${getEnv('MAIL_USER')}>`,
};

import { config } from 'dotenv';

const envFile = `.env`;
config({ path: envFile });

export const { PORT, NODE_ENV, BASE_URL } = process.env;

export const {
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    DB_HOST,
    DB_DIALECT,
} = process.env;

export const mailConfig = {
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT || '587', 10),
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    from: `<${process.env.MAIL_USER}>`,
};

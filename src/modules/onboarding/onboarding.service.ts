import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { mailConfig } from '@/config';

class OnboardingService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: mailConfig.host,
            port: mailConfig.port,
            auth: {
                user: mailConfig.auth.user,
                pass: mailConfig.auth.pass,
            },
        });
    }

    // Send Email Function
    async sendEmail(
        to: string,
        subject: string,
        template: string,
        replacements: Record<string, string>,
    ) {
        try {
            const htmlContent = this.loadHtmlTemplate(template, replacements);

            const info = await this.transporter.sendMail({
                from: mailConfig.from,
                to,
                subject,
                html: htmlContent,
            });

            console.log(`✅ Email sent to ${to}: ${info.messageId}`);
            return { success: true, message: 'Email sent successfully' };
        } catch (error: any) {
            console.error(`❌ Email failed to ${to}: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    // Load HTML template & replace placeholders
    private loadHtmlTemplate(
        templateName: string,
        replacements: Record<string, string>,
    ) {
        const templatePath = path.join(
            __dirname,
            `../../templates/${templateName}.html`,
        );

        let html = fs.readFileSync(templatePath, 'utf-8');

        Object.keys(replacements).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            html = html.replace(regex, replacements[key]);
        });

        return html;
    }
}

export const onboardingService = new OnboardingService();

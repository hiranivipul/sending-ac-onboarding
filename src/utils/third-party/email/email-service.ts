import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { getMailConfigByName } from '@/config';

class EmailService {
    async sendEmail(
        accountName: string,
        to: string,
        subject: string,
        template: string,
        replacements: Record<string, string>,
    ) {
        try {
            // Get mail configuration based on account name
            const mailConfig = getMailConfigByName(accountName);
            const transporter = nodemailer.createTransport(mailConfig);

            const htmlContent = this.loadHtmlTemplate(template, replacements);

            const info = await transporter.sendMail({
                from: mailConfig.auth.user, // Use the correct sender email
                to,
                subject,
                html: htmlContent,
                replyTo: mailConfig.auth.user,
            });

            console.log(
                `✅ Email sent using ${accountName} to ${to}: ${info.messageId}`,
            );
            return { success: true, message: 'Email sent successfully' };
        } catch (error: any) {
            console.error(
                `❌ Email failed using ${accountName} to ${to}: ${error.message}`,
            );
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
            `../../../templates/${templateName}.html`,
        );

        let html = fs.readFileSync(templatePath, 'utf-8');

        Object.keys(replacements).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            html = html.replace(regex, replacements[key]);
        });

        return html;
    }
}

export const emailService = new EmailService();

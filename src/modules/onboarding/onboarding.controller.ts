import { Request, Response } from 'express';
import { emailService } from '@utils/third-party/email/email-service';
import { Onboarding, UserTypeEnum } from '@database/models/onboarding.model';
import Sequelize, { Op } from 'sequelize';
import crypto from 'crypto';
import {
    extractCompanyName,
    extractFirstName,
    extractNameFromEmail,
} from '@utils/helper';
import { MAIN_APP_URL } from '@/config';
import { EmailTemplate } from '@utils/constant';

const handleOnboarding = async (
    req: Request,
    res: Response,
    userType: UserTypeEnum,
    fieldMapping: Record<string, string>,
    emailTemplate: { name: string; subject: string },
): Promise<void> => {
    try {
        const { data } = req.body;

        if (!data?.fields || !data.responseId) {
            res.status(400).json({
                success: false,
                message: 'Missing required fields.',
            });
            return;
        }

        // Initialize all fields with `null`
        const extractedData: Record<string, any> = Object.fromEntries(
            Object.values(fieldMapping).map(key => [key, null]),
        );

        // Map provided fields
        for (const field of data.fields) {
            if (fieldMapping[field.key]) {
                extractedData[fieldMapping[field.key]] = field.value || null;
            }
        }

        if (!extractedData.email) {
            res.status(400).json({
                success: false,
                message: 'Email is required.',
            });
            return;
        }

        const existingEntry = await Onboarding.findOne({
            where: { email: extractedData.email },
        });
        if (existingEntry) {
            res.status(409).json({
                success: false,
                message: 'Email already exists. Please use a different email.',
            });
            return;
        }

        // Generate a unique token
        const generatedToken = crypto.randomBytes(11).toString('hex');
        extractedData.companyName = extractCompanyName(extractedData.website);
        if (
            extractedData.name === null ||
            extractedData.name === '' ||
            extractedData.name === undefined
        ) {
            extractedData.name = extractNameFromEmail(extractedData.email);
        }
        const newEntry = await Onboarding.create({
            userType,
            createdAt: new Date(),
            token: generatedToken,
            ...extractedData,
        });

        if (emailTemplate.name === EmailTemplate.regularApplication.name) {
            const name = extractFirstName(newEntry.name);
            emailService.sendEmail(
                EmailTemplate.regularApplication.accountKey,
                newEntry.email,
                EmailTemplate.regularApplication.subject,
                EmailTemplate.regularApplication.name,
                {
                    name: name || '',
                    confirm_url: `${MAIN_APP_URL}?token=${generatedToken}`,
                },
            );
        } else if (
            emailTemplate.name === EmailTemplate.existingApplication.name
        ) {
            emailService.sendEmail(
                EmailTemplate.existingApplication.accountKey,
                newEntry.email,
                EmailTemplate.existingApplication.subject,
                EmailTemplate.existingApplication.name,
                {
                    name: newEntry.name || '',
                    subPref: newEntry.subPref,
                },
            );
        }

        res.status(201).json({ success: true, data: null });
        return;
    } catch (error: any) {
        console.error(`Error storing ${userType} onboarding response:`, error);

        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(409).json({
                success: false,
                message: 'Email already exists.',
            });
            return;
        }

        if (!(error instanceof Sequelize.ValidationError)) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
            return;
        } else {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors.map(err => err.message),
            });
            return;
        }
    }
};

export const normalOnboarding = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const fieldMapping = {
        question_8zrxZO: 'email',
        question_xjzYqG: 'name',
        question_vrzyK8: 'website',
        question_NDPojG: 'mailboxes',
        question_54VxZ6: 'mailboxProvider',
        question_qazVr2: 'coldEmailBudget',
        question_KeGlK: 'referralSource',
        question_dNzddq: 'referralCode',
        'question_YR9aa5_6f90f03a-0362-4a6f-ae7a-7f55a54f6686': 'inviteCode',
    };
    return handleOnboarding(
        req,
        res,
        UserTypeEnum.NORMAL,
        fieldMapping,
        EmailTemplate.regularApplication,
    );
};

export const priorityOnboarding = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const fieldMapping = {
        question_KeRGYK: 'email',
        'question_aekEYE_cfa009ea-fbd8-4822-8ca3-a8d8c1a44f6f': 'subPref',
    };
    return handleOnboarding(
        req,
        res,
        UserTypeEnum.PRIORITY,
        fieldMapping,
        EmailTemplate.existingApplication,
    );
};

export const validateTokenAndConfirmUser = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { token } = req.params;

        if (!token) {
            res.status(400).json({ message: 'Token is required' });
            return;
        }

        const user = await Onboarding.findOne({ where: { token } });

        if (!user) {
            res.status(401).json({ message: 'Invalid or expired token' });
            return;
        }

        // Remove token after successful validation
        await Onboarding.update({ token: null }, { where: { id: user.id } });

        res.json({ message: 'Token validated successfully', user });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
        return;
    }
};

export const sendOnboardingReminders = async (req: Request, res: Response) => {
    try {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const usersToRemind = await Onboarding.findAll({
            where: {
                token: { [Op.not]: null }, // User must still have a token
                createdAt: { [Op.lte]: threeDaysAgo }, // Created 3+ days ago
                reminderSent: false, // Ensure we don’t send twice
            },
        });

        if (usersToRemind.length === 0) {
            res.json({ message: 'No users need reminders.' });
            return;
        }

        for (const user of usersToRemind) {
            const emailTemplate = EmailTemplate.reminder;

            emailService.sendEmail(
                emailTemplate.accountKey,
                user.email,
                emailTemplate.subject,
                emailTemplate.name,
                {
                    confirm_url: `${MAIN_APP_URL}?token=${user.token}`,
                },
            );

            // Mark user as reminded
            user.update({ reminderSent: true });
        }

        res.json({
            message: `Reminder emails sent to ${usersToRemind.length} users.`,
        });
    } catch (error) {
        console.error('❌ Error sending reminder emails:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

import { Request, Response } from 'express';
import { onboardingService } from '@modules/onboarding/onboarding.service';
import { Onboarding, UserTypeEnum } from '@database/models/onboarding.model';
import Sequelize from 'sequelize';
import crypto from 'crypto';

export const normalOnboarding = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    try {
        const { data } = req.body;

        if (!data?.fields || !data.responseId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields.',
            });
        }

        const fieldMapping: Record<string, string> = {
            question_8zrxZO: 'email',
            question_xjzYqG: 'name',
            question_vrzyK8: 'companyUrl',
            question_NDPojG: 'mailboxesManaged',
            question_54VxZ6: 'mailboxProvider',
            question_qazVr2: 'coldEmailBudget',
            question_KeGlkK: 'referralSource',
            question_dNzddq: 'referralCode',
            'question_YR9aa5_6f90f03a-0362-4a6f-ae7a-7f55a54f6686':
                'inviteCode',
        };

        const extractedData: Record<string, any> = {};
        for (const field of data.fields) {
            if (fieldMapping[field.key]) {
                extractedData[fieldMapping[field.key]] = field.value || null;
            }
        }

        if (!extractedData.email) {
            return res
                .status(400)
                .json({ success: false, message: 'Email is required.' });
        }

        const existingEntry = await Onboarding.findOne({
            where: { email: extractedData.email },
        });
        if (existingEntry) {
            return res.status(409).json({
                success: false,
                message: 'Email already exists. Please use a different email.',
            });
        }

        // Generate a unique token
        const generatedToken = crypto.randomBytes(32).toString('hex');

        const newEntry = await Onboarding.create({
            userType: UserTypeEnum.NORMAL,
            responseId: data.responseId || null,
            submissionId: data.submissionId || null,
            respondentId: data.respondentId || null,
            formId: data.formId || null,
            formName: data.formName || null,
            createdAt: new Date(data.createdAt),
            token: generatedToken,
            ...extractedData,
        });

        onboardingService.sendEmail(
            newEntry.email,
            'Welcome to Our Service!',
            'regular-application',
            {
                name: newEntry.name || 'User',
                url: `https://www.google.com?token=${generatedToken}`,
            },
        );

        return res.status(201).json({ success: true, data: newEntry });
    } catch (error: any) {
        console.error('Error storing normal onboarding response:', error);

        if (error instanceof Sequelize.UniqueConstraintError) {
            return res
                .status(409)
                .json({ success: false, message: 'Email already exists.' });
        }

        if (error instanceof Sequelize.ValidationError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors.map(err => err.message),
            });
        }

        return res
            .status(500)
            .json({ success: false, message: 'Internal Server Error' });
    }
};

export const priorityOnboarding = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    try {
        const { eventId, eventType, createdAt, data } = req.body;

        if (!data?.fields || !data.responseId || !eventId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields.',
            });
        }

        const fieldMapping: Record<string, string> = {
            question_KeRGYK: 'email',
            'question_aekEYE_cfa009ea-fbd8-4822-8ca3-a8d8c1a44f6f': 'subPref',
        };

        const extractedData: Record<string, any> = {};
        for (const field of data.fields) {
            if (fieldMapping[field.key]) {
                extractedData[fieldMapping[field.key]] = field.value || null;
            }
        }

        if (!extractedData.email) {
            return res
                .status(400)
                .json({ success: false, message: 'Email is required.' });
        }

        const existingEntry = await Onboarding.findOne({
            where: { email: extractedData.email },
        });
        if (existingEntry) {
            return res.status(409).json({
                success: false,
                message: 'Email already exists. Please use a different email.',
            });
        }

        const newEntry = await Onboarding.create({
            userType: UserTypeEnum.PRIORITY,
            eventId,
            eventType,
            responseId: data.responseId || null,
            submissionId: data.submissionId || null,
            respondentId: data.respondentId || null,
            formId: data.formId || null,
            formName: data.formName || null,
            createdAt: new Date(createdAt),
            ...extractedData,
        });

        onboardingService.sendEmail(
            newEntry.email,
            'Welcome to Our Service!',
            'existing-application',
            {
                name: newEntry.formName || 'User',
                subPref: newEntry.subPref || '300K',
            },
        );

        return res.status(201).json({ success: true, data: newEntry });
    } catch (error: any) {
        console.error('Error storing priority onboarding response:', error);

        if (error instanceof Sequelize.UniqueConstraintError) {
            return res
                .status(409)
                .json({ success: false, message: 'Email already exists.' });
        }

        if (error instanceof Sequelize.ValidationError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors.map(err => err.message),
            });
        }

        return res
            .status(500)
            .json({ success: false, message: 'Internal Server Error' });
    }
};

export const validateTokenAndConfirmUser = async (
    req: Request,
    res: Response,
) => {
    try {
        const { token } = req.params; // Extract token from URL params

        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        // Find user with the given token
        const user = await Onboarding.findOne({ where: { token } });

        if (!user) {
            return res
                .status(401)
                .json({ message: 'Invalid or expired token' });
        }

        // Remove token after successful validation
        await Onboarding.update({ token: null }, { where: { id: user.id } });

        res.json({ message: 'Token validated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

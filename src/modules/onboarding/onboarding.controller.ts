import { Request, Response } from 'express';
import { onboardingService } from '@modules/onboarding/onboarding.service';
import { Onboarding, UserTypeEnum } from '@database/models/onboarding.model';
import Sequelize from 'sequelize';
import crypto from 'crypto';
import { extractCompanyName } from '@utils/helper';

const handleOnboarding = async (
    req: Request,
    res: Response,
    userType: UserTypeEnum,
    fieldMapping: Record<string, string>,
    emailTemplate: string,
): Promise<Response> => {
    try {
        const { data } = req.body;

        if (!data?.fields || !data.responseId) {
            return res
                .status(400)
                .json({ success: false, message: 'Missing required fields.' });
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
        const generatedToken = crypto.randomBytes(11).toString('hex');
        extractedData.companyName = extractCompanyName(extractedData.website);

        const newEntry = await Onboarding.create({
            userType,
            createdAt: new Date(),
            token: generatedToken,
            ...extractedData,
        });

        onboardingService.sendEmail(
            newEntry.email,
            'Welcome to Our Service!',
            emailTemplate,
            {
                name: newEntry.name || 'User',
                url: `https://www.google.com?token=${generatedToken}`,
            },
        );

        return res.status(201).json({ success: true, data: null });
    } catch (error: any) {
        console.error(`Error storing ${userType} onboarding response:`, error);

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

export const normalOnboarding = (
    req: Request,
    res: Response,
): Promise<Response> => {
    const fieldMapping = {
        question_8zrxZO: 'email',
        question_xjzYqG: 'name',
        question_vrzyK8: 'website',
        question_NDPojG: 'mailboxes',
        question_54VxZ6: 'mailboxProvider',
        question_qazVr2: 'coldEmailBudget',
        question_KeGlkK: 'referralSource',
        question_dNzddq: 'referralCode',
        'question_YR9aa5_6f90f03a-0362-4a6f-ae7a-7f55a54f6686': 'inviteCode',
    };
    return handleOnboarding(
        req,
        res,
        UserTypeEnum.NORMAL,
        fieldMapping,
        'regular-application',
    );
};

export const priorityOnboarding = (
    req: Request,
    res: Response,
): Promise<Response> => {
    const fieldMapping = {
        question_KeRGYK: 'email',
        'question_aekEYE_cfa009ea-fbd8-4822-8ca3-a8d8c1a44f6f': 'subPref',
    };
    return handleOnboarding(
        req,
        res,
        UserTypeEnum.PRIORITY,
        fieldMapping,
        'existing-application',
    );
};

export const validateTokenAndConfirmUser = async (
    req: Request,
    res: Response,
) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

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

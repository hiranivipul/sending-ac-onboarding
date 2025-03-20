import { Request, Response } from 'express';
import { onboardingService } from '@modules/onboarding/onboarding.service';
import { NormalOnboarding } from '@database/models/normal-onboarding.model';
import { PriorityOnboarding } from '@database/models/priority_onboarding.model';
import Sequelize from 'sequelize';

/**
 * @description Normal onboarding process webhook
 * {
 *     "eventId": "7c12746a-a670-49cb-99fa-d0741dc362ce",
 *     "eventType": "FORM_RESPONSE",
 *     "createdAt": "2025-02-09T12:17:00.517Z",
 *     "data": {
 *         "responseId": "45E6Zb",
 *         "submissionId": "45E6Zb",
 *         "respondentId": "OgPGag",
 *         "formId": "mRbeEQ",
 *         "formName": "Signup 2.0",
 *         "createdAt": "2025-02-09T12:17:00.000Z",
 *         "fields": [
 *             {
 *                 "key": "question_8zrxZO",
 *                 "label": "Email for invite (if accepted)",
 *                 "type": "INPUT_EMAIL",
 *                 "value": "hiranivipuls@gmail.com"
 *             },
 *             {
 *                 "key": "question_xjzYqG",
 *                 "label": "Your name (full)",
 *                 "type": "INPUT_TEXT",
 *                 "value": "vip test"
 *             },
 *             {
 *                 "key": "question_vrzyK8",
 *                 "label": "Company (URL)",
 *                 "type": "INPUT_LINK",
 *                 "value": "dayours.com"
 *             },
 *             {
 *                 "key": "question_NDPojG",
 *                 "label": "How many mailboxes does @Company (URL) manage actively?",
 *                 "type": "INPUT_NUMBER",
 *                 "value": 101
 *             },
 *             {
 *                 "key": "question_54VxZ6",
 *                 "label": "Where do you buy your mailboxes?",
 *                 "type": "INPUT_TEXT",
 *                 "value": "gsuit"
 *             },
 *             {
 *                 "key": "question_qazVr2",
 *                 "label": "How much does @Company (URL) spend on cold email per month?",
 *                 "type": "INPUT_NUMBER",
 *                 "value": 2000
 *             },
 *             {
 *                 "key": "question_KeGlkK",
 *                 "label": "How did you hear about us",
 *                 "type": "INPUT_TEXT",
 *                 "value": "linkedin"
 *             },
 *             {
 *                 "key": "question_dNzddq",
 *                 "label": "Referral Code",
 *                 "type": "INPUT_TEXT",
 *                 "value": "no"
 *             },
 *             {
 *                 "key": "question_YR9aa5_6f90f03a-0362-4a6f-ae7a-7f55a54f6686",
 *                 "label": "invite_code",
 *                 "type": "HIDDEN_FIELDS",
 *                 "value": null
 *             }
 *         ]
 *     }
 * }
 * */
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

        // Field Mapping
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

        // Extract data from fields
        const extractedData: Record<string, any> = {};
        for (const field of data.fields) {
            if (fieldMapping[field.key]) {
                extractedData[fieldMapping[field.key]] = field.value || null;
            }
        }

        // Validate required email
        if (!extractedData.email) {
            return res
                .status(400)
                .json({ success: false, message: 'Email is required.' });
        }

        // Check if email already exists
        const existingEntry = await NormalOnboarding.findOne({
            where: { email: extractedData.email },
        });
        if (existingEntry) {
            return res.status(409).json({
                success: false,
                message: 'Email already exists. Please use a different email.',
            });
        }

        // Store data in the database
        const newEntry = await NormalOnboarding.create({
            responseId: data.responseId || null,
            submissionId: data.submissionId || null,
            respondentId: data.respondentId || null,
            formId: data.formId || null,
            formName: data.formName || null,
            createdAt: new Date(data.createdAt),
            ...extractedData,
        });

        // Send email
        await onboardingService.sendEmail(
            newEntry.email,
            'Welcome to Our Service!',
            'regular-application',
            { name: newEntry.name || 'User', ...extractedData },
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

/**
 * @description Priority
 * {
 *     "eventId": "8c81a21e-6942-478f-8fb9-ef49a3aa066d",
 *     "eventType": "FORM_RESPONSE",
 *     "createdAt": "2025-03-02T06:04:55.714Z",
 *     "data": {
 *         "responseId": "JN20Gz",
 *         "submissionId": "JN20Gz",
 *         "respondentId": "dp18Zd",
 *         "formId": "3Nbk4B",
 *         "formName": "Prioritse existing application",
 *         "createdAt": "2025-03-02T06:04:54.000Z",
 *         "fields": [
 *             {
 *                 "key": "question_aekEYE_cfa009ea-fbd8-4822-8ca3-a8d8c1a44f6f",
 *                 "label": "sub_pref",
 *                 "type": "HIDDEN_FIELDS",
 *                 "value": "205k"
 *             },
 *             {
 *                 "key": "question_KeRGYK",
 *                 "label": "name@company.com",
 *                 "type": "INPUT_EMAIL",
 *                 "value": "test@mailinator.com"
 *             }
 *         ]
 *     }
 * }
 * */
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

        // Field Mapping
        const fieldMapping: Record<string, string> = {
            question_KeRGYK: 'email', // Email (Required)
            'question_aekEYE_cfa009ea-fbd8-4822-8ca3-a8d8c1a44f6f': 'subPref',
        };

        // Extract data from fields
        const extractedData: Record<string, any> = {};
        for (const field of data.fields) {
            if (fieldMapping[field.key]) {
                extractedData[fieldMapping[field.key]] = field.value || null;
            }
        }

        // Validate required email
        if (!extractedData.email) {
            return res
                .status(400)
                .json({ success: false, message: 'Email is required.' });
        }

        // Check if email already exists
        const existingEntry = await PriorityOnboarding.findOne({
            where: { email: extractedData.email },
        });
        if (existingEntry) {
            return res.status(409).json({
                success: false,
                message: 'Email already exists. Please use a different email.',
            });
        }

        // Store data in the database
        const newEntry = await PriorityOnboarding.create({
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

        // Send email
        await onboardingService.sendEmail(
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

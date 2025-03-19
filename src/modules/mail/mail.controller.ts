import { Request, Response } from 'express';
import { mailService } from '@modules/mail/mail.service';

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
export const sendEmail = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    const { email, name } = req.body;

    if (!email || !name) {
        return res
            .status(400)
            .json({ success: false, message: 'Email and Name are required' });
    }

    const result = await mailService.sendEmail(
        email,
        'Welcome to Our Service!',
        'welcome',
        { name },
    );

    return res.json(result);
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
export const sendEmail2 = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    const { email, name } = req.body;

    if (!email || !name) {
        return res
            .status(400)
            .json({ success: false, message: 'Email and Name are required' });
    }

    const result = await mailService.sendEmail(
        email,
        'Welcome to Our Service!',
        'welcome',
        { name },
    );

    return res.json(result);
};

import { Request, Response } from 'express';
import { mailService } from '@modules/mail/mail.service';

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

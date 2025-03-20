import { NextFunction, Request, Response } from 'express';

export const validateAuthToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authToken = req.headers.authorization;

        if (!authToken) {
            return res
                .status(400)
                .json({ message: 'Authorization token is required' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

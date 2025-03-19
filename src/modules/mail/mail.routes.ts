import express from 'express';
import { sendEmail, sendEmail2 } from './mail.controller';

const mailRouter = express.Router();

mailRouter.post('/send-mail1', sendEmail);
mailRouter.post('/send-mail2', sendEmail2);

export default mailRouter;

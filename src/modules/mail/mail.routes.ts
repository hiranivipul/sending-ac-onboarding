import express from 'express';
import { sendEmail, sendEmail2 } from './mail.controller';

const mailRouter = express.Router();

mailRouter.post('/', sendEmail);
mailRouter.post('/priority', sendEmail2);

export default mailRouter;

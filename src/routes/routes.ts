import express from 'express';
import mailRouter from '@modules/mail/mail.routes';

const router = express.Router();

router.use('/mail', mailRouter);

export default router;

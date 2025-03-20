import logger from '@/utils/logger';
import Sequelize from 'sequelize';
import normalOnboarding from './models/normal-onboarding.model';
import {
    DB_DIALECT,
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_USERNAME,
    NODE_ENV,
} from '@/config';
import { initPriorityOnboardingModel } from '@database/models/priority_onboarding.model';

const sequelize = new Sequelize.Sequelize(
    DB_NAME as string,
    DB_USERNAME as string,
    DB_PASSWORD,
    {
        dialect: (DB_DIALECT as Sequelize.Dialect) || 'postgres',
        host: DB_HOST,
        port: parseInt(DB_PORT as string, 10),
        timezone: '+09:00',
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            underscored: true,
            freezeTableName: true,
        },
        pool: {
            min: 0,
            max: 5,
        },
        logQueryParameters: NODE_ENV === 'development',
        logging: (query, time) => {
            logger.info(time + 'ms' + ' ' + query);
        },
        benchmark: true,
    },
);

sequelize.authenticate();
const PriorityOnboardingModel = initPriorityOnboardingModel(sequelize);

export const DB = {
    NormalOnboarding: normalOnboarding(sequelize),
    PriorityOnboarding: PriorityOnboardingModel,
    sequelize, // connection instance (RAW queries)
    Sequelize, // library
};

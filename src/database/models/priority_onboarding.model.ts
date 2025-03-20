import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface PriorityOnboardingAttributes {
    id?: string;
    eventId?: string;
    eventType?: string;
    responseId?: string;
    submissionId?: string;
    respondentId?: string;
    formId?: string;
    formName?: string;
    createdAt?: Date;
    email: string; // REQUIRED
    subPref?: string; // NULLABLE
}

export type PriorityOnboardingCreationAttributes = Optional<
    PriorityOnboardingAttributes,
    'id' | 'createdAt' | 'subPref'
>;

export class PriorityOnboarding
    extends Model<
        PriorityOnboardingAttributes,
        PriorityOnboardingCreationAttributes
    >
    implements PriorityOnboardingAttributes
{
    public id!: string;
    public eventId!: string;
    public eventType!: string;
    public responseId!: string;
    public submissionId!: string;
    public respondentId!: string;
    public formId!: string;
    public formName!: string;
    public createdAt!: Date;
    public email!: string;
    public subPref?: string;
}

// ✅ Wrap model initialization inside a function
export function initPriorityOnboardingModel(
    sequelize: Sequelize,
): typeof PriorityOnboarding {
    PriorityOnboarding.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            eventId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            eventType: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            responseId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            submissionId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            respondentId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            formId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            formName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            subPref: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'priority_onboarding',
            timestamps: true,
        },
    );

    return PriorityOnboarding;
}

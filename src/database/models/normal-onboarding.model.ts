import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface NormalOnboardingAttributes {
    id?: string;
    responseId?: string;
    submissionId?: string;
    respondentId?: string;
    formId?: string;
    formName?: string;
    email: string; // Required
    name?: string;
    companyUrl?: string;
    mailboxesManaged?: number;
    mailboxProvider?: string;
    coldEmailBudget?: number;
    referralSource?: string;
    referralCode?: string;
    inviteCode?: string;
    token?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type NormalOnboardingCreationAttributes = Optional<
    NormalOnboardingAttributes,
    'id' | 'createdAt' | 'updatedAt'
>;

export class NormalOnboarding
    extends Model<
        NormalOnboardingAttributes,
        NormalOnboardingCreationAttributes
    >
    implements NormalOnboardingAttributes
{
    public id!: string;
    public responseId?: string;
    public submissionId?: string;
    public respondentId?: string;
    public formId?: string;
    public formName?: string;
    public email!: string; // Required
    public name?: string;
    public companyUrl?: string;
    public mailboxesManaged?: number;
    public mailboxProvider?: string;
    public coldEmailBudget?: number;
    public referralSource?: string;
    public referralCode?: string;
    public inviteCode?: string;
    public token?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof NormalOnboarding {
    NormalOnboarding.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            responseId: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            submissionId: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            respondentId: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            formId: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            formName: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: true,
                },
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            companyUrl: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isUrl: true,
                },
            },
            mailboxesManaged: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            mailboxProvider: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            coldEmailBudget: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            referralSource: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            referralCode: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            inviteCode: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            token: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'normal_onboarding',
            timestamps: true,
        },
    );

    return NormalOnboarding;
}

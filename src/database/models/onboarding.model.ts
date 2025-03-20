import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export enum UserTypeEnum {
    NORMAL = 'normal',
    PRIORITY = 'priority',
}

export interface OnboardingAttributes {
    id?: string;
    email: string; // Required
    name?: string;
    website?: string;
    company_name?: string;
    mailboxes?: number;
    mailboxProvider?: string;
    coldEmailBudget?: number;
    referralSource?: string;
    referralCode?: string;
    inviteCode?: string;
    token?: string;
    subPref?: string;
    userType: UserTypeEnum; // New enum field
    createdAt?: Date;
    updatedAt?: Date;
}

export type OnboardingCreationAttributes = Optional<
    OnboardingAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'subPref'
>;

export class Onboarding
    extends Model<OnboardingAttributes, OnboardingCreationAttributes>
    implements OnboardingAttributes
{
    public id!: string;
    public responseId?: string;
    public submissionId?: string;
    public respondentId?: string;
    public formId?: string;
    public formName?: string;
    public email!: string;
    public name?: string;
    public companyUrl?: string;
    public mailboxesManaged?: number;
    public mailboxProvider?: string;
    public coldEmailBudget?: number;
    public referralSource?: string;
    public referralCode?: string;
    public inviteCode?: string;
    public token?: string;
    public eventId?: string;
    public eventType?: string;
    public subPref?: string;
    public userType!: UserTypeEnum; // Required user type
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof Onboarding {
    Onboarding.init(
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
            eventId: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            eventType: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            subPref: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            userType: {
                type: DataTypes.ENUM(
                    UserTypeEnum.NORMAL,
                    UserTypeEnum.PRIORITY,
                ),
                allowNull: false,
                defaultValue: UserTypeEnum.NORMAL,
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
            tableName: 'onboarding',
            timestamps: true,
        },
    );

    return Onboarding;
}

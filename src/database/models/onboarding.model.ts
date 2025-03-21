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
    companyName?: string;
    mailboxes?: number;
    mailboxProvider?: string;
    coldEmailBudget?: number;
    referralSource?: string;
    referralCode?: string;
    inviteCode?: string;
    token?: string;
    subPref?: string;
    userType: UserTypeEnum; // New enum field
    reminderSent: boolean;
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
    public email!: string;
    public name?: string;
    public website?: string;
    public companyName?: string;
    public mailboxesManaged?: number;
    public mailboxProvider?: string;
    public coldEmailBudget?: number;
    public referralSource?: string;
    public referralCode?: string;
    public inviteCode?: string;
    public token?: string;
    public subPref?: string;
    public userType!: UserTypeEnum; // Required user type
    public reminderSent: boolean;
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
            website: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isUrl: true,
                },
            },
            companyName: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            mailboxes: {
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
            reminderSent: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
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

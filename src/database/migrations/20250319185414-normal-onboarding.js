'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('normal_onboarding', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            responseId: {
                type: Sequelize.STRING,
                allowNull: true,
                field: 'response_id',
            },
            submissionId: {
                type: Sequelize.STRING,
                allowNull: true,
                field: 'submission_id',
            },
            respondentId: {
                type: Sequelize.STRING,
                allowNull: true,
                field: 'respondent_id',
            },
            formId: {
                type: Sequelize.STRING,
                allowNull: true,
                field: 'form_id',
            },
            formName: {
                type: Sequelize.STRING,
                allowNull: true,
                field: 'form_name',
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true, // Ensuring uniqueness of email
            },
            name: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            companyUrl: {
                type: Sequelize.STRING,
                allowNull: true,
                field: 'company_url',
            },
            mailboxesManaged: {
                type: Sequelize.INTEGER,
                allowNull: true,
                field: 'mailboxes_managed',
            },
            mailboxProvider: {
                type: Sequelize.STRING,
                allowNull: true,
                field: 'mailbox_provider',
            },
            coldEmailBudget: {
                type: Sequelize.INTEGER,
                allowNull: true,
                field: 'cold_email_budget',
            },
            referralSource: {
                type: Sequelize.STRING,
                allowNull: true,
                field: 'referral_source',
            },
            referralCode: {
                type: Sequelize.STRING,
                allowNull: true,
                field: 'referral_code',
            },
            inviteCode: {
                type: Sequelize.STRING,
                allowNull: true,
                field: 'invite_code',
            },
            token: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                field: 'created_at',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                field: 'updated_at',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('normal_onboarding');
    },
};

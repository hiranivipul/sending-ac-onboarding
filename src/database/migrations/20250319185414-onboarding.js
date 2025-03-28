'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('onboarding', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            website: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            company_name: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            mailboxes: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            mailbox_provider: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            cold_email_budget: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            referral_source: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            referral_code: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            invite_code: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            token: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            sub_pref: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            user_type: {
                type: Sequelize.ENUM('normal', 'priority'),
                allowNull: false,
                defaultValue: 'normal',
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        });
    },

    down: async queryInterface => {
        await queryInterface.dropTable('onboarding');
    },
};

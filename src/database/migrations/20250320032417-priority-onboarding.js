'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('priority_onboarding', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            event_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            event_type: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            response_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            submission_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            respondent_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            form_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            form_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            sub_pref: {
                type: Sequelize.STRING,
                allowNull: true,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('priority_onboarding');
    },
};

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('socials', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userProfileId:{
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'userProfiles', // References the userProfiles table
          key: 'id'              // References the id column in userProfiles
        },
        onDelete: 'CASCADE',      // Deletes social records when the userProfile is deleted
      
      }
      ,
      linkedIn: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "https://www.linkedin.com/"
      },
      github: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "https://github.com/"
      },
      additionalLinks: {
        type: Sequelize.JSON
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('socials');
  }
};
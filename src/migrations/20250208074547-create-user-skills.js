'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('User_Skills', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      userProfileId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'userProfiles', // Must match the actual table name in DB
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      skillId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Skills', // Must match the actual table name in DB
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addConstraint('User_Skills', {
      fields: ['userProfileId', 'skillId'],
      type: 'unique',
      name: 'unique_user_skill' // Unique constraint name
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('User_Skills');
  }
};

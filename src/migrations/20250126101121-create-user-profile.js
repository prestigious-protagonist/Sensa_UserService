'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('userProfiles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },

      username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      fullname:{
        type:Sequelize.STRING,
        allowNull: false,
      },
      DOB:{
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate:{
          isDate: true
        }
      },
      age:{
        type: Sequelize.INTEGER,
        validate:{
          min: 18
        },
        allowNull: false
      },
      experience:{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      gender: {
        type: Sequelize.ENUM('Male', 'Female', 'Other'),
        allowNull: false,
        defaultValue: "Other"
      },
      profilePicture: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3Dprofile%2Bicon&psig=AOvVaw0VQ_KO_6K0z8wkS_hcX6GO&ust=1739026180899000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKCexcznsYsDFQAAAAAdAAAAABAR'
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: "Hey there I'm using SENSA..."
      },
      email:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate:{
          isEmail: true
        }
        
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },{
      indexes: [
        {
          fields:['email']
        }
      ]
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('userProfiles');
  }
};
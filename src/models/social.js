'use strict';
const {
  Model
} = require('sequelize');
const userprofile = require('./userprofile');
module.exports = (sequelize, DataTypes) => {
  class social extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.userProfile,{
        foreignKey: 'userProfileId', // Specify the foreign key column in the social table
        onDelete: 'CASCADE', // Ensures related social record is deleted if the userProfile is deleted
     
      })
    }
  }
  social.init({
    userProfileId:{
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'userProfiles', // References the userProfiles table
        key: 'id'              // References the id column in userProfiles
      },
      onDelete: 'CASCADE',      // Deletes social records when the userProfile is deleted
    
    },
    linkedIn: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "https://www.linkedin.com/"
    },
    github: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "https://github.com/"
    },
    additionalLinks:  {
      type: DataTypes.JSON
    },
  }, {
    sequelize,
    modelName: 'social',
  });
  return social;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Skills extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.userProfile, {
        through: 'User_Skills',
          onDelete: 'CASCADE',
          
        foreignKey: 'skillId',  // ⬅ lowercase
        otherKey: 'userProfileId'
      } )
      
    }
  }
  Skills.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Skills',
  });
  return Skills;
};
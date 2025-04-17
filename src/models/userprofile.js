  'use strict';
  const {
    Model
  } = require('sequelize');
const social = require('./social');
  module.exports = (sequelize, DataTypes) => {
    class userProfile extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      getAge() {
        if (!this.DOB) return null;
        const dob = new Date(this.DOB);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
        return age;
      }
      static associate(models) {
        // define association here
        this.hasOne(models.social, {
          foreignKey:'userProfileId',
          onDelete: 'CASCADE'
        })
        this.belongsToMany(models.Skills, {
          through: 'User_Skills',
          onDelete: 'CASCADE',
          foreignKey: 'userProfileId',
          otherKey: 'skillId'  // ⬅ lowercase 's'
        } )
        //userprofileId col will be added to social 
       
      }
    }
    
    userProfile.init({
      
      username:  {
        type:DataTypes.STRING,
        unique: true,
        allowNull: false,
        
      },
      DOB:{
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate:{
          isDate: true,
        },
        defaultValue: DataTypes.NOW
      },
      age:{
        type: DataTypes.INTEGER,
        validate:{
          min: 18
        },
        allowNull: false
      },
      experience:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      gender:  {
        type:DataTypes.ENUM("Male", "Female", "Other"),
        allowNull: false,
        defaultValue: "Other"
      },
      profilePicture:  {
        type:DataTypes.TEXT,
        allowNull: true,
        defaultValue: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3Dprofile%2Bicon&psig=AOvVaw0VQ_KO_6K0z8wkS_hcX6GO&ust=1739026180899000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKCexcznsYsDFQAAAAAdAAAAABAR"
      },
      bio:  {
        type:DataTypes.TEXT,
        allowNull: false,
        defaultValue: "Hey there I'm using SENSA..."
      },
      email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
    }, {
      sequelize,
      modelName: 'userProfile',
      timestamps: true,
      getterMethods: {
        age() {
          return this.getAge(); // Getter method for `age`
        }
      },
      indexes:[
        {
          unique: true,
          fields: ['email']
        }
      ]
    });
    
    return userProfile;
  };
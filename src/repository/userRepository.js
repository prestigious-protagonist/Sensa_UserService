
const {userProfile, social, sequelize, Skills} = require('../models/index');
const AppErrors = require('../utils/error-handler');
const ValidationError = require('../utils/validation-error');
const ClientError = require('../utils/client-error');
const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');
const userprofile = require('../models/userprofile');

class UserRepository {
    async create (profileData, options)  {
        
        try {
            const userProfExists = await userProfile.findOne({
                where:{
                    email: profileData.email
                }
            })
            if(userProfExists) {
                throw new ClientError({
                    name: "Bad Request",
                    message: "Profile already exists, you can still edit your profile.",
                    explanation: "You cannot setup multiple profiles for a single user.",
                    statusCode: StatusCodes.BAD_REQUEST
                })
            }
            const userProf = await userProfile.create(profileData,options)
            console.log("PROFILE CREATED")
            if (!userProf) {
                throw new Error("Error creating user profile");
            }
            
            // socialsData.userProfileId = userProf.id
            // const socials = await social.create(socialsData, options)
            // if(!socials) {
            //     throw "error in adding socials"
            // }
            
           
            return userProf
        } catch (error) {
            
            
            
            console.log("Something went wrong at repository layer.")
            throw error;
        }
    }
    async getAll(userId) {
        try {
            const users = await userProfile.findAll({
                where: {
                    id: { [Op.ne]: userId } // Exclude logged-in user
                },
                include: [{ model: social, attributes: ['linkedIn', 'github'] }] // Optional: Include socials
            });

            return users;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async usernameIsvalid(username) {
        try {
            const userExists = await userProfile.findOne({
                where:{
                    username,
                }
            })
            return userExists;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateUsername({ username, email }, options) {
        try {
            const usernameExists = await this.usernameIsvalid(username);
            if (usernameExists) {
                throw new ClientError({
                    name: "Username Already Taken",
                    message: "The username is already in use.",
                    statusCode: StatusCodes.BAD_REQUEST
                });
            }
    
            // Find the user by email
            const user = await userProfile.findOne({
                where: { email },
                  
            }, options);
    
            if (!user) {
                throw new ClientError({
                    name: "User Not Found",
                    message: `No user found with email ${email}`,
                    statusCode: StatusCodes.NOT_FOUND
                });
            }
    
            // Update username
            await user.update({ username }, options );
    
            return user; // Return updated user info
        } catch (error) {
            console.error("Error in updateUsername:", error.message);
            throw error;
        }
    }
    
    async updateProfile(data, options) {
        try {
            const user = await userProfile.findOne({
                where:{
                    email: data.email
                }
            }, options)
            if(!user) {
                throw new ClientError({
                    name: "user doesn't exist",
                    message: "Create a profile first.",
                    explanation: "Though u r a user but ur profile isnt created yet.",
                    statusCode: StatusCodes.BAD_REQUEST
                })
            }
            //user exists
            await user.update(data);
            const updatedUser = await userProfile.findOne({
                where:{
                    email: data.email
                }
            }, options)
            
            const updateSkills = await this.updateSkills(data.skillsId, updatedUser, options )


            return {updatedUser, updateSkills}


        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    
    async updateSkills(skillsId, updatedUser , options) {
        try {
            // Ensure skillsId is an array and contains valid numbers
            const skillIdsArray = Array.isArray(skillsId) 
                ? skillsId.map(id => Number(id)).filter(id => !isNaN(id)) 
                : (!isNaN(Number(skillsId)) ? [Number(skillsId)] : []);
    
            if (skillIdsArray.length === 0) {
                throw new Error("No valid skill IDs provided");
            }
    
            // Fetch the skills from the database
            const skills = await Skills.findAll({
                where: { id: skillIdsArray }
            }, options);
    
            if (skills.length === 0) {
                throw new Error("No valid skills found");
            }
    
            // Update user's skills by setting new ones (removes old skills and adds new)
            await updatedUser.setSkills(skills, options);
    
            return skills ;
        } catch (error) {
            console.error("Error in updateSkills:", error);
            throw error;
        }
    }
    
    async getUserProfielById(userId) {
        try {
            const user = await userProfile.findOne({
                where:{
                    userId
                }
            })
            if(!user) {
                throw new ClientError({
                    name: "user doesn't exist",
                    message: "",
                    explanation: "A user already has this username registered.",
                    statusCode: StatusCodes.BAD_REQUEST
                })
            }
            return user
        } catch (error) {
            console.log(error)
             throw error;
        }
        
    }
    async addSkills(data, options) {
        try {
            
            const skillIdsArray = Array.isArray(data.skillsId) ? data.skillsId.map(Number) : [Number(data.skillsId)];
    
            // Fetch skills from the database within the same transaction
            const skills = await Skills.findAll({
                where: { id: skillIdsArray },
                transaction: options.transaction
            });
    
            // Associate skills with the data.user instance
            await data.user.addSkills(skills, { transaction: options.transaction });
    
            return { skills };
        } catch (error) {
            console.error("Error in addSkills:", error);
            throw error;
        }
    }



    
    
    

}

module.exports = UserRepository;
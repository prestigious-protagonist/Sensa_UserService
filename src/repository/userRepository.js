
const {userProfile, social, sequelize, Skills, InterestedIns} = require('../models/index');
const AppErrors = require('../utils/error-handler');
const ValidationError = require('../utils/validation-error');
const ClientError = require('../utils/client-error');
const { StatusCodes } = require('http-status-codes');
const { initProducer, sendMessage } = require('../utils/queue/producer');
const { Op } = require('sequelize');
const userprofile = require('../models/userprofile');
const { v4: uuidv4 } = require('uuid');
const sendBasicEmail = require("../service/email-service");
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
            const userProf = await userProfile.create({...profileData, id: uuidv4()},options)
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
            
            
            console.log(error)
            console.log("Something went wrong at repository layer.")
            throw error;
        }
    }


    async sendEmail({ username, email }) {
        try {
            await sendBasicEmail(
                "jaskaranyt123@gmail.com",
                email,
                "Response from Sensa",
                "Hi " + username +" your acc is succ activated..."
            );
            return true;
        } catch (error) {
            throw error;
        }
    };
    async getAll(data, options) {
        try {
            const users = await userProfile.findAll({
                where: {
                    email: { [Op.ne]: data.userEmail } // Exclude logged-in user
                },
                include: [{ model: social, attributes: ['linkedIn', 'github'] }] // Optional: Include socials
            }, options);

            return users;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getUser(userId, options) {
        try {
            const users = await userProfile.findOne({
                where: {
                    id: userId 
                },
                include: [{ model: social, attributes: ['linkedIn', 'github'] },{ model: Skills, attributes: ['name'] },
                { model: InterestedIns, attributes: ['name'] }] // Optional: Include socials
            }, options);

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
            //let db handle its constraints too
            // if (usernameExists) {
            //     throw new ClientError({
            //         name: "Username Already Taken",
            //         message: "The username is already in use.",
            //         statusCode: StatusCodes.BAD_REQUEST
            //     });
            // }
    
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
        
        const {username, experience, gender, skillsId, email, interestedSkillsId} = data;
        
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
            
            const DOB  = user.dataValues.DOB
            
            // check if new exp is > dob
            const currentYear = new Date().getFullYear();
            const dobYear = new Date(DOB).getFullYear()
            const today = new Date();
            const dob = new Date(DOB);

            if (dob > today) {
                throw new ClientError({
                    name: "Invalid value for DOB",
                    message: "Invalid DOB!",
                    explanation: "DOB cannot be in the future.",
                    statusCode: StatusCodes.BAD_REQUEST,
                    success: false
                });
            }
            if(experience > currentYear-dobYear) {
                throw new ClientError({
                    name: "Invalid value for experience",
                    message: "Experience cannot be more than user's age !",
                    explanation: "Invalid request body",
                    statusCode: StatusCodes.BAD_REQUEST,
                    success: false
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
            const updateInterests = await this.updateInterests(data.interestedSkillsId, updatedUser, options)

            return {updatedUser, updateSkills, updateInterests}


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
    async updateInterests(skillsId, updatedUser , options) {
        try {
            // Ensure skillsId is an array and contains valid numbers
            const skillIdsArray = Array.isArray(skillsId) 
                ? skillsId.map(id => Number(id)).filter(id => !isNaN(id)) 
                : (!isNaN(Number(skillsId)) ? [Number(skillsId)] : []);
    
            if (skillIdsArray.length === 0) {
                throw new Error("No valid skill IDs provided");
            }
    
            // Fetch the skills from the database
            const skills = await InterestedIns.findAll({
                where: { id: skillIdsArray }
            }, options);
    
            if (skills.length === 0) {
                throw new Error("No valid skills found");
            }
    
            // Update user's skills by setting new ones (removes old skills and adds new)
            await updatedUser.setInterestedIns(skills, options);
    
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

    async addInterestedSkills(data, options) {
        try {
            
            const skillIdsArray = Array.isArray(data.interestedSkillsId) ? data.interestedSkillsId.map(Number) : [Number(data.interestedSkillsId)];
    
            // Fetch skills from the database within the same transaction
            const skills = await InterestedIns.findAll({
                where: { id: skillIdsArray },
                transaction: options.transaction
            });
            console.log("IOIOIOIO")
            console.log(skills)
    
            // Associate skills with the data.user instance
            await data.user.addInterestedIns(skills, { transaction: options.transaction });
    
            return { skills };
        } catch (error) {
            console.error("Error in addSkills:", error);
            throw error;
        }
    }

    async myProfile(email, options) {
        try {
            
            const user = await userProfile.findOne({
                where: { email },
                include: [
                    {
                        model: social, // Include social profile
                        as: "social",  // Must match alias in association
                    },
                    {
                        model: Skills,  // Include skills
                        through: { attributes: [] }, // Exclude join table columns
                    },
                    {
                        model: InterestedIns,  // Include skills
                        through: { attributes: [] }, // Exclude join table columns
                    }
                ],
                
            }, options);
            return user;
        } catch (error) {
            throw error;
        }
    }



    async deleteAccount(email, options) {
        try {
            const user = await userProfile.destroy({
                where:{
                    email
                }
                
            }, options);
            //async process to delete user acc
            // await initProducer()
            
            
            return true;
        } catch (error) {
            
        console.log(error)
            throw error;
        }
    }
    async getUserByEmail(email) {
        try {
            const user = await userProfile.findOne({
                where:{
                    email
                }
            })
            return user
        } catch (error) {
            
        console.log(error)
            throw error
        }
    }

    async addSocials({userId, githubUrl, linkedinUrl}, options) {
        try {
            console.log("IPIPIPIPIPI")
            console.log(userId+githubUrl+linkedinUrl)
            const addSocials = await social.create({
                id: uuidv4(),
                userProfileId: userId,
                linkedIn: linkedinUrl,
                github: githubUrl
            }, options)
            return addSocials;
        } catch (error) {
            
            console.log(error)
            throw error
        }
    }



 
    
    
    

}

module.exports = UserRepository;
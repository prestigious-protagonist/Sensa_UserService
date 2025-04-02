const UserRepository = require('../repository/userRepository')
const ClientError = require('../utils/client-error')
const {StatusCodes} = require('http-status-codes')
const AppErrors = require('../utils/error-handler')
const axios = require('axios')
const ValidationError = require('../utils/validation-error')

class UserService {
    constructor(){
        this.UserRepository = new UserRepository()
    }

    async create({ pfp, bio, experience, gender, email, DOB, username, skillsId }, options) {
        try { 
            console.log("******");
    
            // Calculate age from DOB
            const calculateAge = (dob) => {
                const birthDate = new Date(dob);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age;
            };
    
            const age = calculateAge(DOB);
    
            const userProfile = await this.UserRepository.create(
                { pfp, bio, experience, gender, email, DOB, username, age }, // Include age
                options
            );
    
            if (!userProfile) {
                throw "Error while creating userProfile";
            }
    
            const skillsAdder = await this.addSkills({ skillsId, email, user: userProfile }, options);
            if (!skillsAdder) {
                throw "Couldn't add skills at the moment";
            }
    
            return { userProfile, skillsAdder };
    
        } catch (error) {
            if(error.name == "SequelizeUniqueConstraintError" && error.errors[0].type == "unique violation") {
                            if(error.errors[0].path.startsWith("username")) {
                               throw new ClientError({
                                    name: error.name,
                                    message: "Username already exists. Try a different one.",
                                    explanation: "A user already has this username registered.",
                                    statusCode: StatusCodes.BAD_REQUEST
                                })
                            }
                        }
            if(error.name == "SequelizeValidationError") {
                throw new ValidationError(error);
            }
                       
            if (error instanceof ClientError) {
                throw error;
            }
    
            throw new AppErrors("ServerError", "Something went wrong in service layer", "Logical issue occurred", 500, false);
        }
    }
    
    async addSkills(data, options) {
        try {
            const addSkill = await this.UserRepository.addSkills(data, options)
            if(!addSkill) {
                throw new ClientError({
                    name: "Couldn't add skills",
                    message: "Cannot add skills at the moment",
                    explanation: "Error adding skills",
                    statusCode: StatusCodes.INTERNAL_SERVER_ERROR
                })
            }
            return addSkill
        } catch (error) {
            console.log(error)
            throw new AppErrors("ServerError", "Something went wrong in service layer", "Logical issue occured",500, false);
       
        }
    }
    async getAll(userId, options) {
        try {
            const users = await this.UserRepository.getAll(userId, options)
            if(!users) {
                throw new ClientError({
                    name: "INTERNAL SERVER ERROR",
                    message: "Cannot fetch users at the moment",
                    explanation: "Error fetching users",
                    statusCode: StatusCodes.INTERNAL_SERVER_ERROR
                })
            }
            return users
        } catch (error) {
            if(error instanceof ClientError) {
                
                throw error
            }
            throw new AppErrors("ServerError", "Something went wrong in service layer", "Logical issue occured",500, false);
       
        }
    }


    async usernameIsvalid(username) {
        try {
            const usernameExists = await this.UserRepository.usernameIsvalid(username)
            if(usernameExists) {
                throw new ClientError({
                    name: "CLIENT ERROR",
                    message: "Choose a different username.",
                    explanation: "An account with this username already exists.",
                    statusCode: StatusCodes.INTERNAL_SERVER_ERROR
                })
            }
            return;
        } catch (error) {
            console.log(error)
            if(error instanceof ClientError) {
                
                throw error
            }
            throw new AppErrors("ServerError", "Something went wrong in service layer", "Logical issue occured",500, false);
       
        }
    }

    async updateUsername(data) {
        try {
            const updUsername = await this.UserRepository.updateUsername(data)
            if(!updUsername) {
                throw new ClientError({
                    name: "CLIENT ERROR",
                    message: "Username unavailable.",
                    explanation: "Username already linked to an existing account.",
                    statusCode: StatusCodes.INTERNAL_SERVER_ERROR
                })
            }
            return;
        } catch (error) {
            console.log(error)
            if(error instanceof ClientError) {
                
                throw error
            }
            throw new AppErrors("ServerError", "Something went wrong in service layer", "Logical issue occured",500, false);
       
        }
    }

    async updateProfile(data, options) {
        try {
            //2 sections 
                // - update userprofile
                // - update skills
            // whatever we have in req body just update it
            
            const updatedUser = await this.UserRepository.updateProfile(data, options)
            if(!updatedUser){
                throw new ClientError({
                    name: "CLIENT ERROR",
                    message: "Couldn't update profile at the moment.",
                    explanation: "Something went wrong.",
                    statusCode: StatusCodes.INTERNAL_SERVER_ERROR
                })
            }
            return updatedUser;
            
        } catch (error) {
            console.log(error)
            if(error.name == "SequelizeValidationError") {
                throw new ValidationError(error);
            }
                       
            if (error instanceof ClientError) {
                throw error;
            }
            throw new AppErrors("ServerError", "Something went wrong in service layer", "Logical issue occured",500, false);
       
        }
    }


}

module.exports = UserService
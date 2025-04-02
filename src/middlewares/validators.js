const cloudinary = require('../config/cloudinary-config')
const multer = require('multer');
const storage = multer.memoryStorage(); // Files are stored in memory
const upload = multer({ storage: storage });
const axios = require('axios');
const ClientError = require('../utils/client-error');
const {StatusCodes} = require('http-status-codes');
const AppErrors = require('../utils/error-handler');


const authValidator = async(req, res, next) => {
     try {
        console.log(req.body)
            const response = await axios.get("http://localhost:3001/authService/api/v1/users/status/isAuthenticated",{
                withCredentials: true,
                headers: { Cookie: req.headers.cookie },
            })
          
            if(!response.data.success) {
                throw new {
                    name: "Failed to retrieve email from cookies",
                    message: "Try again later",
                    data:[],
                    success: false
                }
            }
            req.body.email = response.data.data.email
            next()
        } catch (error) {
            console.log(error)
            next(error)
        }
}

const createProfileValidator = async(req, res, next) => {
        try {
            const {username, DOB, experience, gender, skillsId, email} = req.body;
            
            if(!(username && gender && DOB && experience && skillsId && email)) {
                
                throw new ClientError({
                    name: "MISSING_FIELDS",
                    message: "Missing Fields",
                    explanation: "Missing fields from request body",
                    statusCode: StatusCodes.BAD_REQUEST,
                    success: false
                })
            }
            if (!["Male", "Female", "Other"].includes(gender)) {
                throw new ClientError({
                    name: "Invalid gender type",
                    message: "Gender could be Male, Female or Other only",
                    explanation: "Invalid request body",
                    statusCode: StatusCodes.BAD_REQUEST,
                    success: false
                })
            }
            //check if exp is greater tahn age
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
            next()
        } catch (error) {
            console.log(error)
            next(error)
            
        }
        
    
}

const usernameValidator = async (req, res, next) => {
    try {
        const {username} = req.body;
            
            if(!(username )) {
                
                throw new ClientError({
                    name: "MISSING_FIELD",
                    message: "Field 'username' is missing from req body.",
                    explanation: "Missing fields from req body",
                    statusCode: StatusCodes.BAD_REQUEST,
                    success: false
                })
            }
            
            
            next()
    } catch (error) {
        console.log(error)
        next(error)
    }
}

// const addSkillsValidator = async(req, res, next) => {

//     try {
//         const {skillsId, email} = req.body
//         if(!skillsId || !email || skillsId.length<1) {
//             throw new ClientError({
//                 name: "MISSING_FIELDS",
//                 message: "Missing Fields",
//                 explanation: "Missing fields from request body",
//                 statusCode: StatusCodes.BAD_REQUEST,
//                 success: false
//             })
//         }

//         next()
//     } catch (error) {
//         console.log(error)
//         next(error)
//     }
    
// }

module.exports = {
    createProfileValidator,
    authValidator,
    usernameValidator
}
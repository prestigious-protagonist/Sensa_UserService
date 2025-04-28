require("dotenv").config()
const cloudinary = require('../config/cloudinary-config')
const multer = require('multer');
const storage = multer.memoryStorage(); // Files are stored in memory
const upload = multer({ storage: storage });
const axios = require('axios');
const ClientError = require('../utils/client-error');
const {StatusCodes} = require('http-status-codes');

const { getAuth } = require("@clerk/express");

const crypto = require('crypto');


const AppErrors = require('../utils/error-handler');

const JWKS_URL = 'https://coherent-shiner-22.clerk.accounts.dev/.well-known/jwks.json';
const AUDIENCE = 'http://localhost:3000';

const ISSUER = 'https://coherent-shiner-22.clerk.accounts.dev';

let JWKS;
const authValidator = async(req, res, next) => {
    const { createRemoteJWKSet, jwtVerify } = await import('jose');

    if (!JWKS) {
      JWKS = createRemoteJWKSet(new URL(JWKS_URL));
    }
  
    const token =
      req.headers.authorization?.split(' ')[1] || req.cookies?.__session;
  
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    try {
      const { payload } = await jwtVerify(token, JWKS, {
        issuer: ISSUER,
      });
  
      req.user = payload;
      console.log(payload)
    //   console.log("see : "+req.auth)
    //   req.body.oauthId = req.auth.userId
      next();
    } catch (error) {
      console.error('Authentication failed:', error);
      return res.status(401).json({ error: 'Session doesnt exists' });
    }
}

const createProfileValidator = async(req, res, next) => {
        try {
            const { sessionClaims } = getAuth(req);
            if(!sessionClaims?.userEmail) {
                console.log("CAME HERE")
                throw new ClientError({
                    name: "SESSION_OVER",
                    message: "session doesn't exists",
                    explanation: "Login please",
                    statusCode: StatusCodes.BAD_REQUEST,
                    success: false
                })
            }
            req.body.email = sessionClaims.userEmail 
              const {username, DOB, experience, gender, skillsId, email} = req.body;
              
              if(!username || !gender || !DOB || !experience || !skillsId || !email) {
                  
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

const updateProfileValidator = async (req, res, next) => {
    try {
        console.log(req.body)
      const { sessionClaims } = getAuth(req);
  
      if (!sessionClaims?.userEmail) {
        throw new ClientError({
          name: "SESSION_OVER",
          message: "Session doesn't exist",
          explanation: "Login please",
          statusCode: StatusCodes.BAD_REQUEST,
          success: false
        });
      }
  
      // set email first
      req.body.email = sessionClaims.userEmail;
  
      const allowedFields = [
        "username",
        "experience",
        "DOB",
        "gender",
        "bio",
        "pfp",
        "skillsId",
        "linkedinUrl",
        "githubUrl",
        "interestedSkillsId",
        "email",
        "oauthId"
      ];
  
      if (Object.keys(req.body).some((field) => !allowedFields.includes(field))) {
        throw new ClientError({
          name: "Invalid request body",
          message: "Unexpected request body",
          explanation: "Access restricted",
          statusCode: StatusCodes.BAD_REQUEST,
          success: false
        });
      }
  
      // destructure AFTER setting email
      const { username, gender, experience, skillsId, email } = req.body;
  
      if (!username || !gender || !experience || !skillsId || !email) {
        throw new ClientError({
          name: "MISSING_FIELDS",
          message: "Missing Fields",
          explanation: "Missing fields from request body",
          statusCode: StatusCodes.BAD_REQUEST,
          success: false
        });
      }
  
      if (!["Male", "Female", "Other"].includes(gender)) {
        throw new ClientError({
          name: "Invalid gender type",
          message: "Gender could be Male, Female or Other only",
          explanation: "Invalid request body",
          statusCode: StatusCodes.BAD_REQUEST,
          success: false
        });
      }
  
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  
  

module.exports = {
    createProfileValidator,
    authValidator,
    usernameValidator,
    updateProfileValidator
}
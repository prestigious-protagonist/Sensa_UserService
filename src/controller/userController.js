
const UserService = require('../service/userService')
const ClientError = require('../utils/client-error')
const axios = require('axios')
const {Sequelize} = require("sequelize")
const {sequelize} = require("../models/index");
const {StatusCodes} = require("http-status-codes")
const AppErrors = require('../utils/error-handler');
const ValidationError = require('../utils/validation-error');
const {jwtDecode} = require('jwt-decode')

const { getAuth } = require("@clerk/express");
this.UserService = new UserService()
const create = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        console.log(req.body)
        const userProfile = await this.UserService.create(req.body,{transaction})
        await transaction.commit();
        return res.status(StatusCodes.CREATED).json({
            status: 201,
            message:"Profile Created Successfully!",
            data:userProfile,
            success: true,
            err: {}
        })
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        
        
        if (!(error instanceof AppErrors || error instanceof ClientError)) {
            // If it's not an instance of AppError, it's an unexpected error
            error = new AppErrors();
           
        }
        return res.status(error.statusCode).json({
            err: error.name,
            message:error.message,
            data:error.explanation,
            success: error.success,
            
        })
    }
}


// const addSkills = async(req, res) => {
//     try {
//         const {skil} = req.body;
         
//         const addSkills = await this.UserService.addSkills(req.body) 
//         return res.status(StatusCodes.CREATED).json({
//             message:"Skills added successfully",
//             data: addSkills,
//             success: true,
//             err: {}
//         })
//     } catch (error) {
//         console.log(error)
//         return res.status(error.statusCode).json({
//             err: error.name,
//             message:error.message,
//             data:error.explanation,
//             success: error.success,
            
//         })
//     }
// }

const getAll = async (req, res) => {
    
    const transaction = await sequelize.transaction();
    try {
        
         
        const users = await this.UserService.getAll(req.user ,{transaction}) 
        await transaction.commit()
        return res.status(StatusCodes.CREATED).json({
            status: 200,
            message:"Successfully fetched all users",
            data: users,
            success: true,
            
        })
    } catch (error) {
        await transaction.rollback();
        return res.status(error?.statusCode || 500).json({
            err: error.name,
            message:error.message,
            data:error.explanation,
            success: error.success,
            
        })
    }
}

const getUser = async (req, res) => {
    
    const transaction = await sequelize.transaction();
    try {
       
         
        const user = await this.UserService.getUser(req.params.id ,{transaction}) 
        await transaction.commit()
        return res.status(StatusCodes.CREATED).json({
            status: 200,
            message:"Successfully fetched user",
            data: user,
            success: true,
            
        })
    } catch (error) {
        await transaction.rollback();
        return res.status(error?.statusCode || 500).json({
            err: error.name,
            message:error.message,
            data:error.explanation,
            success: error.success,
            
        })
    }
}
const usernameIsvalid = async (req, res) => {
    
    try {
        
        
        const user = await this.UserService.usernameIsvalid(req.body.username ) 
        
        return res.status(StatusCodes.ACCEPTED).json({
            status: 200,
            message:"Valid",
            explanation: "You can go with this username.",
            success: true
        })
    } catch (error) {
        console.log(error)
        return res.status(error?.statusCode || 500).json({
            err: error.name,
            message:error.message,
            data:error.explanation,
            success: error.success,
            
        })
    }
}





const updateUsername = async (req, res) => {
    
    try {
        
        console.log(req.body)
        const updUsername = await this.UserService.updateUsername(req.body ) 
        
        return res.status(StatusCodes.ACCEPTED).json({
            status: 200,
            message:"Username Updated Successfully",
            explanation: "Username updated successfully.",
            success: true
        })
    } catch (error) {
        console.log(error)
        return res.status(error?.statusCode || 500).json({
            err: error.name,
            message:error.message,
            data:error.explanation,
            success: error.success,
            
        })
    }
}





const updateProfile = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        
        const updatedUser = await this.UserService.updateProfile(req.body, {transaction} ) 
        await transaction.commit()
        return res.status(StatusCodes.ACCEPTED).json({
            status: 200,
            message:"Profile Updated Successfully",
            explanation: updatedUser,
            success: true
        })
    } catch (error) {
        await transaction.rollback()
        return res.status(error?.statusCode || 500).json({
            err: error.name,
            message:error.message,
            data:error.explanation,
            success: error.success,
            
        })
    }
}


const myProfile = async (req, res) => {
    const transaction = await sequelize.transaction();
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
        const email = sessionClaims.userEmail 
        const user = await this.UserService.myProfile(email, {transaction} ) 
        await transaction.commit()
        return res.status(StatusCodes.ACCEPTED).json({
            status: 200,
            message:"Profile fetched successfully",
            data: user,
            success: true
        })
    } catch (error) {
        await transaction.rollback()
        return res.status(error?.statusCode || 500).json({
            err: error.name,
            message:error.message,
            data:error.explanation,
            success: error.success,
            
        })
    }
}



const deleteAccount = async (req, res) => {
    const transaction = await sequelize.transaction();
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
        const email = sessionClaims.userEmail
        const user = await this.UserService.deleteAccount(email, {transaction} ) 
        await transaction.commit()
        return res.status(StatusCodes.ACCEPTED).json({
            status: 200,
            message:"Profile deleted successfully",
            data: user,
            success: true
        })
    } catch (error) {
        console.log(error)
        await transaction.rollback()
        return res.status(error?.statusCode || 500).json({
            err: error.name,
            message:error.message,
            data:error.explanation,
            success: error.success,
            
        })
    }
}

module.exports = {
    create,
    getAll,
    getUser,
    usernameIsvalid,
    updateUsername,
    updateProfile,
    myProfile,
    deleteAccount
}
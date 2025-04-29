
const ConnectionService = require('../service/connectionService')
const ClientError = require('../utils/client-error')
const axios = require('axios')
const {Sequelize} = require("sequelize")
const {sequelize} = require("../models/index");
const {StatusCodes} = require("http-status-codes")
const AppErrors = require('../utils/error-handler');
const ValidationError = require('../utils/validation-error');
const {jwtDecode} = require('jwt-decode')
this.ConnectionService = new ConnectionService()
const create = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        req.body.toUserId = req.params.toUserId;
        req.body.status = req.params.status; 
        
        const userProfile = await this.ConnectionService.create(req.body, req.user ,{transaction})
        await transaction.commit();
        return res.status(StatusCodes.CREATED).json({
            status: 201,
            message:"Connection sent Successfully!",
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
const getAllRequests = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        
        const requests = await this.ConnectionService.getAllRequests(req.user.userEmail ,{transaction})
        await transaction.commit();
        return res.status(StatusCodes.CREATED).json({
            status: 201,
            message:"Fetched all requests successfully!",
            data:requests,
            success: true,
            err: {}
        })
    } catch (error) {
        
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
const requests = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const data = {
            email : req.user.userEmail,
            status: req.params.status,
            requestId: req.params.requestId
        }
        const requests = await this.ConnectionService.requests(data ,{transaction})
        await transaction.commit();
        return res.status(StatusCodes.CREATED).json({
            status: 201,
            message: `Request ${data.status}`,
            data:requests,
            success: true,
            err: {}
        })
    } catch (error) {
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
const viewConnections = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        
        const connections = await this.ConnectionService.viewConnections(req.params.email ,{transaction})
        await transaction.commit();
        return res.status(StatusCodes.OK).json({
            status: 200,
            message: "Successfully fetched all connections",
            data:connections,
            success: true,
            err: {}
        })
    } catch (error) {
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
const getFeed = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        let limit = parseInt(req.query.limit) || 10
        
        limit = limit>50? 50: limit
        const data ={
            email: req.user.userEmail,
            page: parseInt(req.query.page) || 1,
            limit : limit
        }
        const feed = await this.ConnectionService.getFeed(data ,{transaction})
        await transaction.commit();
        return res.status(StatusCodes.OK).json({
            status: 200,
            message: "Successfully fetched the feed",
            data: feed,
            success: true,
            err: {}
        })
    } catch (error) {
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

module.exports = {
    create,
   getAllRequests,
   requests,
   viewConnections,
   getFeed
}
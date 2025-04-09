const express = require("express")
const router = express.Router()
const connectionRequestSchema = require("../../models/connectionSchema/connection")
const {authValidator} = require('../../middlewares/validators')
const {userProfile} = require("../../models/index")
const ConnectionController = require("../../controller/connection-controller")
const { StatusCodes } = require("http-status-codes")
router.post('/send/:status/:toUserId', authValidator, ConnectionController.create); //send req
router.post('/review/:status/:requestId',(req, res, next)=>{ //review req
    console.log("yeaghhhhhhhhhhhhhh")
    next()
},authValidator, ConnectionController.requests)
router.get('/received', authValidator, ConnectionController.getAllRequests)//pending requests

router.get('/viewConnections', authValidator, ConnectionController.viewConnections)//pending requests
router.get('/feed', authValidator, ConnectionController.getFeed)

router.use('*', (req, res)=>{
    res.status(StatusCodes.FORBIDDEN).json({
        status: StatusCodes.FORBIDDEN,
        message: "Route Forbidden",
        explanation : "No matching route exists",
    })
})
module.exports = router;
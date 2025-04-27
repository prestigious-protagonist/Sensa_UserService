const express = require('express')
const router = express.Router()
const axios = require('axios')
const UserController = require('../../controller/userController')
const {StatusCodes} = require("http-status-codes") 
const { clerkMiddleware } = require('@clerk/express')
const {userProfile, social, Skills} = require('../../models/index')
const requestRouter = require('./requests')
const { jwtDecode } = require('jwt-decode');
const ClientError = require('../../utils/client-error')
const cookieParser = require('cookie-parser');
router.use(cookieParser())
router.use('/request', requestRouter)
router.use(
    clerkMiddleware({
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
      secretKey: process.env.CLERK_SECRET_KEY,  // Make sure this is defined in .env
    })
  );
const { authValidator,createProfileValidator, usernameValidator, updateProfileValidator } = require('../../middlewares/validators');
router.get('/getAll', authValidator, UserController.getAll)

router.get('/getUser/:id', UserController.getUser)



router.delete('/deleteAccount', UserController.deleteAccount)





//move authvalidator to add emai in body in apigateway

router.post('/createProfile', createProfileValidator, UserController.create) //createProfile //done

router.patch('/updateUsername', usernameValidator, authValidator, UserController.updateUsername) 

//mske a route for complete profile updation
router.patch('/updateProfile',authValidator, updateProfileValidator,  UserController.updateProfile) 


router.get('/myprofile', UserController.myProfile) //done

router.post('/usernameExists', usernameValidator, UserController.usernameIsvalid) 


























router.delete('/deleteProfile', authValidator,async (req, res)=> {
    
        const stat = await userProfile.destroy({
            where:{
                email: req.body.email
            }
        })
        res.status(200).json({
            msg: "Deleted Successfully"
        })
    
})

// issueee

router.use((err, req, res, next) => {
    
    if (err instanceof ClientError) {
        return res.status(err.statusCode).json({
            success: false,
            name: err.name,
            message: err.message,
            explanation: err.explanation,
            statusCode: err.statusCode
        });
    }
        
    res.status(500).json({ message: "Something went wrong!" });
});


router.use('*', (req, res)=>{
    res.status(StatusCodes.FORBIDDEN).json({
        status: StatusCodes.FORBIDDEN,
        message: "Route Forbidden",
        explanation : "No matching route exists",
    })
})
module.exports = router
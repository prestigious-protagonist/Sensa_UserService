const express = require('express')
const router = express.Router()
const axios = require('axios')
const UserController = require('../../controller/userController')

const {userProfile, social, Skills} = require('../../models/index')
const requestRouter = require('./requests')
const { jwtDecode } = require('jwt-decode');
const ClientError = require('../../utils/client-error')
const cookieParser = require('cookie-parser');
router.use(cookieParser())
router.use('/request', requestRouter)
const { authValidator,createProfileValidator, usernameValidator, updateProfileValidator } = require('../../middlewares/validators');
router.get('/getAll', UserController.getAll)




router.delete('/deleteAccount', authValidator, UserController.deleteAccount)





//move authvalidator to add emai in body in apigateway

router.post('/createProfile', authValidator, createProfileValidator, UserController.create) //createProfile

router.patch('/updateUsername', usernameValidator, authValidator, UserController.updateUsername) 

//mske a route for complete profile updation
router.patch('/updateProfile',authValidator, updateProfileValidator,  UserController.updateProfile) 


router.post('/myprofile', authValidator, UserController.myProfile)

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
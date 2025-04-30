const ValidationError = require("../utils/validation-error");
const connectionRequestSchema = require("../models/connectionSchema/connection")

const {userProfile, social, sequelize, Skills, InterestedIns} = require('../models/index');
const ClientError = require("../utils/client-error");
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const AppErrors =  require('../utils/error-handler')
const {StatusCodes} = require("http-status-codes")
class ConnectionRepository {
    async getUserByEmail(email, options) {
        try {
            console.log("EMAIL IS "+email)
            const user = await userProfile.findOne({
                where:{
                    email,
                },
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
            },options)
            if(!user) return false;
            return user;
        } catch (error) {
            throw error;
        }
    }
    async getUserById(id, options) {
        try {
            const user = await userProfile.findOne({
                where:{
                    id,
                },
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
            },options)
            return user;
        } catch (error) {
            throw error;
        }
    }
    async getUserByUUID(id, options) {
        try {
            const user = await userProfile.findOne({
                where:{
                    id,
                }
            },options)
            console.log("*************")
            console.log(user)
            console.log("*************")
            return user;
        } catch (error) {
            throw error;
        }
    }
    async create({senderId, toUserId, status}, options) {
        
        try {
            const acceptedRequestExists = await connectionRequestSchema.findOne({
                $or: [
                    { senderId, receiverId: toUserId, status: "accepted" },
                    { senderId: toUserId, receiverId: senderId, status: "accepted" }
                ]
            });
            if (acceptedRequestExists != null) {
                throw new ClientError({
                    name: "ConnectionAlreadyExists",
                    message: "You are already connected with this user.",
                    explanation: "An accepted connection already exists between both users.",
                    statusCode: StatusCodes.CONFLICT, // 409
                    success: false
                });
            }
            
            // Check if a rejected request exists
            const rejectedRequestExists = await connectionRequestSchema.findOne({
                $or: [
                    { senderId, receiverId: toUserId, status: "rejected" },
                    { senderId: toUserId, receiverId: senderId, status: "rejected" }
                ]
            });
            if (rejectedRequestExists != null) {
                throw new ClientError({
                    name: "RequestRecentlyRejected",
                    message: "Connection was recently rejected.",
                    explanation: "You must wait 7 days before sending another request.",
                    statusCode: StatusCodes.TOO_EARLY, // 425
                    success: false
                });
            }
            
            // Look if an interested request already exists
            const requestExists = await connectionRequestSchema.findOne({
                $or: [
                    { senderId, receiverId: toUserId, status: "interested" },
                    { senderId: toUserId, receiverId: senderId, status: "interested" }
                ]
            });
            
            if (requestExists?.senderId == senderId) {
                throw new ClientError({
                    name: "DuplicateRequest",
                    message: "Request already sent.",
                    explanation: "You’ve already sent a connection request to this user.",
                    statusCode: StatusCodes.BAD_REQUEST,
                    success: false
                });
            }
            
            if (requestExists?.senderId == toUserId) {
                throw new ClientError({
                    name: "PendingIncomingRequest",
                    message: "You have a pending request from this user.",
                    explanation: "Please respond to the incoming connection request instead of sending a new one.",
                    statusCode: StatusCodes.BAD_REQUEST,
                    success: false
                });
            }
            
            
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
            
            if(requestExists!=null) {

                throw new ClientError({
                    name: "Database Error",
                    message: "request already exists.",
                    explanation: "Cannot send a request until previous req is fulfilled",
                    statusCode: StatusCodes.BAD_REQUEST
                })
            }
            const senderProfile = await this.getUserByUUID(senderId, options);
            const connectionRequest = new connectionRequestSchema({
                        _id: uuidv4(), 
                        senderId: senderId,
                        receiverId : toUserId,
                        status: status,
                        senderInfo: {
                            id: senderProfile.id,
                            username: senderProfile.username,
                            email: senderProfile.email,
                            profilePicture: senderProfile.profilePicture,
                            gender: senderProfile.gender,
                            bio: senderProfile.bio,
                            experience: senderProfile.experience,
                            age: senderProfile.age,
                          },
                    }, options)
            const data = await connectionRequest.save()
            return data

        } catch (error) {
            console.log(error)
            if (error.name === "ValidationError") {
                throw new ClientError({
                    name: "Validation Error",
                    message: "status can be interested/ ignored only",
                    explanation: `Invalid value for status ${status}.`,
                    statusCode: StatusCodes.BAD_REQUEST
                })
            }

            if (error.name === "MongoServerError" && error?.errorResponse?.errmsg!=null) {
                throw new ClientError({
                    name: "Server Error",
                    message: "Wait for the previous req to get fullfilled first",
                    explanation: error?.errorResponse?.errmsg,
                    statusCode: StatusCodes.BAD_REQUEST
                })
            }

        
            throw error;
        }
    }
    async getAllRequests(loggedInUserId, options) {
        try {
            const getAllRequests = await connectionRequestSchema.find(
                { receiverId: loggedInUserId, status: "interested" }
            ).lean();
            
            const userInfo = await this.getUserByUUID(loggedInUserId, options);
            
            return {
                currentUser: {
                    currentUserId: loggedInUserId,
                    data: userInfo
                },
                requests: getAllRequests.map(request => ({ ...request }))
            };
            
            
        } catch (error) {
            throw error;
        }
    }

   

        async getRequest({requestId, loggedInUserId}, options) {
            try {
                console.log(requestId)
                console.log(loggedInUserId)
                const request = await connectionRequestSchema.findOne({
                    _id: requestId,
                    receiverId: loggedInUserId,
                    status: "interested"
                }, null,options)
                console.log(request)
                return request;

                
            } catch (error) {
                
                console.log(error)
                throw error;
            }
        }
        async updateStatus(status, request, options) {
            try {
                request.status = status
                const data = await request.save(options)
                return data;

                
            } catch (error) {
                
        console.log(error)
                throw error;
            }
        }
        async removeRequest(request, options) {
            try {
                const data = await request.deleteOne(options)
                return data;

                
            } catch (error) {
                
        console.log(error)
                throw error;
            }
        }
        async viewConnections(loggedInUserId, options) {
            try {
                const connections = await connectionRequestSchema.find({
                    $or: [
                        { senderId: loggedInUserId, status: "accepted" },
                        { receiverId: loggedInUserId, status: "accepted" }
                    ]
                }, null, options);
                
                const enrichedConnections = [];
                
                for (const conn of connections) {
                    const otherUserId = conn.senderId === loggedInUserId ? conn.receiverId : conn.senderId;
                
                    try {
                        const user = await this.getUserById(otherUserId, options);
                
                        // Convert Sequelize instance to plain object
                        const plainUser = typeof user.toJSON === 'function' ? user.toJSON() : user;
                
                        enrichedConnections.push({
                            connectionId: conn._id,
                            ...plainUser
                        });
                
                    } catch (err) {
                        console.error(`Failed to fetch user ${otherUserId}:`, err);
                        // Optional: skip or push a fallback user object
                    }
                }
                
                return enrichedConnections;
                
        
        
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
        
        
        
        async getRelatedUsers(loggedInUserId, options) {
            try {
                
                const data = await connectionRequestSchema.find({
                    $or:[
                        {senderId: loggedInUserId},
                        {receiverId: loggedInUserId}
                    ]
                },null, options)
                return data;

                
            } catch (error) {
                
        console.log(error)
                throw error;
            }
        }

        async getAllUserProfiles(loggedInUserId, options) {
            try {
                
                const users = await userProfile.findAll({
                                where: {
                                    id: { [Op.ne]: loggedInUserId } 
                                },
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
                            });
                
                return users;
                
            } catch (error) {
                
        console.log(error)
                throw error;
            }
        }
        async getTotalSkills(options) {
                try {
                    const totalSkills = await Skills.count({},options);
                    console.log(totalSkills)
                    return totalSkills;
                } catch (error) {
                    throw error;
                }
            }

        async removeConnection(data,options) {
            try {
                const removedConnection = await connectionRequestSchema.deleteOne({
                   
                    _id: data.requestId
                   
                }, options);
                return removedConnection;
            } catch (error) {
                throw error;
            }
        }
}

module.exports = ConnectionRepository
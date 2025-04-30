const ConnectionRepository = require('../repository/connectionRepository')
const ClientError = require('../utils/client-error')
const {StatusCodes} = require('http-status-codes')
const AppErrors = require('../utils/error-handler')
const axios = require('axios')
const ValidationError = require('../utils/validation-error')

class ConnectionService {
    constructor(){
        this.ConnectionRepository = new ConnectionRepository()
    }
    async create(data, userDetails, options) {
        try {
            const allowedStatus = ["interested", "ignored"];
            if (!allowedStatus.includes(data.status)) {
                // Handle invalid status
                throw new ClientError({
                    name: "Validation Error",
                    statusCode: StatusCodes.NOT_FOUND,
                    message: "Invalid status sent in query params",
                    explanation: "valid status while sending a connection request can be interested or ignored only.",
                    data: allowedStatus
                })
            }

            const getUserByEmail = await this.ConnectionRepository.getUserByEmail(userDetails?.userEmail, options)
            if(!getUserByEmail) {
                throw new ClientError({
                    name: "user doesn't exist",
                    message: "Create a profile first.",
                    explanation: "Though u r a user but ur profile isnt created yet.",
                    statusCode: StatusCodes.BAD_REQUEST
                })
            } 
            // ceheckign if the othe user exists
            if(data?.toUserId.length<36)  
                throw new ClientError({
                    name: "Invalid ReceiverId",
                    message: "Receiver doesn't have an acc.",
                    explanation: "u are trying to send req to someone whon doesnt have a profile yet.",
                    statusCode: StatusCodes.BAD_REQUEST
                })
            const getUserById = await this.ConnectionRepository.getUserById(data?.toUserId, options)
            if(!getUserById) {
                throw new ClientError({
                    name: "Request not sent",
                    message: "Receiver doesn't have an acc.",
                    explanation: "u are trying to send req to someone whon doesnt have a profile yet.",
                    statusCode: StatusCodes.BAD_REQUEST
                })
            } 
            if(getUserByEmail?.dataValues?.id === data?.toUserId) {
                throw new ClientError({
                    name: "Logical Error",
                    message: "You cannot send a connection request to yourself.",
                    explanation: "fool.",
                    statusCode: StatusCodes.BAD_REQUEST
                })
            }
            const senderId = getUserByEmail?.dataValues?.id
            const sendRequest = await this.ConnectionRepository.create({...data, senderId}, options);

            if(!sendRequest) {
                throw new ClientError({
                    name: "Something went wrong",
                    message: "Couldn't send request at the moment.",
                    statusCode: StatusCodes.INTERNAL_SERVER_ERROR
                })
            }

            /*socket*/
            // Notify NotificationService
            
                await axios.post('http://localhost:3007/routes/connection-request', {
                toUserId: data?.toUserId,
                fromUserId: senderId,
                });                                     
  
            return sendRequest;
        } catch (error) {
            
        console.log(error)
            // if(axios.isAxiosError(error)) {
            //     console.log()
            // }
            if (error instanceof ClientError) {
                throw error;
            }
    
            throw new AppErrors("ServerError", "Something went wrong in service layer", "Logical issue occurred", 500, false);
        }
    }
    async getAllRequests(email, options) {
        try {
            //get the current user's id from email first
            const getUserByEmail = await this.ConnectionRepository.getUserByEmail(email, options)
            if(!getUserByEmail) {
                throw new ClientError({
                    name: "user doesn't exist",
                    message: "Create a profile first.",
                    explanation: "Though u r a user but ur profile isnt created yet.",
                    statusCode: StatusCodes.BAD_REQUEST
                })
            } 
            const loggedInUserId = getUserByEmail?.dataValues?.id
            //now in connection schema look for records where the receiverId is loggedInUserId & status is interested
            const getAllRequests = await this.ConnectionRepository.getAllRequests(loggedInUserId, options);
            
            if(getAllRequests.length == 1) {
                throw new ClientError({
                    name: "Insufficient Resource",
                    statusCode: StatusCodes?.NON_AUTHORITATIVE_INFORMATION ,
                    message: "No pending connection requests.",
                    explanation: "No pending requests to show for now.",
                    
                    
                })
            }
            return getAllRequests;
            

        } catch (error) {
            if (error instanceof ClientError) {
                throw error;
            }
    
            throw new AppErrors("ServerError", "Something went wrong in service layer", "Logical issue occurred", 500, false);
      
        }
    }
    async requests(data, options) {
        try {
            console.log(data)
            const allowedStatus = ["accepted", "rejected"]
            if (!allowedStatus.includes(data.status)) {
                throw new ClientError({
                    name: "Invalid Status",
                    message: `Status must be one of: ${allowedStatus.join(", ")}`,
                    statusCode: 400,
                    explanation: `Received '${data.status}', which is not allowed.`,
                    success: false
                });
            }
            //get the current user's id from email first
            const getUserByEmail = await this.ConnectionRepository.getUserByEmail(data.email, options)
            if(!getUserByEmail) {
                throw new ClientError({
                    name: "user doesn't exist",
                    message: "Create a profile first.",
                    explanation: "Though u r a user but ur profile isnt created yet.",
                    statusCode: StatusCodes.BAD_REQUEST
                })
            } 
            const loggedInUserId = getUserByEmail?.dataValues?.id
            //now in connection schema look for records where the receiverId is loggedInUserId & status is interested
            const request = await this.ConnectionRepository.getRequest({...data, loggedInUserId}, options);
            
            if (!request) {
                throw new ClientError({
                    name: "Request Not Found",
                    message: "Connection request does not exist.",
                    statusCode: 404,
                    explanation: "No connection request found matching the provided criteria.",
                    success: false
                });
            }
            if (data.status === "rejected") {
                const updateStatus = await this.ConnectionRepository.updateStatus("rejected", request, options);
                if (!updateStatus) {
                    throw new Error("Server error: Unable to update connection status to 'rejected'.");
                }
            
                const requestCopy = JSON.parse(JSON.stringify(request));
                requestCopy.status = "rejected";
            
                const removed = await this.ConnectionRepository.removeRequest(request, options);
                if (!removed) {
                    throw new Error("Couldn't reject request at the moment");
                }
            
                return {
                    message: "Request rejected and removed.",
                    request: requestCopy
                };
            }
            if (data.status === "accepted") {
                const updateStatus = await this.ConnectionRepository.updateStatus("accepted", request, options);
                if (!updateStatus) {
                    throw new Error("Server error: Unable to accept connection request.");
                }
            
                const updatedRequest = JSON.parse(JSON.stringify(request));
                updatedRequest.status = "accepted";
            
                return {
                    message: "Request accepted.",
                    request: updatedRequest
                };
            }

            return {
                message: "No action taken",
                request: null
            };
            
        } catch (error) {
            if (error instanceof ClientError) {
                throw error;
            }
    
            throw new AppErrors("ServerError", "Something went wrong in service layer", "Logical issue occurred", 500, false);
      
        }
    }
    async viewConnections(email, options) {
        try {
            //get the current user's id from email first
            const getUserByEmail = await this.ConnectionRepository.getUserByEmail(email, options)
            if(!getUserByEmail) {
                throw new ClientError({
                    name: "user doesn't exist",
                    message: "Create a profile first.",
                    explanation: "Though u r a user but ur profile isnt created yet.",
                    statusCode: StatusCodes.BAD_REQUEST
                })
            } 
            const loggedInUserId = getUserByEmail?.dataValues?.id
            //now in connection schema look for records where the sender/ receiverId is loggedInUserId & status is accepted
            const connections = await this.ConnectionRepository.viewConnections(loggedInUserId, options);
            
            if(connections.connections.length == 0) {
                throw new ClientError({
                    name: "Insufficient Resource",
                    statusCode: StatusCodes?.OK ,
                    message: "No connections found.",
                    explanation: "No connections to show for now.",
                    
                    
                })
            }
            return {
                count: connections.connections.length,
                data: connections
            };
            

        } catch (error) {
            if (error instanceof ClientError) {
                throw error;
            }
    
            throw new AppErrors("ServerError", "Something went wrong in service layer", "Logical issue occurred", 500, false);
      
        }
    }


    async getFeed(data, options) {
        try {
            //get the current user's id from email first
            
            console.log(data)
            const getUserByEmail = await this.ConnectionRepository.getUserByEmail(data.email, options)
            if(!getUserByEmail) {
                throw new ClientError({
                    name: "user doesn't exist",
                    message: "Create a profile first.",
                    explanation: "Though u r a user but ur profile isnt created yet.",
                    statusCode: StatusCodes.BAD_REQUEST
                })
            } 
            const loggedInUserId = getUserByEmail?.dataValues?.id
            //now in connection schema look for records where the sender/ receiverId is loggedInUserId & status is accepted
            const uuidSet = new Set();

/*
* 
*
!  what not to show
            - current user
            - any other user invloved with current user in connection Schema
*
*/

           //get related user uuids
           const relatedUsers = await this.ConnectionRepository.getRelatedUsers(loggedInUserId, options);
           console.log(relatedUsers)
           relatedUsers.map((connection, key = connection._id)=> {
                if(connection.senderId != loggedInUserId ) {
                    uuidSet.add(connection.senderId);
                } else if ( connection.receiverId != loggedInUserId) {
                    uuidSet.add(connection.receiverId);
                }
           })
           
           const notPermittedUsers = Array.from(uuidSet)
           //now remove these notpermittedUsers from all userProfiles
           const getAllUserProfiles = await this.ConnectionRepository.getAllUserProfiles(loggedInUserId, options)
           const filteredUsers = getAllUserProfiles.filter(user => !notPermittedUsers.includes(user.id));
        
           const skip = (data.page - 1) * data.limit;
            const paginatedUsers = filteredUsers.slice(skip, skip + data.limit);
           const totalSkills = await this.ConnectionRepository.getTotalSkills(options);

           console.log(totalSkills)
           const plainUsers = paginatedUsers.map(user => user.toJSON());

           return { users: plainUsers, totalSkills };
           

        } catch (error) {
            console.log(error)
            if (error instanceof ClientError) {
                throw error;
            }
    
            throw new AppErrors("ServerError", "Something went wrong in service layer", "Logical issue occurred", 500, false);
      
        }
    }
}

module.exports = ConnectionService
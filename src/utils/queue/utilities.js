const axios = require("axios");
const {StatusCodes} = require("http-status-codes")
const connectDB = require("../connectDB")
const connectionRequestSchema = require("../../models/connectionSchema/connection");
const ClientError = require("../client-error");

const deleteAccount = async (email) => {
  try {
    console.log("hello world")
    const response = await axios.delete(`http://localhost:3010/authService/api/v1/deleteAccount?email=${email}`);
    
    if (!response.data.success) return false; 
    return true;

  } catch (error) {
    throw new ClientError({
      name: "INTERNAL_SERVER_ERROR",
      message: "Couldn't delete account",
      explanation: "Something went wrong.",
      statusCode: StatusCodes.BAD_REQUEST
    });
  }
};

const deleteConnections = async (id) => {
  
    try {
      await connectDB()
      console.log("Came till here:", id);
  
      if (!id) {
        console.error("Invalid ID:", id);
        throw new Error("ID is required.");
      }
  
      try {
        const result = await connectionRequestSchema.deleteMany({
          $or: [{ senderId: id }, { receiverId: id }]
        });
        console.log("Delete result:", result);
      } catch (mongoErr) {
        console.error("MongoDB error during deleteMany:", mongoErr);
        throw mongoErr;
      }
  
      return true;
    } catch (error) {
      throw new ClientError({
        name: "INTERNAL_SERVER_ERROR",
        message: "Couldn't delete connections",
        explanation: error.message,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR
      });
    }
  };
  
module.exports = {deleteAccount, deleteConnections};

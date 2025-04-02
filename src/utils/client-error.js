const { StatusCodes } = require("http-status-codes");
const AppErrors = require("./error-handler");

class ClientError extends AppErrors {
    constructor(error) {
        super(error.name, error.message, error.explanation, error.statusCode, error.success);
    }
}
module.exports = ClientError;
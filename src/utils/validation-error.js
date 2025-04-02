const { StatusCodes } = require("http-status-codes");
const AppErrors = require("./error-handler");

class ValidationError extends AppErrors {
    constructor(error) {
        let errName = error.name;
        let explanation = [];
        error.errors.forEach(err => {
            explanation.push(err.message)
        });
        
        super(errName, explanation, "Data Validation failure", StatusCodes.BAD_REQUEST, false );
    }
}
module.exports = ValidationError;
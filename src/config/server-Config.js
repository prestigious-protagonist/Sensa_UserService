require('dotenv').config()
module.exports = {
    PORT: process.env.PORT,
    MONGO_URL : process.env.MONGO_URL,
    EMAIL_ID: process.env.EMAIL_ID,
    EMAIL_PASS: process.env.EMAIL_PASS,
}
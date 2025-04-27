const express = require('express')
const bodyParser = require('body-parser')
const { sequelize } = require('./models')
const {PORT} = require('./config/server-Config')
const app = express()

const crypto = require('crypto');
global.crypto = crypto;

const {initProducer} = require("./utils/queue/producer")
const apiRouter = require('./routes/index')
const db = require("./models/index")
const connectDB = require('./config/db')
app.get('/', () => {
  console.log("User are hitting the User Service.")
})
const startServer = async() => {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))

    app.use('/userService/api', apiRouter)
    
    //await db.sequelize.sync({ alter: true });
    connectDB().then(() => {
        app.listen(3002, async() => {
          console.log(process.env.EMAIL_PASS)
          await initProducer()
          console.log("Server running on port : "+PORT);
      
          
        });
  });
}

startServer()
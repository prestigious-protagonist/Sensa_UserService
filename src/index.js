const express = require('express')
const bodyParser = require('body-parser')
const { sequelize } = require('./models')
const {PORT} = require('./config/server-Config')
const app = express()
const {initProducer} = require("./utils/queue/producer")
const apiRouter = require('./routes/index')
const connectDB = require('./config/db')

const startServer = () => {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))

    app.use('/userService/api', apiRouter)
    app.get('/', () => {
        console.log("User Service working")
    })
    connectDB().then(() => {
        app.listen(3002, async() => {
          console.log(process.env.EMAIL_PASS)
          await initProducer()
          console.log("Server running on port : "+PORT);
      
          
        });
  });
}

startServer()
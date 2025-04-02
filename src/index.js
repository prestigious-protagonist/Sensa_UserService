const express = require('express')
const bodyParser = require('body-parser')
const { sequelize } = require('./models')
const {PORT} = require('./config/server-Config')
const app = express()
const apiRouter = require('./routes/index')
const {userProfile, social, Skills} = require('./models/index')
const startServer = () => {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))

    app.use('/userService/api', apiRouter)
    app.get('/', () => {
        console.log("User Service working")
    })
    app.listen(PORT, async () => {
        //sequelize.sync({ alter: true });

    //    if(1) {
    //     sequelize.sync({alter:true})
    //    }
   
    
        console.log(`Listening on PORT ${PORT}`)
    })
}

startServer()
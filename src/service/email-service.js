const sender =  require('../config/email-config')
const sendBasicEmail = (mailFrom, mailTo, mailSubject, mailBody) => {
    console.log(mailFrom)
    console.log(mailTo)
    console.log(mailSubject)
    console.log(mailBody)
    
    sender.sendMail({
        from: mailFrom,
        to: mailTo,
        subject: mailSubject, 
        text: mailBody
    })
}

module.exports = sendBasicEmail

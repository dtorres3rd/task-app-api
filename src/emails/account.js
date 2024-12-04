const sgMail =  require('@sendgrid/mail')
const keys = require('../../config/keys');

const sendGridAPIKey = keys.sendGridAPIKey
sgMail.setApiKey(sendGridAPIKey)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'daniel.torres3rd@gmail.com',
        subject:'This is a welcome email from app via Sendgrind API',
        text:`Welcome to the app, ${name}.`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'daniel.torres3rd@gmail.com',
        subject:'This is a cancellation email from app via Sendgrind API',
        text:`We are sad to see you go ${name}.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}
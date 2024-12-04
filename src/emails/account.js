const keys = require('../../config/keys');
const { mailgunDomain, mailgunAPIKey, mailgunFromEmail } = keys;
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: mailgunAPIKey });

const sendWelcomeEmail = (email, name) => {
  mg.messages
    .create(mailgunDomain, {
      from: mailgunFromEmail,
      to: [email],
      subject: 'This is a welcome email from app via MailGun API',
      text: `Welcome to the app, ${name}.`,
    //   html: '<h1>Testing some Mailgun awesomness!</h1>',
    })
    .then((msg) => console.log(msg)) // logs response data
    .catch((err) => console.error(err)); // logs any error
};

const sendCancellationEmail = (email, name) => {
    mg.messages
      .create(mailgunDomain, {
        from: mailgunFromEmail,
        to: [email],
        subject: 'This is a cancellation email from app via MailGun API',
        text: `We are sad to see you go, ${name}.`,
        // html: '<h1>Testing some Mailgun awesomness!</h1>',
      })
      .then((msg) => console.log(msg)) // logs response data
      .catch((err) => console.error(err)); // logs any error
  };

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
};

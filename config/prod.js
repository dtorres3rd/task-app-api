module.exports= {
    PORT: process.env.PORT,
    MAINTENANCE_MODE: process.env.MAINTENANCE_MODE,
    JWT_SECRET: process.env.JWT_SECRET,
    mongoURI: process.env.MONGO_URI,
    mailgunAPIKey: process.env.MAILGUN_API_KEY,
    mailgunDomain: process.env.MAILGUN_DOMAIN,
    mailgunFromEmail: process.env.MAILGUN_FROM_EMAIL,
};

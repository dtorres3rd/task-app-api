** This md file will be updated occasionally ** 

** This is a side project Webservice API utilizing node.js, express.js written in modern javascript and mongodb as nosql database via mongoose library for utilizing model **

** Backend URL: **https://task-app-api-xxr2.onrender.com**, uses render's free instance types. **


to run locally:
 - clone the repo then run npm install
 - run in terminal: npm run dev
 - reach out via email for the dev keys inside config folder (daniel.torres3rd@gmail.com)

TODO:
 - Create web ui
 - implement testing via jest

Dev logs:
- mongodb hosted on MongoDB Atlas Free tier Database (mongodb.com)
- installed validator library for validating user input for mongoose model (reference for schema types: https://mongoosejs.com/docs/schematypes.html)
- used express.Router for routing endpoints to index.js
- used bcrypt for password hashing and saving to db for this side project as MVP. Note: will change this depending on future objectives for robust security
- implemented JWT (JSON Web Token) for login user session implementation (Authentication tokens)
- implemented multer library from npm for file uploads
- implemented sharp library from npm to resize or reformat uploaded images
- implemented email functionality (welcome email and cancellation email) via sendGrid
- inital deploy to render for production environment 




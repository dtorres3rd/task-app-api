const jwt = require('jsonwebtoken')
const User = require('../models/user')
const keys = require('../../config/keys');


const auth = async (req, res, next) => {
   try {
     const token = req.header('Authorization').replace('Bearer ', '')
     const decode = jwt.verify(token, keys.JWT_SECRET)
     // second parameter - tokens.token, means that the passed token must currently exist in user's token in mongo db to proceed
     const user = await User.findOne({ _id: decode._id, 'tokens.token': token }) 

     if (!user) {
        throw new Error()
     }

     req.token = token // current logged in user's token
     req.user = user // current logged in user
     next()
   } catch (error) {
        res.status(401).send({error: 'Please authenticate.'})
   }
}

module.exports = auth
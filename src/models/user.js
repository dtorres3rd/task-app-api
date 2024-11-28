const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number')
      }
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      //TODO
    }
  },
})

/*
- setup middleware for USER mongoose schema.
- execute this callback async function before saving.
- the this pointer inside the callback function is equivalent to the document being saved
*/

// this is a user creatd function "findByCredentials"
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error('Unable to login1') 
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch){
    throw new Error('Unable to login2') 
  }

  return user
}

// hash the plain text password before saving
userSchema.pre('save', async function (next) {
  const user = this

  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8)
  }

  // this is needed to confirm that this function is done, proceeding to the next logic - code
  next()
})

const User = mongoose.model('User', userSchema);

module.exports = User
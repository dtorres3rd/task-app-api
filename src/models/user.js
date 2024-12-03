const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task.js')

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
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
}, {
  timestamps: true
})

/* This is a virtual property used by mongoose, usually used for relationship between collections. 
In this case, task and user */

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})


/*
  userSchema.methods vs userSchema.statics: methods is for individual instance of User Model
  statics is for methods implemented for Models itself, in this case, User Model.
*/

/*
- setup middleware for USER mongoose schema.
- execute this callback async function before saving.
- the this pointer inside the callback function is equivalent to the document being saved
*/

// we will not use arrow function to use "this" binding
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'placeholdersecret');

  user.tokens = user.tokens.concat({ token: token });
  await user.save()

  return token;
};

/* 
.toJSON method notes:
- every object comes with a .toJSON method
- when we run our code res.send(obj), it will automatically run JSON.stringify(obj), 
which in turns uses obj.toJSON() to convert it into JSON, but as we have customised the method, 
it will also remove the password and tokens.
- We can override (overwrite / replace) this in-built .toJSON method with our own custom method to behave the way we want. 
In our app, this means to delete the password and tokens properties. */
userSchema.methods.toJSON = function () {
  const user = this

  //convert using toObject() (mongoose method) so that we can manipulate the object properties
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}

// this is a user creatd function "findByCredentials"
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error('Unable to login') 
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch){
    throw new Error('Unable to login') 
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

/* Delete tasks when related user is removed/deleted
this is also exclusive from mongoose middleware function */
userSchema.pre('deleteOne', { document: true }, async function(next) {
  const user = this
  await Task.deleteMany({ owner: user._id })
  next()
})

const User = mongoose.model('User', userSchema);

module.exports = User
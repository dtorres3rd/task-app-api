// initialize

const keys = require('../../config/keys');
const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect(keys.mongoURI);

const User = mongoose.model('User', {
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
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    }
  },
});

const Task = mongoose.model('Task', {
  description: {
    type: String,
  },
  completed: {
    type: Boolean,
  },
});

// const task = new Task({
//   description: 'Practise the mongoose library',
//   completed: true,
// });

// task.save()
//   .then(() => {
//     console.log(task);
//   })
//   .catch((error) => {
//     console.log('Error!', error);
//   });


const user = new User({
  name: 'Daniel',
  age: 33,
  email: 'daniel.torres3rd@gmail.com'
});

user.save()
  .then(() => {
    console.log(user);
  })
  .catch((error) => {
    console.log('Error!', error);
  });

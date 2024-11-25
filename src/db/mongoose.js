// initialize database connection

const keys = require('../../config/keys');
const mongoose = require('mongoose');

mongoose.connect(keys.mongoURI);

const Task = mongoose.model('Task', {
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
});

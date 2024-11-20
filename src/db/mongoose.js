// initialize

const keys = require('../../config/keys');
const mongoose = require('mongoose');

mongoose.connect(keys.mongoURI);

const Task = mongoose.model('Task', {
  description: {
    type: String,
  },
  completed: {
    type: Boolean,
  },
});

const task = new Task({
  description: 'Practise the mongoose library',
  completed: true,
});

task.save()
  .then(() => {
    console.log(task);
  })
  .catch((error) => {
    console.log('Error!', error);
  });

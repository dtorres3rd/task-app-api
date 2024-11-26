const express = require('express');
//ensure mongoose database will run upon loading
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')


const app = express();
const port = process.env.PORT || 3000;

//automatically parse incoming JSON to object, so it can be accessed in request handler
app.use(express.json());

app.post('/users', (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then(() => {
      res.status(201).send(user);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

app.post('/tasks', (req, res) => {
  const task = new Task(req.body);

  task
    .save()
    .then(() => {
      res.status(201).send(task);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});


app.listen(port, () => {
    console.log('Server is up on port ' + port);
})
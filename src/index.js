const express = require('express');
const keys = require('../config/keys');
//ensure mongoose database will run upon loading
require('./db/mongoose');

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();
const { PORT, MAINTENANCE_MODE } = keys;

/* TODO: Set a maintenance mode in environment var to act as a toggle for maintenance mode */
if (MAINTENANCE_MODE) {
  app.use((req, res) => {
    // console.log(req.method, req.path)
    res.status(503).send('Site is in maintenance mode, Check back soon.');
  });
}

app.get('/healthcheck', (req, res) => {
  res.send({'status': 'ok'})
})

//automatically parse incoming JSON to object, so it can be accessed in request handler
app.use(express.json());

//wire up routes
app.use(userRouter);
app.use(taskRouter);


app.listen(PORT, () => {
  console.log('Server is up on port ' + PORT);
});

const jwt = require('jsonwebtoken')

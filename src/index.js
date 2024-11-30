const express = require('express');
//ensure mongoose database will run upon loading
require('./db/mongoose');

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();
const port = process.env.PORT || 3000;
const maintenance_mode = process.env.MAINTENANCE_MODE || false;

/* TODO: Set a maintenance mode in environment var to act as a toggle for maintenance mode */
if (maintenance_mode) {
  app.use((req, res) => {
    // console.log(req.method, req.path)
    res.status(503).send('Site is in maintenance mode, Check back soon.');
  });
}

//authentication
// app.use((req, res, next) => {
//   // console.log(req.method, req.path)
//   // if (req.method === 'GET'){
//   //   next()
//   // }

//   res.status(503).send('Site is in maintenance mode, Check back soon.')
// })

//automatically parse incoming JSON to object, so it can be accessed in request handler
app.use(express.json());

//wire up routes
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
  console.log('Server is up on port ' + port);
});

const jwt = require('jsonwebtoken')

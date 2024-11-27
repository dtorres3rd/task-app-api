const express = require('express');
//ensure mongoose database will run upon loading
require('./db/mongoose');

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();
const port = process.env.PORT || 3000;

//automatically parse incoming JSON to object, so it can be accessed in request handler
app.use(express.json());

//wire up routes
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
  console.log('Server is up on port ' + port);
});

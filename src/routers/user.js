const express = require('express');
const User = require('../models/user')
const router = new express.Router();

router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save(); // equivalent to mongoose.model('User', {*field properties*}).send()
    const token = await user.generateAuthToken()
    res.status(200).send({ user: user, token: token});
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/users/login', async (req,res) => {
  const {email, password} = req.body

  try {
    const user = await User.findByCredentials(email, password)
    const token = await user.generateAuthToken()
    res.send({ user: user, token: token})
  } catch (e) {
    res.status(400).send()
  }
})

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/users/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch('/users/:id', async (req, res) => {
  const _id = req.params.id;
  const body = req.body;

  // simple error handling
  const allowedUpdates = ['name', 'password', 'email', 'age'];

  const updates = Object.keys(body); // converts every KEY in the JSON request body to array of strings
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' });
  }

  try {

    
    // const user = await User.findByIdAndUpdate(_id, body, {
    //   new: true,
    //   runValidators: true,
    // });

    const user = await User.findById(_id)

    updates.forEach((update) => {
      user[update] = body[update]
    })

    await user.save()

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/users/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findByIdAndDelete(_id);

    if (!user) {
      res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.send(500).send(e);
  }
});

module.exports = router;

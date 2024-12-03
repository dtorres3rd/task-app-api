const express = require('express');
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router();

router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save(); // equivalent to mongoose.model('User', {*field properties*}).send()
    const token = await user.generateAuthToken()
    res.status(201).send({ user: user, token: token});
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
    res.status(400).send('Invalid login credentials')
  }
})

router.post('/users/logout', auth, async (req, res) => {
  try {
    /* LOGIC: filter the current user's token from user's saved token array in mongodb 
    and remove that from the array for it to be invalidated, then save then new user's document/record to mongodb */
    req.user.tokens = req.user.tokens.filter((currentUserTokenArrFromDb) => {
      return currentUserTokenArrFromDb.token !== req.token
    })
    // this is using USER model of mongoose
    await req.user.save()

    res.send()
  } catch (e) {
    res.status(500).send()
  }
});

router.post('/users/logoutall', auth, async (req, res) => {
  try {
    /* LOGIC: wipeout all token session for current user  */
    req.user.tokens = []

    // this is using USER model of mongoose
    await req.user.save()

    res.send()
  } catch (e) {
    res.status(500).send()
  }
});

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

// router.get('/users/:id', async (req, res) => {
//   const _id = req.params.id;

//   try {
//     const user = await User.findById(_id);
//     if (!user) {
//       return res.status(404).send();
//     }
//     res.status(200).send(user);
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });

router.patch('/users/me', auth, async (req, res) => {
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

    // const user = await User.findById(_id)

    updates.forEach((update) => {
      req.user[update] = body[update]
    })

    await req.user.save()
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/users/me', auth, async (req, res) => {

  try {
    await req.user.deleteOne()
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;

const express = require('express');
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')
const router = new express.Router();

router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save(); // equivalent to mongoose.model('User', {*field properties*}).send()
    sendWelcomeEmail(user.email, user.name)
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

/* this endpoint is for admin use, maybe implemented in the future */
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
    sendCancellationEmail(req.user.email, req.user.name)
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

const upload = multer({
  // commenting this out so that image will not be saved to filesystem, instead be accessible to route handler
  // dest: 'avatars', 
  limits: {
    fileSize: 1000000, // 1m bytes = 1 mb
  },
  fileFilter(req, file, callback) {
    // if (!file.originalname.endsWith('.pdf')) {
    //   return callback(new Error('Please upload a PDF'));
    // }

    //alternatively, regex can alse be used for validating upload file
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error('Please upload an image'));
    }

    // this means the uploaded file passed the fileFilter
    callback(undefined, true)
  },
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();

  req.user.avatar = buffer;
  await req.user.save();
  res.send({ message: 'Avatar uploaded successfully' });
  },
  // this callback is for handling unexpected errors
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user || !user.avatar) {
      throw new Error()
    }

      res.set('Content-Type', 'image/png')
      res.send(user.avatar)
  } catch (e) {
    res.status(404).send(e)
  }
})

router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send({ message: 'Avatar deleted' });
});



module.exports = router;

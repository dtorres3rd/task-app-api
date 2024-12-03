const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth')
const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ... req.body,
    owner: req.user._id
  })

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

/*
  In this endpoint, pagination and sorting is applied. Refer to sample below
sample: url/tasks?completed=false&
sample: url/tasks?limit=3&skip=0
sample: url/tasks?sortBy=createdAt:desc
*/
router.get('/tasks', auth, async (req, res) => {
  const match = {}
  const sort = {}

  if (req.query.completed){
    match.completed = req.query.completed === 'true'
  }

  if (req.query.sortBy){
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
    await req.user.populate({
      path: 'tasks',
      match: match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort:{
          createdAt: -1
        }
      }
    })
    res.send(req.user.tasks)
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {

    const task = await Task.findOne({ _id, owner: req.user._id })

    if (!task){
      return res.status(404).send('Record not found')
    }

    res.status(200).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;
  const body = req.body;

  // simple error handling
  const allowedUpdates = ['description', 'completed'];
  const updates = Object.keys(body); // converts every KEY in the JSON request body to array of strings
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' });
  }

  try {
    // const task = await Task.findByIdAndUpdate(_id, body, {
    //   new: true,
    //   runValidators: true,
    // });

    const task = await Task.findOne({
      _id: _id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => {
      // used bracket notation to get field dynamically, not binding to a specific property name
      task[update] = body[update]
    })

    await task.save()

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOneAndDelete({ _id: _id, owner: req.user._id });

    if (!task) {
      res.status(404).send('Record not found');
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;

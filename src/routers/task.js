const express = require('express');
const Task = require('../models/task');
const router = new express.Router();

router.post('/tasks', async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(200).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch (error) {
    res.status(400).send(e);
  }
});

router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id);
    res.status(200).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/tasks/:id', async (req, res) => {
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

    const task = await Task.findById(_id)

    updates.forEach((update) => {
      // used bracket notation to get field dynamically, not binding to a specific property name
      task[update] = body[update]
    })

    await task.save()

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/tasks/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findByIdAndDelete(_id);

    if (!task) {
      res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
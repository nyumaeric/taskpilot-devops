const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

router.get('/', async (req, res) => res.json(await Task.find()));
router.post('/', async (req, res) => res.status(201).json(await Task.create(req.body)));
router.put('/:id', async (req, res) => res.json(await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;

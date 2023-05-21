const express = require('express');
const router = express.Router();
const Thought = require('../models/Thought');
const User = require('../models/User');

// POST to create a new thought
router.post('/', async (req, res) => {
    if (!req.body.thoughtText || !req.body.username || !req.body.userId) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    try {
        const newThought = new Thought(req.body);
        const savedThought = await newThought.save();

        await User.findByIdAndUpdate(req.body.userId, { $push: { thoughts: savedThought._id } }, { new: true });

        res.status(201).json(savedThought.toObject());
    } catch (err) {
        res.status(500).json(err);
    }
});

// PUT to update a thought by its _id
router.put('/:id', async (req, res) => {
    try {
        const updatedThought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedThought) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(updatedThought.toObject());
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
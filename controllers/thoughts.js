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
        const savedThought = await Thought.create(req.body);
        await User.findByIdAndUpdate(req.body.userId, { $push: { thoughts: savedThought._id } }, { new: true });

        res.status(201).json(savedThought);
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
        res.json(updatedThought);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET all thoughts
router.get('/', async (req, res) => {
    try {
        const thoughts = await Thought.find({});
        res.status(200).json(thoughts);
    } catch (err) {
        res.status(500).json(err);
    }
});


// GET a single thought by its _id
router.get('/:id', async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.id);
        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
});


// get: createdAtVal => dateFormat(createdAtVal)


module.exports = router;
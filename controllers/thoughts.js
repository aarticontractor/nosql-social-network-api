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



module.exports = router;
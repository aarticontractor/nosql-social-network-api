const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Thought = require('../models/Thought');

// POST a new user
router.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;
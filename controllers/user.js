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

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET a single user by its _id and populated thought and friend data
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('thoughts').populate('friends');
        if (!user) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

// POST API to add a new friend to a user's friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friend = await User.findById(req.params.friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }

        if (user.friends.includes(req.params.friendId) || friend.friends.includes(req.params.userId)) {
            return res.status(400).json({ message: 'This friend is already added!' });
        }

        user.friends.push(req.params.friendId);
        friend.friends.push(req.params.userId);
        await user.save();
        await friend.save();

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE to remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friend = await User.findById(req.params.friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }

        if (!user.friends.includes(req.params.friendId) || !friend.friends.includes(req.params.userId)) {
            return res.status(400).json({ message: 'This friend is not present in the friend list!' });
        }

        user.friends.remove(req.params.friendId);
        friend.friends.remove(req.params.userId);
        await user.save();
        await friend.save();

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const {Thought, User} = require('../models');

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
        const users = await User.find({}).populate('thoughts').populate('friends');
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

// PUT to update a user by its _id
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'No User found with this id!' });
        }
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Deleting a USER and its associated thoughts-BONUS POINT
router.delete('/:userId', async (req, res) => {

try {
    const targetedUser = await User.findByIdAndDelete(req.params.userId)
    //    if (!targetedUser) {
    //     return res.status(404).json({ message: 'No user found with this id!' });
    //    }
    //    else {
    //      await Thought.deleteMany({ _id: { $in: targetedUser.thoughts } })
    //      res.status(200).json(targetedUser);
    //    }



    //We can also do the same thing as above using ternary operators
    !targetedUser 
    ? res.status(404).json({ message: 'No user found with this id!' })
    : await Thought.deleteMany({ _id: { $in: targetedUser.thoughts } })
      res.status(200).json(targetedUser);
       
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
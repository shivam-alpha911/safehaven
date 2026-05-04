const express = require('express');
const router = express.Router();
const Advice = require('../models/Advice');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');

// POST /api/advice/:postId — add advice to a post
router.post('/:postId', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 5) {
      return res.status(400).json({ message: 'Advice must be at least 5 characters.' });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    const advice = await Advice.create({
      postId: req.params.postId,
      userId: req.user.id,
      text: text.trim(),
    });

    await advice.populate('userId', 'name');

    res.status(201).json({
      _id: advice._id,
      text: advice.text,
      author: { name: advice.userId.name },
      upvoteCount: 0,
      upvotes: [],
      createdAt: advice.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit advice.' });
  }
});

// PUT /api/advice/:adviceId/upvote — toggle upvote
router.put('/:adviceId/upvote', authMiddleware, async (req, res) => {
  try {
    const advice = await Advice.findById(req.params.adviceId);
    if (!advice) return res.status(404).json({ message: 'Advice not found.' });

    const userId = req.user.id;
    const hasUpvoted = advice.upvotes.some((id) => id.toString() === userId);

    if (hasUpvoted) {
      advice.upvotes = advice.upvotes.filter((id) => id.toString() !== userId);
    } else {
      advice.upvotes.push(userId);
    }

    await advice.save();

    res.json({
      _id: advice._id,
      upvoteCount: advice.upvotes.length,
      upvotes: advice.upvotes,
      hasUpvoted: !hasUpvoted,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update upvote.' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Advice = require('../models/Advice');
const authMiddleware = require('../middleware/auth');

// GET /api/posts — fetch all posts, sorted newest first
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name');

    const adviceCounts = await Advice.aggregate([
      { $group: { _id: '$postId', count: { $sum: 1 } } },
    ]);
    const countMap = {};
    adviceCounts.forEach((a) => { countMap[a._id.toString()] = a.count; });

    const result = posts.map((post) => ({
      _id: post._id,
      title: post.title,
      description: post.description,
      isAnonymous: post.isAnonymous,
      author: post.isAnonymous
        ? { name: `Anonymous`, isAnonymous: true }
        : { name: post.userId?.name || 'Unknown', isAnonymous: false },
      adviceCount: countMap[post._id.toString()] || 0,
      createdAt: post.createdAt,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts.' });
  }
});

// GET /api/posts/:id — get single post + advice
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('userId', 'name');
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    const advices = await Advice.find({ postId: post._id })
      .sort({ upvotes: -1, createdAt: -1 })
      .populate('userId', 'name');

    const formattedAdvices = advices.map((a) => ({
      _id: a._id,
      text: a.text,
      author: { name: a.userId?.name || 'Unknown' },
      upvoteCount: a.upvotes.length,
      upvotes: a.upvotes,
      createdAt: a.createdAt,
    }));

    res.json({
      _id: post._id,
      title: post.title,
      description: post.description,
      isAnonymous: post.isAnonymous,
      author: post.isAnonymous
        ? { name: 'Anonymous', isAnonymous: true }
        : { name: post.userId?.name || 'Unknown', isAnonymous: false },
      createdAt: post.createdAt,
      advices: formattedAdvices,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch post.' });
  }
});

// POST /api/posts — create a post (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, isAnonymous } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const post = await Post.create({
      userId: req.user.id,
      title,
      description,
      isAnonymous: !!isAnonymous,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create post.' });
  }
});

// DELETE /api/posts/:id — delete own post (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post.' });
    }
    await post.deleteOne();
    await Advice.deleteMany({ postId: post._id });
    res.json({ message: 'Post deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete post.' });
  }
});

module.exports = router;

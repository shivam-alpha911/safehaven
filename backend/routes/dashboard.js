const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Advice = require('../models/Advice');
const authMiddleware = require('../middleware/auth');

// GET /api/dashboard — current user's posts and advice
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const myPosts = await Post.find({ userId }).sort({ createdAt: -1 });

    const postIds = myPosts.map((p) => p._id);
    const adviceCountsRaw = await Advice.aggregate([
      { $match: { postId: { $in: postIds } } },
      { $group: { _id: '$postId', count: { $sum: 1 } } },
    ]);
    const countMap = {};
    adviceCountsRaw.forEach((a) => { countMap[a._id.toString()] = a.count; });

    const postsWithCounts = myPosts.map((p) => ({
      _id: p._id,
      title: p.title,
      description: p.description,
      isAnonymous: p.isAnonymous,
      adviceCount: countMap[p._id.toString()] || 0,
      createdAt: p.createdAt,
    }));

    const myAdvice = await Advice.find({ userId })
      .sort({ createdAt: -1 })
      .populate('postId', 'title isAnonymous');

    const formattedAdvice = myAdvice.map((a) => ({
      _id: a._id,
      text: a.text,
      upvoteCount: a.upvotes.length,
      createdAt: a.createdAt,
      post: {
        _id: a.postId?._id,
        title: a.postId?.title || 'Deleted Post',
      },
    }));

    res.json({
      posts: postsWithCounts,
      advice: formattedAdvice,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dashboard data.' });
  }
});

module.exports = router;

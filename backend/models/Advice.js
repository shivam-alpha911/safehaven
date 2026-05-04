const mongoose = require('mongoose');

const adviceSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: [true, 'Advice text is required'],
      trim: true,
      minlength: 5,
      maxlength: 1000,
    },
    upvotes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Advice', adviceSchema);

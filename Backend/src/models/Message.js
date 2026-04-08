const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    room: {
      type: String,
      default: 'community',
      index: true,
    },
  },
  { timestamps: true }
);

// Index for efficient history queries (room + newest first)
messageSchema.index({ room: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;

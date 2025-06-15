import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    friendId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    text: {
      type: String,
      default: '',
    },
    files: {
      type: [String], // optional: Array of file URLs or filenames
      default: [],
    },
  },
  { timestamps: true }
);

const message = mongoose.model('messages', messageSchema);
export default message;

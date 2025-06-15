import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "messages",
      },
    ],
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

const conversation = mongoose.model("conversation", conversationSchema);
export default conversation;

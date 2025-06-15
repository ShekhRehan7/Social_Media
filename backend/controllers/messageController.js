import conversationCollection from "../models/Conversastion.js";
import messageCollection from "../models/MessageCollection.js";

const sendMessage = async (req, res) => {
  try {
    const { _id } = req.user;
    const { friendId } = req.params;
    const { text, files } = req.body;

    // ✅ Use create instead of insertOne
    let message = await messageCollection.create({
      userId: _id,
      friendId,
      text,
      files,
    });

    // Find or create conversation
    let conversation = await conversationCollection.findOne({
      members: { $all: [_id, friendId] },
    });

    if (!conversation) {
      conversation = await conversationCollection.create({
        members: [_id, friendId],
        messages: [],
      });
    }

    // Push new message into conversation
    conversation.messages.push(message._id);
    await conversation.save();

    // ✅ Return the created message
    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMessage = async (req, res) => {
  const { _id } = req.user;
  const { friendId } = req.params;

  let messages = await conversationCollection
    .findOne({ members: { $all: [_id, friendId] } })
    .populate({
      path: "members",
      select: "-password -resetPasswordToken -resetPasswordTokenExpires",
    })
    .populate({ path: "messages" });

  res.status(200).json(messages);
};

const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await messageCollection.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    await message.deleteOne();

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export { sendMessage, getMessage, deleteMessage };

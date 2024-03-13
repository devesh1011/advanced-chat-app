const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    sender_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    receiver_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = User;

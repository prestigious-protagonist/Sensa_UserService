const mongoose = require("mongoose");

const userInfoSchema = new mongoose.Schema(
  {
    id: String,
    username: String,
    email: String,
    profilePicture: String,
    gender: String,
    bio: String,
    experience: Number,
    age: Number,
  },
  { _id: false } // Disable _id for embedded docs
);

const connectionRequestSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["accepted", "rejected", "ignored", "interested"],
        message: `{VALUE} is incorrect status type`,
      },
    },
    senderInfo: {
      type: userInfoSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });
connectionRequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

module.exports =
  mongoose.models.ConnectionRequest ||
  mongoose.model("ConnectionRequest", connectionRequestSchema);

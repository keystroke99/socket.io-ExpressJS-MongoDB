const mongoose = require("mongoose");
var NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, Ref: "User" },
    title: String,
    body: String,
    status: { type: String, enum: ["unread", "read"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", NotificationSchema);

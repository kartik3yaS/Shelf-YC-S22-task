const mongoose = require("mongoose");

const borrowRequestSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    seekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
    message: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    isViewed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Add indexes for better performance
borrowRequestSchema.index({ bookId: 1, seekerId: 1, status: 1 });
borrowRequestSchema.index({ ownerId: 1, status: 1 });

const BorrowRequest = mongoose.model("BorrowRequest", borrowRequestSchema);

module.exports = BorrowRequest;

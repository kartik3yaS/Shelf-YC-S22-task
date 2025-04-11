const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a book title"],
    trim: true,
  },
  author: {
    type: String,
    required: [true, "Please provide the author name"],
    trim: true,
  },
  genre: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    required: [true, "Please provide a location"],
    trim: true,
  },
  contactInfo: {
    type: String,
    required: [true, "Please provide contact information"],
    trim: true,
  },
  coverImage: {
    type: String,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "rented", "exchanged"],
    default: "available",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add text indexes for search functionality
bookSchema.index({ title: "text", author: "text", genre: "text" });
bookSchema.index({ location: 1 });
bookSchema.index({ ownerId: 1 });
bookSchema.index({ status: 1 });

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;

const Book = require("../models/Book");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

// @desc    Create a new book listing
// @route   POST /api/books
// @access  Private (Owner only)
exports.createBook = async (req, res) => {
  try {
    const { title, author, genre, location, contactInfo } = req.body;
    const ownerId = req.user._id;

    // Verify user is a book owner
    if (req.user.role !== "owner") {
      return res
        .status(403)
        .json({ message: "Only book owners can create listings" });
    }

    // Handle file upload
    let coverImageUrl = undefined;
    if (req.file) {
      coverImageUrl = `https://shelf-yc-s22-task-production.up.railway.app/uploads/${req.file.filename}`;
    }

    // Create new book
    const book = await Book.create({
      title,
      author,
      genre,
      location,
      contactInfo,
      ownerId,
      coverImage: coverImageUrl,
    });

    res.status(201).json(book);
  } catch (error) {
    console.error("Create book error:", error);
    res.status(500).json({ message: "Server error while creating book" });
  }
};

// @desc    Update book details
// @route   PUT /api/books/:id
// @access  Private (Owner only)
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre, location, contactInfo } = req.body;

    // Find book by ID
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if user is the owner
    if (book.ownerId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this book" });
    }

    // Update fields
    if (title) book.title = title;
    if (author) book.author = author;
    if (genre) book.genre = genre;
    if (location) book.location = location;
    if (contactInfo) book.contactInfo = contactInfo;

    await book.save();

    res.json({ message: "Book updated successfully", book });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all books with optional filtering
// @route   GET /api/books
// @access  Public
exports.getAllBooks = async (req, res) => {
  try {
    const { title, author, genre, location, status } = req.query;

    // Build query
    const query = {};

    if (title) {
      query.$text = { $search: title };
    }
    if (author) {
      query.author = { $regex: author, $options: "i" };
    }
    if (genre) {
      query.genre = genre;
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (status) {
      query.status = status;
    }

    const books = await Book.find(query).populate("ownerId", "name email");
    res.json(books);
  } catch (error) {
    console.error("Get all books error:", error);
    res.status(500).json({ message: "Server error while fetching books" });
  }
};

// @desc    Get books by owner
// @route   GET /api/books/owner/:ownerId
// @access  Private
exports.getBooksByOwner = async (req, res) => {
  try {
    const books = await Book.find({ ownerId: req.params.ownerId });
    res.json(books);
  } catch (error) {
    console.error("Get books by owner error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching owner's books" });
  }
};

// @desc    Get a single book by ID
// @route   GET /api/books/:id
// @access  Public
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "ownerId",
      "name email"
    );
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    console.error("Get book by ID error:", error);
    res.status(500).json({ message: "Server error while fetching book" });
  }
};

// @desc    Update book status
// @route   PATCH /api/books/:id/status
// @access  Private
exports.updateBookStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Verify user is the owner
    if (book.ownerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this book" });
    }

    book.status = status;
    await book.save();

    res.json(book);
  } catch (error) {
    console.error("Update book status error:", error);
    res
      .status(500)
      .json({ message: "Server error while updating book status" });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private
exports.updateBook = async (req, res) => {
  try {
    const { title, author, genre, location, contactInfo } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Verify user is the owner
    if (book.ownerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this book" });
    }

    // Handle file upload if new image is provided
    if (req.file) {
      // Delete old image if exists
      if (book.coverImage) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "public",
          book.coverImage
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      // Store the relative path to the new image
      book.coverImage = `/uploads/${req.file.filename}`;
    }

    // Update book fields
    book.title = title || book.title;
    book.author = author || book.author;
    book.genre = genre || book.genre;
    book.location = location || book.location;
    book.contactInfo = contactInfo || book.contactInfo;

    await book.save();
    res.json(book);
  } catch (error) {
    console.error("Update book error:", error);
    res.status(500).json({ message: "Server error while updating book" });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Verify user is the owner
    if (book.ownerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this book" });
    }

    // Delete the book's cover image if it exists
    if (book.coverImage) {
      const imagePath = path.join(__dirname, "..", book.coverImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete the book from database
    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: "Book removed successfully" });
  } catch (error) {
    console.error("Delete book error:", error);
    res.status(500).json({ message: "Server error while deleting book" });
  }
};

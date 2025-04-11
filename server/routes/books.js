const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const { updateBook } = require("../controllers/bookController");
const auth = require("../middleware/auth");
const upload = require("../config/multer");

// @route   GET /api/books
router.get("/", bookController.getAllBooks);

// @route   POST /api/books
// Add multer middleware for handling file uploads
router.post("/", auth, upload.single("coverImage"), bookController.createBook);

// @route   GET /api/books/owner/:ownerId
router.get("/owner/:ownerId", auth, bookController.getBooksByOwner);

// @route   GET /api/books/:id
router.get("/:id", bookController.getBookById);

// Update a book
router.put("/:id", auth, updateBook);

// @route   PATCH /api/books/:id/status
router.patch("/:id/status", auth, bookController.updateBookStatus);

// @route   PUT /api/books/:id
router.put(
  "/:id",
  auth,
  upload.single("coverImage"),
  bookController.updateBook
);

// @route   DELETE /api/books/:id
router.delete("/:id", auth, bookController.deleteBook);

module.exports = router;

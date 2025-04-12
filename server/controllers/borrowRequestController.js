const BorrowRequest = require("../models/BorrowRequest");
const Book = require("../models/Book");
const User = require("../models/User");

// Create a new borrow request
exports.createRequest = async (req, res) => {
  try {
    const { bookId, message } = req.body;
    const seekerId = req.user.id;

    // Find the book to get the owner's ID
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if book is available
    if (book.status !== "available") {
      return res
        .status(400)
        .json({ message: "This book is not available for borrowing" });
    }

    // Check if user is trying to borrow their own book
    if (book.ownerId.toString() === seekerId) {
      return res
        .status(400)
        .json({ message: "You cannot borrow your own book" });
    }

    // Check if there's already a pending request for this book from this user
    const existingRequest = await BorrowRequest.findOne({
      bookId,
      seekerId,
      status: "pending",
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "You already have a pending request for this book" });
    }

    // Create new borrow request
    const borrowRequest = new BorrowRequest({
      bookId,
      seekerId,
      ownerId: book.ownerId,
      message: message || "",
      status: "pending",
    });

    await borrowRequest.save();

    res.status(201).json({
      message: "Borrow request sent successfully",
      requestId: borrowRequest._id,
    });
  } catch (error) {
    console.error("Error creating borrow request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all requests for a book owner
exports.getOwnerRequests = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Find all requests where the current user is the owner
    const requests = await BorrowRequest.find({ ownerId })
      .populate("bookId", "title author")
      .populate("seekerId", "name email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error("Error getting owner requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all requests made by a seeker
exports.getSeekerRequests = async (req, res) => {
  try {
    const seekerId = req.user.id;

    // Find all requests where the current user is the seeker
    const requests = await BorrowRequest.find({ seekerId })
      .populate("bookId", "title author")
      .populate("ownerId", "name")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error("Error getting seeker requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update request status (accept or reject)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    const ownerId = req.user.id;

    // Validate status
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    // Find the request
    const request = await BorrowRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Check if user is the owner
    if (request.ownerId.toString() !== ownerId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this request" });
    }

    // Check if the request is still pending
    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: `Request is already ${request.status}` });
    }

    // Update request status
    request.status = status;
    request.updatedAt = Date.now();
    await request.save();

    // If request is accepted, update the book status to 'rented'
    if (status === "accepted") {
      await Book.findByIdAndUpdate(request.bookId, { status: "rented" });
    }

    res.json({
      message: `Request ${status} successfully`,
      request,
    });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get contact information after acceptance
exports.getContactInformation = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    // Find the request
    const request = await BorrowRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Check if user is either the owner or seeker of this request
    if (
      request.ownerId.toString() !== userId &&
      request.seekerId.toString() !== userId
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this information" });
    }

    // Check if request is accepted
    if (request.status !== "accepted") {
      return res.status(400).json({
        message: "Contact information is only available for accepted requests",
      });
    }

    // Determine which contact information to get
    const contactUserId =
      userId === request.ownerId.toString()
        ? request.seekerId
        : request.ownerId;

    // Get contact information
    const contactUser = await User.findById(contactUserId).select(
      "name email mobile"
    );

    // Get book information
    const book = await Book.findById(request.bookId).select("title author");

    res.json({
      contactInfo: contactUser,
      book,
    });
  } catch (error) {
    console.error("Error getting contact information:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.completeRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { bookStatus } = req.body; // Get book status from request body
    const ownerId = req.user.id;

    // Find the request
    const request = await BorrowRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Check if user is the owner
    if (request.ownerId.toString() !== ownerId) {
      return res
        .status(403)
        .json({ message: "Not authorized to complete this request" });
    }

    // Check if the request is accepted
    if (request.status !== "accepted") {
      return res
        .status(400)
        .json({ message: "Only accepted requests can be completed" });
    }

    // Update request status to completed
    request.status = "completed";
    request.updatedAt = Date.now();
    await request.save();

    // Use the provided bookStatus or default to 'available' if not specified
    const finalBookStatus = bookStatus || "available";

    // Validate the book status value
    if (!["available", "rented", "exchanged"].includes(finalBookStatus)) {
      return res.status(400).json({ message: "Invalid book status" });
    }

    // Update the book status based on provided status
    await Book.findByIdAndUpdate(request.bookId, { status: finalBookStatus });

    res.json({
      message: "Request marked as completed",
      request,
      bookStatus: finalBookStatus,
    });
  } catch (error) {
    console.error("Error completing request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

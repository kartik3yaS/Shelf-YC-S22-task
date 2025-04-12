const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const borrowRequestController = require("../controllers/borrowRequestController");

// Create a borrow request
router.post("/", auth, borrowRequestController.createRequest);

// Get requests for a book owner
router.get("/owner", auth, borrowRequestController.getOwnerRequests);

// Get requests made by a seeker
router.get("/seeker", auth, borrowRequestController.getSeekerRequests);

// Update request status (accept/reject)
router.patch(
  "/:requestId/status",
  auth,
  borrowRequestController.updateRequestStatus
);

// Get contact information after acceptance
router.get(
  "/:requestId/contact",
  auth,
  borrowRequestController.getContactInformation
);

// Mark request as completed
router.patch(
  "/:requestId/complete",
  auth,
  borrowRequestController.completeRequest
);

module.exports = router;

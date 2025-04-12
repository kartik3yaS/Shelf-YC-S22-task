import React, { useState, useEffect } from "react";
import borrowRequestService from "../../services/borrowRequestService";
import "./BorrowRequests.css";

const BorrowRequestsList = ({ onStatusChange }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completingRequestId, setCompletingRequestId] = useState(null);

  useEffect(() => {
    fetchOwnerRequests();
  }, []);

  const fetchOwnerRequests = async () => {
    try {
      setLoading(true);
      const data = await borrowRequestService.getOwnerRequests();
      setRequests(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
      setError("Failed to load requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await borrowRequestService.updateRequestStatus(requestId, "accepted");

      // Update the local state
      setRequests(
        requests.map((req) =>
          req._id === requestId ? { ...req, status: "accepted" } : req
        )
      );

      // Call the parent component's status change handler if provided
      if (onStatusChange) onStatusChange();

      // Fetch contact information
      await fetchContactInfo(requestId);
    } catch (err) {
      console.error("Failed to accept request:", err);
      setError("Failed to accept request. Please try again.");
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await borrowRequestService.updateRequestStatus(requestId, "rejected");

      // Update the local state
      setRequests(
        requests.map((req) =>
          req._id === requestId ? { ...req, status: "rejected" } : req
        )
      );

      // Call the parent component's status change handler if provided
      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error("Failed to reject request:", err);
      setError("Failed to reject request. Please try again.");
    }
  };

  // Now just shows the modal instead of completing directly
  const handleCompleteRequest = (requestId) => {
    setCompletingRequestId(requestId);
    setShowCompleteModal(true);
  };

  // New function to actually complete the request with the selected status
  const finalizeCompletion = async (bookStatus) => {
    try {
      await borrowRequestService.completeRequest(
        completingRequestId,
        bookStatus
      );

      // Update the local state
      setRequests(
        requests.map((req) =>
          req._id === completingRequestId
            ? { ...req, status: "completed" }
            : req
        )
      );

      // Hide the modal
      setShowCompleteModal(false);
      setCompletingRequestId(null);

      // Call the parent component's status change handler if provided
      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error("Failed to complete request:", err);
      setError("Failed to mark request as completed. Please try again.");
    }
  };

  const fetchContactInfo = async (requestId) => {
    try {
      const data = await borrowRequestService.getContactInformation(requestId);
      setContactInfo(data);
      setShowContactModal(true);
    } catch (err) {
      console.error("Failed to fetch contact information:", err);
      setError("Failed to load contact information. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="loading">Loading borrow requests...</div>;
  }

  return (
    <div className="borrow-requests-container">
      <h2>Borrow Requests</h2>

      {error && <div className="error-message">{error}</div>}

      {requests.length === 0 ? (
        <div className="no-requests">
          <p>You don't have any borrow requests yet.</p>
        </div>
      ) : (
        <div className="requests-list">
          {requests.map((request) => (
            <div
              key={request._id}
              className={`request-card status-${request.status}`}
            >
              <div className="request-header">
                <h3>{request.bookId.title}</h3>
                <span className={`status-badge ${request.status}`}>
                  {request.status.charAt(0).toUpperCase() +
                    request.status.slice(1)}
                </span>
              </div>

              <div className="request-details">
                <p>
                  <span>Requested by:</span> {request.seekerId.name}
                </p>
                <p>
                  <span>Request Date:</span> {formatDate(request.createdAt)}
                </p>

                {request.message && (
                  <div className="request-message">
                    <p>
                      <span>Message:</span>
                    </p>
                    <p className="message-content">{request.message}</p>
                  </div>
                )}
              </div>

              <div className="request-actions">
                {request.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleAcceptRequest(request._id)}
                      className="btn btn-primary btn-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request._id)}
                      className="btn btn-danger btn-sm"
                    >
                      Reject
                    </button>
                  </>
                )}

                {request.status === "accepted" && (
                  <>
                    <button
                      onClick={() => fetchContactInfo(request._id)}
                      className="btn btn-primary btn-sm"
                    >
                      View Contact Info
                    </button>
                    <button
                      onClick={() => handleCompleteRequest(request._id)}
                      className="btn btn-success btn-sm"
                    >
                      Mark Completed
                    </button>
                  </>
                )}

                {(request.status === "rejected" ||
                  request.status === "completed") && (
                  <div className="request-completed">No action needed</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contact Information Modal */}
      {showContactModal && contactInfo && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Contact Information</h3>

            <div className="contact-details">
              <div className="book-info">
                <h4>Book Details</h4>
                <p>
                  <span>Title:</span> {contactInfo.book.title}
                </p>
                <p>
                  <span>Author:</span> {contactInfo.book.author}
                </p>
              </div>

              <div className="user-info">
                <h4>Borrower Details</h4>
                <p>
                  <span>Name:</span> {contactInfo.contactInfo.name}
                </p>
                <p>
                  <span>Email:</span> {contactInfo.contactInfo.email}
                </p>
                {contactInfo.contactInfo.mobile && (
                  <p>
                    <span>Phone:</span> {contactInfo.contactInfo.mobile}
                  </p>
                )}
              </div>
            </div>

            <p className="contact-note">
              You can now contact the borrower directly to arrange the book
              handover.
            </p>

            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={() => setShowContactModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Status Selection Modal */}
      {showCompleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Complete Borrow Request</h3>
            <p>What happened with this book?</p>

            <div className="complete-options">
              <button
                onClick={() => finalizeCompletion("available")}
                className="btn btn-primary"
              >
                Book Was Returned
              </button>
              <button
                onClick={() => finalizeCompletion("exchanged")}
                className="btn btn-secondary"
              >
                Book Was Exchanged Permanently
              </button>
            </div>

            <button
              onClick={() => setShowCompleteModal(false)}
              className="btn btn-cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowRequestsList;

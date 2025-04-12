import React, { useState, useEffect } from "react";
import borrowRequestService from "../../services/borrowRequestService";
import "./BorrowRequests.css";

const SeekerRequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await borrowRequestService.getSeekerRequests();
      setRequests(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
      setError("Failed to load your requests. Please try again.");
    } finally {
      setLoading(false);
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
    return <div className="loading">Loading your borrow requests...</div>;
  }

  return (
    <div className="borrow-requests-container">
      <h2>My Borrow Requests</h2>

      {error && <div className="error-message">{error}</div>}

      {requests.length === 0 ? (
        <div className="no-requests">
          <p>You haven't made any borrow requests yet.</p>
          <p>Browse books to find something you'd like to borrow!</p>
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
                  <span>Owner:</span> {request.ownerId.name}
                </p>
                <p>
                  <span>Request Date:</span> {formatDate(request.createdAt)}
                </p>

                {request.message && (
                  <div className="request-message">
                    <p>
                      <span>Your Message:</span>
                    </p>
                    <p className="message-content">{request.message}</p>
                  </div>
                )}
              </div>

              <div className="request-actions">
                {request.status === "pending" && (
                  <div className="request-pending">
                    Waiting for owner response...
                  </div>
                )}

                {request.status === "accepted" && (
                  <button
                    onClick={() => fetchContactInfo(request._id)}
                    className="btn btn-primary btn-sm"
                  >
                    View Contact Info
                  </button>
                )}

                {request.status === "rejected" && (
                  <div className="request-rejected">
                    This request was declined by the owner
                  </div>
                )}

                {request.status === "completed" && (
                  <div className="request-completed">
                    This borrowing has been completed
                  </div>
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
                <h4>Owner Details</h4>
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
              You can now contact the owner directly to arrange the book pickup.
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
    </div>
  );
};

export default SeekerRequestsList;

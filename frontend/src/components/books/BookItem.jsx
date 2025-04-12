import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bookService from "../../services/bookService";
import borrowRequestService from "../../services/borrowRequestService";
import "./Books.css";

const BookItem = ({ book, onUpdate }) => {
  const [status, setStatus] = useState(book.status);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: book.title,
    author: book.author,
    genre: book.genre || "",
    location: book.location,
    contactInfo: book.contactInfo,
  });
  const [requestStatus, setRequestStatus] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestSending, setRequestSending] = useState(false);
  const [requestError, setRequestError] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Check if user is owner of this specific book
  const isBookOwner = user && user._id === book.ownerId;

  // Check if user has owner role (regardless of book ownership)
  const hasOwnerRole = user && user.role === "owner";

  // Default image if no cover image is available
  const defaultCoverImage =
    "https://shelf-yc-s22-task-production.up.railway.app/images/default-book-cover.png";

  // Check for existing request when component mounts
  useEffect(() => {
    const checkExistingRequest = async () => {
      if (!user || isBookOwner || hasOwnerRole) return;

      try {
        const requests = await borrowRequestService.getSeekerRequests();
        const existingRequest = requests.find(
          (req) =>
            req.bookId._id === book._id &&
            ["pending", "accepted"].includes(req.status)
        );

        if (existingRequest) {
          setRequestStatus(existingRequest.status);
        }
      } catch (error) {
        console.error("Failed to check existing requests:", error);
      }
    };

    checkExistingRequest();
  }, [book._id, isBookOwner, hasOwnerRole, user]);

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      await bookService.updateBookStatus(book._id, newStatus);
      setStatus(newStatus);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      setLoading(true);
      try {
        await bookService.deleteBook(book._id);
        if (onUpdate) onUpdate();
      } catch (err) {
        console.error("Failed to delete book:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = async () => {
    try {
      await bookService.updateBook(book._id, editData);
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Failed to update book:", err);
    }
  };

  const handleBorrowRequest = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setRequestSending(true);
    setRequestError("");

    try {
      await borrowRequestService.createRequest(book._id, requestMessage);
      setRequestStatus("pending");
      setShowRequestModal(false);
      setRequestMessage("");
    } catch (err) {
      console.error("Failed to send borrow request:", err);
      setRequestError(
        err.response?.data?.message ||
          "Failed to send request. Please try again."
      );
    } finally {
      setRequestSending(false);
    }
  };

  const genres = [
    "Fiction",
    "Fantasy",
    "Science Fiction",
    "Mystery",
    "Thriller",
    "Romance",
    "Non-fiction",
    "Biography",
    "History",
    "Science",
    "Self-Help",
    "Business",
    "Children",
    "Young Adult",
    "Other",
  ];

  return (
    <div className="book-item">
      <div className="book-cover">
        <img
          src={book.coverImage || defaultCoverImage}
          alt={`Cover of ${book.title}`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultCoverImage;
          }}
        />
      </div>

      {isEditing ? (
        <div className="book-edit-form">
          <input
            type="text"
            name="title"
            value={editData.title}
            onChange={handleEditChange}
            placeholder="Book Title"
          />
          <input
            type="text"
            name="author"
            value={editData.author}
            onChange={handleEditChange}
            placeholder="Author"
          />
          <select
            name="genre"
            value={editData.genre}
            onChange={handleEditChange}
          >
            <option value="">Select Genre</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="location"
            value={editData.location}
            onChange={handleEditChange}
            placeholder="Location"
          />
          <input
            type="text"
            name="contactInfo"
            value={editData.contactInfo}
            onChange={handleEditChange}
            placeholder="Contact Information"
          />
          <div className="edit-actions">
            <button onClick={handleEditSubmit} className="save-btn">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="book-header">
            <h3 className="book-title">{book.title}</h3>
            <div className={`book-status status-${status}`}>{status}</div>
          </div>

          <div className="book-details">
            <p>
              <span>Author:</span> {book.author}
            </p>
            {book.genre && (
              <p>
                <span>Genre:</span> {book.genre}
              </p>
            )}
            <p>
              <span>Location:</span> {book.location}
            </p>
            {/* Only show contact info to the owner */}
            {isBookOwner && (
              <p>
                <span>Contact:</span> {book.contactInfo}
              </p>
            )}
          </div>

          {isBookOwner ? (
            <div className="book-actions">
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-secondary btn-sm"
              >
                Edit
              </button>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={loading}
                className="status-select"
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="exchanged">Exchanged</option>
              </select>
              <button
                onClick={handleDelete}
                className="btn btn-danger btn-sm"
                disabled={loading}
              >
                Delete
              </button>
            </div>
          ) : (
            // Only show borrow options if user is NOT an owner (role check)
            !hasOwnerRole && (
              <div className="book-actions">
                {requestStatus === "pending" ? (
                  <button className="btn btn-secondary btn-sm" disabled>
                    Request Pending
                  </button>
                ) : requestStatus === "accepted" ? (
                  <button
                    onClick={() => navigate("/my-requests")}
                    className="btn btn-success btn-sm"
                  >
                    View Contact Info
                  </button>
                ) : (
                  <button
                    onClick={() => setShowRequestModal(true)}
                    className="btn btn-primary btn-sm"
                    disabled={book.status !== "available"}
                  >
                    {book.status === "available" ? "Borrow" : "Not Available"}
                  </button>
                )}
              </div>
            )
          )}
        </>
      )}

      {/* Borrow Request Modal */}
      {showRequestModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Request to Borrow</h3>
            <p>
              You are requesting to borrow "{book.title}" by {book.author}
            </p>

            {requestError && (
              <div className="error-message">{requestError}</div>
            )}

            <div className="form-group">
              <label>Message for the owner (optional):</label>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Introduce yourself and explain why you'd like to borrow this book..."
                rows="4"
              />
            </div>

            <div className="modal-actions">
              <button
                onClick={() => setShowRequestModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleBorrowRequest}
                className="btn btn-primary"
                disabled={requestSending}
              >
                {requestSending ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookItem;

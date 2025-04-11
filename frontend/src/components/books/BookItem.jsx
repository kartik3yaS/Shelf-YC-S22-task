import React, { useState } from "react";
import bookService from "../../services/bookService";
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

  const user = JSON.parse(localStorage.getItem("user"));
  const isOwner = user && user._id === book.ownerId;

  // Default image if no cover image is available
  const defaultCoverImage =
    "https://shelf-yc-s22-task-production.up.railway.app/images/default-book-cover.png";

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
            <p>
              <span>Contact:</span> {book.contactInfo}
            </p>
          </div>

          {isOwner && (
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
          )}
        </>
      )}
    </div>
  );
};

export default BookItem;

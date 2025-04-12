import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import bookService from "../../services/bookService";
import "./Books.css";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await bookService.getBookById(id);
        setBook(data);

        // Record view interaction
        if (user) {
          try {
            await bookService.recordView(id);
          } catch (err) {
            console.error("Failed to record view:", err);
          }
        }
      } catch (err) {
        console.error("Failed to fetch book:", err);
        setError("Could not load book details at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, user]);

  if (loading) {
    return <div className="loading">Loading book details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!book) {
    return <div className="not-found">Book not found</div>;
  }

  return (
    <div className="book-detail-container">
      <div className="book-detail">
        <div className="book-detail-header">
          <div className="book-cover-large">
            <img
              src={book.coverImage || "/images/default-book-cover.jpg"}
              alt={`Cover of ${book.title}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/default-book-cover.jpg";
              }}
            />
          </div>

          <div className="book-info">
            <h2>{book.title}</h2>
            <p className="book-author">by {book.author}</p>

            {book.genre && <p className="book-genre">{book.genre}</p>}

            <p className="book-status status-{book.status}">{book.status}</p>

            <div className="book-meta">
              <p>
                <span>Location:</span> {book.location}
              </p>
              {user && user._id === book.ownerId && (
                <p>
                  <span>Contact:</span> {book.contactInfo}
                </p>
              )}
            </div>
          </div>
        </div>

        {book.description && (
          <div className="book-description">
            <h3>Description</h3>
            <p>{book.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;

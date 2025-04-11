import React, { useState, useEffect } from "react";
import bookService from "../../services/bookService";
import BookItem from "./BookItem";
import "./Books.css";

const BookList = ({ onUpdate }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [filters, setFilters] = useState({
    title: "",
    location: "",
    genre: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [filters, books]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      setBooks(data);
      setFilteredBooks(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch books. Please try again later.");
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const filterBooks = () => {
    let results = [...books];

    if (filters.title) {
      results = results.filter((book) =>
        book.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }

    if (filters.location) {
      results = results.filter((book) =>
        book.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.genre) {
      results = results.filter((book) => book.genre === filters.genre);
    }

    setFilteredBooks(results);
  };

  const clearFilters = () => {
    setFilters({
      title: "",
      location: "",
      genre: "",
    });
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
    <div className="book-list-container">
      <div className="filters-container">
        <h3>Filters</h3>
        <div className="filters-form">
          <div className="form-group">
            <input
              type="text"
              name="title"
              placeholder="Search by title"
              value={filters.title}
              onChange={handleFilterChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="location"
              placeholder="Filter by location"
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>

          <div className="form-group">
            <select
              name="genre"
              value={filters.genre}
              onChange={handleFilterChange}
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={clearFilters}
            className="btn btn-secondary btn-clear-filters"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="books-results">
        <h3>
          Available Books{" "}
          {filteredBooks.length > 0 && `(${filteredBooks.length})`}
        </h3>

        {loading && <div className="loader">Loading books...</div>}
        {error && <div className="error">{error}</div>}

        {!loading && filteredBooks.length === 0 && (
          <div className="no-books">
            <p>No books found. Try different filters or check back later.</p>
          </div>
        )}

        <div className="books-grid">
          {filteredBooks.map((book) => (
            <BookItem
              key={book._id}
              book={book}
              onUpdate={() => {
                if (onUpdate) onUpdate();
                fetchBooks();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookList;

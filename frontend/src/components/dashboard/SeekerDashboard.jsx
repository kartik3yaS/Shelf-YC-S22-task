import React from "react";
import BookList from "../books/BookList";
import "./Dashboard.css";

const SeekerDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Book Seeker Dashboard</h1>
        <p>
          Welcome back, <span className="user-name">{user.name}</span>!
        </p>
      </div>

      <div className="dashboard-content">
        <div className="browse-books-section">
          <h2>Find Your Next Book</h2>
          <p className="section-desc">
            Browse through the available books for rent or exchange in your
            area. Use the filters to narrow down your search.
          </p>
          <BookList />
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;

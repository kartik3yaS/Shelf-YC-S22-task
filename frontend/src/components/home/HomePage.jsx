import React from "react";
import { Link } from "react-router-dom";
import BookList from "../books/BookList";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Share Books, Share Knowledge</h1>
          <p>
            Connect with book lovers in your community to rent, exchange, and
            share your favorite reads.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              Join Now
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="http://localhost:5000/images/book-sharing.svg"
            alt="Book sharing illustration"
          />
        </div>
      </section>

      <section className="features-section">
        <h2>How It Works</h2>
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-user-plus"></i>
            </div>
            <h3>Create an Account</h3>
            <p>Sign up as a Book Owner or Seeker based on your needs.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-book"></i>
            </div>
            <h3>List Your Books</h3>
            <p>If you're an owner, add books you want to share or rent.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3>Find Books</h3>
            <p>Browse listings to find books available in your area.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-handshake"></i>
            </div>
            <h3>Connect & Exchange</h3>
            <p>Contact book owners and arrange to rent or exchange books.</p>
          </div>
        </div>
      </section>

      <section className="browse-section">
        <h2>Available Books</h2>
        <p>Browse through our collection of available books</p>
        <BookList />
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Sharing?</h2>
          <p>
            Join our community of book lovers today and start sharing your
            collection.
          </p>
          <Link to="/register" className="btn btn-primary">
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

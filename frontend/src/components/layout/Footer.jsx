import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>BookExchange</h3>
            <p>
              Connect with fellow book lovers to rent, exchange, and share books
              in your community.
            </p>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/register">Join Us</a>
              </li>
              <li>
                <a href="/login">Login</a>
              </li>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: info@bookexchange.com</p>
            <p>Phone: (123) 456-7890</p>
            <div className="social-icons">
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-credits">
            <p>
              &copy; {new Date().getFullYear()} BookExchange. All rights
              reserved.
            </p>
            <p className="developer-credit">
              Developed with <span className="heart">♥</span> by{" "}
              <span className="developer-name">Kartikeya Shukla</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

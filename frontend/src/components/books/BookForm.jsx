import React, { useState } from "react";
import bookService from "../../services/bookService";
import "./Books.css";

const BookForm = ({ onBookAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    location: "",
    contactInfo: "",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    if (file && !validTypes.includes(file.type)) {
      setErrors({
        ...errors,
        coverImage: "Please upload a valid image file (JPG, PNG, or GIF)",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file && file.size > 2 * 1024 * 1024) {
      setErrors({
        ...errors,
        coverImage: "Image size should be less than 2MB",
      });
      return;
    }

    if (file) {
      setCoverImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors({
        ...errors,
        coverImage: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Book title is required";
    } else if (formData.title.trim().length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    }

    // Author validation
    if (!formData.author.trim()) {
      newErrors.author = "Author name is required";
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    // Contact info validation
    if (!formData.contactInfo.trim()) {
      newErrors.contactInfo = "Contact information is required";
    } else if (formData.contactInfo.includes("@")) {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.contactInfo)) {
        newErrors.contactInfo = "Please enter a valid email address";
      }
    } else {
      // Phone number validation
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.contactInfo)) {
        newErrors.contactInfo = "Please enter a valid 10-digit phone number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (loading) {
      return; // Prevent multiple submissions while loading
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Create FormData object for file upload
      const bookFormData = new FormData();

      // Append all text fields
      Object.keys(formData).forEach((key) => {
        bookFormData.append(key, formData[key]);
      });

      // Append image if exists
      if (coverImage) {
        bookFormData.append("coverImage", coverImage);
      }

      const newBook = await bookService.createBook(bookFormData);

      // Reset form
      setFormData({
        title: "",
        author: "",
        genre: "",
        location: "",
        contactInfo: "",
      });
      setCoverImage(null);
      setImagePreview("");
      setSuccess("Book added successfully!");

      if (onBookAdded) {
        onBookAdded(newBook);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add book. Please try again."
      );
    } finally {
      setLoading(false);
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
    <div className="book-form-container">
      <h3>Add a New Book</h3>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-group">
          <label htmlFor="title">Book Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter book title"
            className={errors.title ? "input-error" : ""}
          />
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="author">Author*</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter author name"
            className={errors.author ? "input-error" : ""}
          />
          {errors.author && (
            <div className="error-message">{errors.author}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="genre">Genre</label>
          <select
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
          >
            <option value="">Select Genre</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location*</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter your city/location"
            className={errors.location ? "input-error" : ""}
          />
          {errors.location && (
            <div className="error-message">{errors.location}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="contactInfo">
            Contact Information* (Phone or Email)
          </label>
          <input
            type="text"
            id="contactInfo"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            placeholder="Phone number or email"
            className={errors.contactInfo ? "input-error" : ""}
          />
          {errors.contactInfo && (
            <div className="error-message">{errors.contactInfo}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="coverImage">Book Cover Image</label>
          <input
            type="file"
            id="coverImage"
            name="coverImage"
            accept="image/*"
            onChange={handleImageChange}
            className={errors.coverImage ? "input-error" : ""}
          />
          {errors.coverImage && (
            <div className="error-message">{errors.coverImage}</div>
          )}

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Book cover preview" />
            </div>
          )}
          <small>Max file size: 2MB. Accepted formats: JPG, PNG, GIF</small>
        </div>

        <button type="submit" className="btn btn-add-book" disabled={loading}>
          {loading ? "Adding Book..." : "Add Book"}
        </button>
      </form>
    </div>
  );
};

export default BookForm;

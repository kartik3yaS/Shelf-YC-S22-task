import axios from "axios";

const API_URL = "https://shelf-yc-s22-task-production.up.railway.app/api";

// Configure axios with authentication
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get all books
const getAllBooks = async () => {
  const response = await axios.get(`${API_URL}/books`);
  return response.data;
};

// Get book by ID - needed for BookDetail component
const getBookById = async (id) => {
  const response = await axios.get(`${API_URL}/books/${id}`);
  return response.data;
};

// Get books by owner
const getBooksByOwner = async (ownerId) => {
  const response = await axios.get(`${API_URL}/books/owner/${ownerId}`);
  return response.data;
};

// Get borrowed books for a seeker
const getBorrowedBooks = async (userId) => {
  const response = await axios.get(`${API_URL}/books/borrowed/${userId}`);
  return response.data;
};

// Create a new book
const createBook = async (bookData) => {
  const response = await axios.post(`${API_URL}/books`, bookData);
  return response.data;
};

// Update a book
const updateBook = async (id, bookData) => {
  const response = await axios.put(`${API_URL}/books/${id}`, bookData);
  return response.data;
};

// Update a book's status
const updateBookStatus = async (id, status) => {
  const response = await axios.patch(`${API_URL}/books/${id}/status`, {
    status,
  });
  return response.data;
};

// Delete a book
const deleteBook = async (id) => {
  const response = await axios.delete(`${API_URL}/books/${id}`);
  return response.data;
};

// Record a view of a book (could be used for analytics)
const recordView = async (bookId) => {
  try {
    await axios.post(`${API_URL}/books/${bookId}/view`);
  } catch (error) {
    console.error("Error recording book view:", error);
  }
};

// Search books by title, author, or genre
const searchBooks = async (query) => {
  const response = await axios.get(`${API_URL}/books/search?q=${query}`);
  return response.data;
};

// Filter books by status
const filterBooksByStatus = async (status) => {
  const response = await axios.get(`${API_URL}/books/filter?status=${status}`);
  return response.data;
};

export default {
  getAllBooks,
  getBookById,
  getBooksByOwner,
  getBorrowedBooks,
  createBook,
  updateBook,
  updateBookStatus,
  deleteBook,
  recordView,
  searchBooks,
  filterBooksByStatus,
};

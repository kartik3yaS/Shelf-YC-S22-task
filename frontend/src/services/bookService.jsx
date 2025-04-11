import axios from "axios";

const API_URL = "http://localhost:5000/api/books";

// Configure axios to include token in requests
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

const getAllBooks = async (filters = {}) => {
  const { title, location, genre } = filters;
  const params = new URLSearchParams();

  if (title) params.append("title", title);
  if (location) params.append("location", location);
  if (genre) params.append("genre", genre);

  const response = await axios.get(`${API_URL}?${params.toString()}`);
  return response.data;
};

const getBooksByOwner = async (ownerId) => {
  const response = await axios.get(`${API_URL}/owner/${ownerId}`);
  return response.data;
};

const createBook = async (bookData) => {
  // Modified to handle FormData for file uploads
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const response = await axios.post(API_URL, bookData, config);
  return response.data;
};

const updateBookStatus = async (bookId, status) => {
  const response = await axios.patch(`${API_URL}/${bookId}/status`, { status });
  return response.data;
};

const deleteBook = async (bookId) => {
  const response = await axios.delete(`${API_URL}/${bookId}`);
  return response.data;
};

const updateBook = async (bookId, bookData) => {
  const response = await axios.put(`${API_URL}/${bookId}`, bookData);
  return response.data;
};

export default {
  getAllBooks,
  getBooksByOwner,
  createBook,
  updateBookStatus,
  deleteBook,
  updateBook,
};

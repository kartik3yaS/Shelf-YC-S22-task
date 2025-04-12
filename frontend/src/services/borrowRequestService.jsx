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

const createRequest = async (bookId, message) => {
  const response = await axios.post(`${API_URL}/borrow-requests`, {
    bookId,
    message,
  });
  return response.data;
};

const getOwnerRequests = async () => {
  const response = await axios.get(`${API_URL}/borrow-requests/owner`);
  return response.data;
};

const getSeekerRequests = async () => {
  const response = await axios.get(`${API_URL}/borrow-requests/seeker`);
  return response.data;
};

const updateRequestStatus = async (requestId, status) => {
  const response = await axios.patch(
    `${API_URL}/borrow-requests/${requestId}/status`,
    { status }
  );
  return response.data;
};

const getContactInformation = async (requestId) => {
  const response = await axios.get(
    `${API_URL}/borrow-requests/${requestId}/contact`
  );
  return response.data;
};

// Updated to include bookStatus parameter
const completeRequest = async (requestId, bookStatus) => {
  const response = await axios.patch(
    `${API_URL}/borrow-requests/${requestId}/complete`,
    { bookStatus }
  );
  return response.data;
};

export default {
  createRequest,
  getOwnerRequests,
  getSeekerRequests,
  updateRequestStatus,
  getContactInformation,
  completeRequest,
};

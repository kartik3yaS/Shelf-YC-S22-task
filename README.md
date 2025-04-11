# Book Exchange Platform

A full-stack web application that enables users to exchange books with others in their community. Built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🚀 Features

- **User Authentication**

  - Secure registration and login system
  - Role-based access control (Book Owner/Seeker)
  - JWT-based authentication

- **Book Management**

  - Add, edit, and delete books
  - Upload book cover images
  - Search and filter books
  - View book details

- **User Dashboard**

  - Personalized dashboard for book owners and seekers
  - Manage book listings
  - View exchange requests

- **Responsive Design**
  - Mobile-friendly interface
  - Modern and intuitive UI
  - Cross-browser compatibility

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- CSS
- Axios
- React Router
- Font Awesome

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer (for file uploads)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## 🚀 Installation

1. **Clone the repository**

```bash
https://github.com/kartik3yaS/Shelf-YC-S22-task.git
cd Shelf-YC-S22-task
```

2. **Install dependencies**

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Environment Setup**

   - Create a `.env` file in the server directory with the following variables:

   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://kartikeyashukla:KlLKfkRsjN79JaT3@cluster0.lnvzawa.mongodb.net/shelf?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your_jwt_secret_key_should_be_long_and_complex
   JWT_EXPIRE=24h
   ```
   **Note:**
   
      The provided `MONGODB_URI` is a secured, limited-access connection string with read and write permissions only to the `shelf` database. This allows you to run the           application locally using the shared database for development and testing purposes — no admin privileges or access to other databases is granted.

5. **Start the application**

```bash
# Start backend server
cd server
npm run dev

# Start frontend development server
cd ../frontend
npm run dev
```


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
git clone https://github.com/yourusername/book-exchange-platform.git
cd book-exchange-platform
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
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the application**

```bash
# Start backend server
cd server
npm run dev

# Start frontend development server
cd ../frontend
npm run dev
```

## 📁 Project Structure

```
book-exchange-platform/
├── frontend/              # React frontend
│   ├── public/           # Static files
│   ├── src/              # Source code
│   │   ├── components/   # React components
│   │   ├── services/     # API services
│   │   ├── pages/        # Page components
│   │   └── App.jsx       # Main App component
│   └── package.json      # Frontend dependencies
│
├── server/               # Node.js backend
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   └── app.js            # Express app setup
│
└── README.md             # Project documentation
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing
- Protected routes
- Input validation
- Error handling
- Secure file uploads

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🛠️ Development Tools

This project was developed using:

- [Cursor AI](https://cursor.sh/) - AI-powered code editor
- [Claude 3.7 Sonnet](https://claude.ai/) - AI assistant for code generation and debugging

## 📞 Support

For support, email support@bookexchange.com or join our Slack channel.

## 📊 Project Status

This project is currently in active development. New features and improvements are being added regularly.

// import React, { useState, useEffect } from "react";
// import BookForm from "../books/BookForm";
// import BookList from "../books/BookList";
// import BookItem from "../books/BookItem";
// import BorrowRequestsList from "../borrowRequests/BorrowRequestsList";
// import bookService from "../../services/bookService";
// import "./Dashboard.css";

// const OwnerDashboard = () => {
//   const [myBooks, setMyBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [activeTab, setActiveTab] = useState("myBooks");
//   const user = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     fetchMyBooks();
//   }, []);

//   const fetchMyBooks = async () => {
//     try {
//       setLoading(true);
//       const data = await bookService.getBooksByOwner(user._id);
//       setMyBooks(data);
//       setLoading(false);
//     } catch (err) {
//       setError("Failed to fetch your books. Please try again later.");
//       setLoading(false);
//     }
//   };

//   const handleBookAdded = (newBook) => {
//     setMyBooks([newBook, ...myBooks]);
//   };

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header">
//         <h1>Book Owner Dashboard</h1>
//         <p>
//           Welcome back, <span className="user-name">{user.name}</span>!
//         </p>
//       </div>

//       <div className="dashboard-tabs">
//         <button
//           className={`tab-btn ${activeTab === "myBooks" ? "active" : ""}`}
//           onClick={() => setActiveTab("myBooks")}
//         >
//           My Books
//         </button>
//         <button
//           className={`tab-btn ${activeTab === "addBook" ? "active" : ""}`}
//           onClick={() => setActiveTab("addBook")}
//         >
//           Add New Book
//         </button>
//         <button
//           className={`tab-btn ${
//             activeTab === "borrowRequests" ? "active" : ""
//           }`}
//           onClick={() => setActiveTab("borrowRequests")}
//         >
//           Borrow Requests
//         </button>
//         <button
//           className={`tab-btn ${activeTab === "browse" ? "active" : ""}`}
//           onClick={() => setActiveTab("browse")}
//         >
//           Browse All Books
//         </button>
//       </div>

//       <div className="dashboard-content">
//         {activeTab === "myBooks" && (
//           <div className="my-books-section">
//             <h2>My Books</h2>

//             {loading ? (
//               <div className="loader">Loading your books...</div>
//             ) : error ? (
//               <div className="error">{error}</div>
//             ) : myBooks.length === 0 ? (
//               <div className="no-books">
//                 <p>You haven't added any books yet.</p>
//                 <button onClick={() => setActiveTab("addBook")} className="btn">
//                   Add Your First Book
//                 </button>
//               </div>
//             ) : (
//               <div className="books-grid">
//                 {myBooks.map((book) => (
//                   <BookItem
//                     key={book._id}
//                     book={book}
//                     onUpdate={fetchMyBooks}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === "addBook" && (
//           <div className="add-book-section">
//             <BookForm
//               onBookAdded={(newBook) => {
//                 handleBookAdded(newBook);
//                 setActiveTab("myBooks");
//               }}
//             />
//           </div>
//         )}

//         {activeTab === "borrowRequests" && (
//           <div className="borrow-requests-section">
//             <h2>Borrow Requests</h2>
//             <BorrowRequestsList onStatusChange={fetchMyBooks} />
//           </div>
//         )}

//         {activeTab === "browse" && (
//           <div className="browse-books-section">
//             <h2>Browse All Books</h2>
//             <BookList onUpdate={fetchMyBooks} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OwnerDashboard;

import React, { useState, useEffect } from "react";
import BookForm from "../books/BookForm";
import BookList from "../books/BookList";
import BookItem from "../books/BookItem";
import BorrowRequestsList from "../borrowRequests/BorrowRequestsList";
import bookService from "../../services/bookService";
import borrowRequestService from "../../services/borrowRequestService";
import "./Dashboard.css";

const OwnerDashboard = () => {
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("myBooks");
  const [newRequestsCount, setNewRequestsCount] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchMyBooks();
    fetchNewRequestsCount();
  }, []);

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getBooksByOwner(user._id);
      setMyBooks(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch your books. Please try again later.");
      setLoading(false);
    }
  };

  const fetchNewRequestsCount = async () => {
    try {
      const count = await borrowRequestService.getNewRequestsCount();
      setNewRequestsCount(count);
    } catch (err) {
      console.error("Failed to fetch new requests count:", err);
    }
  };

  const handleBookAdded = (newBook) => {
    setMyBooks([newBook, ...myBooks]);
  };

  const handleTabChange = async (tab) => {
    setActiveTab(tab);

    // If switching to borrow requests tab, mark requests as viewed
    if (tab === "borrowRequests" && newRequestsCount > 0) {
      try {
        await borrowRequestService.markRequestsAsViewed();
        setNewRequestsCount(0);
      } catch (err) {
        console.error("Failed to mark requests as viewed:", err);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Book Owner Dashboard</h1>
        <p>
          Welcome back, <span className="user-name">{user.name}</span>!
        </p>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === "myBooks" ? "active" : ""}`}
          onClick={() => handleTabChange("myBooks")}
        >
          My Books
        </button>
        <button
          className={`tab-btn ${activeTab === "addBook" ? "active" : ""}`}
          onClick={() => handleTabChange("addBook")}
        >
          Add New Book
        </button>
        <button
          className={`tab-btn ${
            activeTab === "borrowRequests" ? "active" : ""
          }`}
          onClick={() => handleTabChange("borrowRequests")}
        >
          Borrow Requests
          {newRequestsCount > 0 && (
            <span className="notification-badge">{newRequestsCount}</span>
          )}
        </button>
        <button
          className={`tab-btn ${activeTab === "browse" ? "active" : ""}`}
          onClick={() => handleTabChange("browse")}
        >
          Browse All Books
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === "myBooks" && (
          <div className="my-books-section">
            <h2>My Books</h2>

            {loading ? (
              <div className="loader">Loading your books...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : myBooks.length === 0 ? (
              <div className="no-books">
                <p>You haven't added any books yet.</p>
                <button
                  onClick={() => handleTabChange("addBook")}
                  className="btn"
                >
                  Add Your First Book
                </button>
              </div>
            ) : (
              <div className="books-grid">
                {myBooks.map((book) => (
                  <BookItem
                    key={book._id}
                    book={book}
                    onUpdate={fetchMyBooks}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "addBook" && (
          <div className="add-book-section">
            <BookForm
              onBookAdded={(newBook) => {
                handleBookAdded(newBook);
                handleTabChange("myBooks");
              }}
            />
          </div>
        )}

        {activeTab === "borrowRequests" && (
          <div className="borrow-requests-section">
            <h2>Borrow Requests</h2>
            <BorrowRequestsList
              onStatusChange={fetchMyBooks}
              onRequestsViewed={() => setNewRequestsCount(0)}
            />
          </div>
        )}

        {activeTab === "browse" && (
          <div className="browse-books-section">
            <h2>Browse All Books</h2>
            <BookList onUpdate={fetchMyBooks} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;

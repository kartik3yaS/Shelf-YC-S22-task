import React, { useState } from "react";
import BookList from "../books/BookList";
import SeekerRequestsList from "../borrowRequests/SeekerRequestsList";
import "./Dashboard.css";

const SeekerDashboard = () => {
  const [activeTab, setActiveTab] = useState("discover");
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="seeker-dashboard">
      <div className="dashboard-header">
        <h2>Book Seeker Dashboard</h2>
        <p>Welcome back, {user?.name}!</p>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === "discover" ? "active" : ""}`}
          onClick={() => setActiveTab("discover")}
        >
          Discover Books
        </button>
        <button
          className={`tab-button ${activeTab === "myRequests" ? "active" : ""}`}
          onClick={() => setActiveTab("myRequests")}
        >
          My Requests
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === "discover" && (
          <div className="discover-section">
            <BookList />
          </div>
        )}

        {activeTab === "myRequests" && (
          <div className="my-requests-section">
            <SeekerRequestsList />
          </div>
        )}
      </div>
    </div>
  );
};

export default SeekerDashboard;

import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ListApplications from "./ListApplications";
import AddApplication from "./AddApplication";
import UploadDocuments from "./UploadDocument"
import "./App.css"; // Importing the CSS file for styling

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Job Application Tracker</h1>
        </header>
        <nav className="app-nav">
          <ul>
            <li>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/add-application" className="nav-link">
                Add Job Application
              </Link>
            </li>
            <li>
              <Link to="/upload-documents" className="nav-link">
                Upload Documents
              </Link>
            </li>
          </ul>
        </nav>
        <main className="app-main">
          <Routes>
            <Route path="/add-application" element={<AddApplication />} />
            <Route path="/upload-documents" element={<UploadDocuments />} />
            <Route path="/" element={<ListApplications />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

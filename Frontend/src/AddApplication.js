import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "./AddApplicationStyles.css";
const AddApplication = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    applicationDate: "",
    status: "",
    notes: "",
    resumeUrl: "",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); 
    const applicationData = {
      applicationId: uuidv4(),
      ...formData,
      lastUpdated: new Date().toISOString(),
    };

    try {
      await axios.post(
        "https://kzfpfwvphk.execute-api.us-east-1.amazonaws.com/V1/application",
        JSON.stringify({ body: JSON.stringify(applicationData) }),
        { headers: { "Content-Type": "application/json" } }
      );
      setFormData({
        companyName: "",
        position: "",
        applicationDate: "",
        status: "",
        notes: "",
        resumeUrl: "",
      });
      setStatusMessage("Application added successfully!");
      setIsError(false);
    } catch (error) {
      console.error("Error adding application", error);
      setStatusMessage("Error adding application. Please try again.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className="add-application-container">
      <h2>Add Job Application</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Company Name:
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Position:
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Application Date:
            <input
              type="date"
              name="applicationDate"
              value={formData.applicationDate}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Status:
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Notes:
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Resume URL:
            <input
              type="text"
              name="resumeUrl"
              value={formData.resumeUrl}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Application"}
          </button>
        </div>
      </form>
      {statusMessage && (
        <div style={{ color: isError ? "red" : "green" }}>{statusMessage}</div>
      )}
    </div>
  );
};

export default AddApplication;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ListApplicationStyles.css";

function ListApplications() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingApp, setEditingApp] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          "https://kzfpfwvphk.execute-api.us-east-1.amazonaws.com/V1/application"
        );
        const data = JSON.parse(response.data.body);
        setApplications(data);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const deleteApplication = (applicationId) => {
    axios
      .delete(
        `https://kzfpfwvphk.execute-api.us-east-1.amazonaws.com/V1/application/${applicationId}`
      )
      .then(() => {
        setApplications(
          applications.filter((app) => app.applicationId !== applicationId)
        );
      })
      .catch((error) => {
        console.error("Error deleting application:", error);
      });
  };

  const startEdit = (app) => {
    setEditingApp({ ...app });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://kzfpfwvphk.execute-api.us-east-1.amazonaws.com/V1/application/${editingApp.applicationId}`,
        editingApp,
        { headers: { "Content-Type": "application/json" } }
      );
      setApplications(
        applications.map((app) =>
          app.applicationId === editingApp.applicationId ? editingApp : app
        )
      );
      setEditingApp(null);
    } catch (error) {
      console.error("Error updating application", error);
    }
  };

  const handleChange = (e) => {
    setEditingApp({ ...editingApp, [e.target.name]: e.target.value });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading applications.</div>;

  return (
    <div className="list-applications-container">
      <h2>Job Applications List</h2>
      {editingApp && (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            name="companyName"
            value={editingApp.companyName}
            readOnly
          />
          <input
            type="text"
            name="position"
            value={editingApp.position}
            readOnly
          />
          <input
            type="date"
            name="applicationDate"
            value={editingApp.applicationDate}
            readOnly
          />
          <input
            type="text"
            name="status"
            value={editingApp.status}
            onChange={handleChange}
          />
          <textarea
            name="notes"
            value={editingApp.notes}
            onChange={handleChange}
          />
          {/* <input
            type="text"
            name="resumeUrl"
            value={editingApp.resumeUrl}
            onChange={handleChange}
          /> */}
          <button type="submit">Update</button>
        </form>
      )}
      <table>
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Position</th>
            <th>Application Date</th>
            <th>Status</th>
            <th>Notes</th>
            {/* <th>Resume URL</th> */}
            <th>Last Updated</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.applicationId}>
              <td>{app.companyName}</td>
              <td>{app.position}</td>
              <td>{app.applicationDate}</td>
              <td>{app.status}</td>
              <td>{app.notes}</td>
              {/* <td>
                <a
                  href={app.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Resume
                </a>
              </td> */}
              <td>{app.lastUpdated}</td>

              <td>
                <button className="edit-button" onClick={() => startEdit(app)}>
                  Edit
                </button>
              </td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => deleteApplication(app.applicationId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListApplications;

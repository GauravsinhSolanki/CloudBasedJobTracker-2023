import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DocumentManagementStyles.css"; // Assuming you have a CSS file for styles

const DocumentManagement = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        "https://ia5b919h87.execute-api.us-east-1.amazonaws.com/v1/documents"
      );

      // Parse the JSON string in the response body
      const docsArray = JSON.parse(response.data.body);

      setDocuments(docsArray);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError(err);
      setIsLoading(false);
    }
  };

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      const fileContent = e.target.result.split(",")[1]; // Get the base64 content
      const payload = {
        fileName: selectedFile.name,
        fileContent: fileContent,
        fileType: selectedFile.type,
      };

      try {
        await axios.post(
          "https://ia5b919h87.execute-api.us-east-1.amazonaws.com/v1/documents",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        alert("File uploaded successfully!");
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("File upload failed!");
      }
      fetchDocuments();
    };

    reader.readAsDataURL(selectedFile);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading documents.</div>;

  return (
    <div className="document-management-container">
      <div className="upload-section">
        <input type="file" onChange={handleFileInput} />
        <button onClick={handleUpload}>Upload to S3</button>
      </div>
      <div className="document-list-section">
        <h2>Document List</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>File Name</th>
              <th>Last Modified</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <a href={doc.Url} target="_blank" rel="noopener noreferrer">
                    {doc.Key}
                  </a>
                </td>
                <td>{new Date(doc.LastModified).toLocaleDateString()} </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentManagement;

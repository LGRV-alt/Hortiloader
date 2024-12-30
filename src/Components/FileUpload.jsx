import React, { useState } from "react";
import pb from "./lib/pocketbase";

const FileUpload = ({ taskID }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const id = taskID;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("taskID", id);
    formData.append("user", pb.authStore.model.id);

    try {
      const record = await pb.collection("files").create(formData);
      setMessage(`File uploaded successfully: ${record.id}`);
    } catch (err) {
      console.error("Error uploading file:", err);
      setMessage("Failed to upload file.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label>File:</label>
        <input type="file" onChange={handleFileChange} />
      </div>
      <button type="submit">Upload</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default FileUpload;

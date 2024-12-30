import React, { useState } from "react";
import pb from "./lib/pocketbase";

const FileUpload = ({ taskID, setRefresh }) => {
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
    <div className=" w-full flex justify-center  text-white">
      <form onSubmit={handleSubmit} className="w-1/2">
        <div className="flex flex-col text-center justify-center gap-5 items-center">
          <div>
            <h3>Upload Picklist/Pictures</h3>
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
          <button
            type="submit"
            className="bg-green-500  text-white py-2 px-4 rounded-md m-1 hover:bg-regal-blue hover:text-secondary-colour transition-all hover:outline w-full md:w-1/2"
          >
            Upload
          </button>
        </div>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default FileUpload;

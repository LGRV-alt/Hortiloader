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
    <div className=" md:w-2/3 mx-2 w-full h-full flex justify-center border-2 rounded-xl text-white">
      <form onSubmit={handleSubmit} className="w-3/4">
        <div className="flex flex-col gap-2 pt-4 ">
          <h3 className="text-center font-bold text-xl ">
            Upload Picklist/Pictures
          </h3>
          <div className="flex gap-1">
            <label>Title:</label>
            <input
              className="text-black"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <label>File:</label>
            <input type="file" onChange={handleFileChange} />
          </div>
          <div className="flex w-full justify-center pb-2">
            <button
              type="submit"
              className="bg-green-500  text-white py-2 px-4 rounded-md m-1 hover:bg-regal-blue hover:text-secondary-colour transition-all hover:outline w-full "
            >
              Upload
            </button>
          </div>
        </div>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default FileUpload;

import React, { useState } from "react";
import pb from "../api/pbConnect";
import toast from "react-hot-toast";

const FileUpload = ({ taskID, onUpload }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [upload, setUpload] = useState(false);
  const id = taskID;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    if (title.length < 1) {
      toast.error("Please enter a title");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("taskID", id);
    formData.append("user", pb.authStore.record.id);
    formData.append("org", pb.authStore.record.organization);

    try {
      setUpload(true);
      const record = await pb.collection("files").create(formData);
      setUpload(false);
      toast.success(`File uploaded successfully: ${record.id}`);
      const updatedPictures = await pb.collection("files").getList(1, 50, {
        filter: `taskID = "${id}"`,
      });
      onUpload(updatedPictures.items);
    } catch (err) {
      console.error("Error uploading file:", err);
      toast.error("Failed to upload file.");
    }
  };

  return (
    <div className="justify-center bg-regal-blue text-white flex md:text-base rounded-t-2xl p-2 md:px-10">
      <form onSubmit={handleSubmit} className="">
        <div className="flex flex-col gap-2 pt- 2">
          <h3 className="text-center text-lg font-semibold underline">
            Upload PDF/Pictures
          </h3>
          <div className="flex gap-1">
            <input
              className="text-black px-1"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex justify-center  pb-2">
            <button
              type="submit"
              className=" bg-green-500  text-white py-1 px-6 rounded-md  hover:bg-green-400 transition-all  "
            >
              {upload ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FileUpload;

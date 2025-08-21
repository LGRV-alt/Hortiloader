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
    <div className="justify-center flex md:text-base border-2 border-black rounded-xl p-2 md:px-10">
      <form onSubmit={handleSubmit} className="">
        <div className="flex flex-col gap-2 pt-4 ">
          <h3 className="text-center  font-bold">Upload PDF/Pictures</h3>
          <div className="flex gap-1">
            <input
              className="text-black w-full"
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
              className="w-full bg-green-500  text-white py-2 px-4 rounded-md  hover:bg-green-400 transition-all border-2 border-black "
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

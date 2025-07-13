import React, { useState } from "react";
import pb from "../api/pbConnect";
import toast from "react-hot-toast";

const MovementFileUpload = ({ movementID, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Pick a file!");
    setUploading(true);

    try {
      // 1. Get current movement data
      const movement = await pb
        .collection("trolley_movements")
        .getOne(movementID);

      // 2. Prepare FormData
      const formData = new FormData();

      // 3. Re-append all existing filenames as strings (if multiple files allowed)
      if (Array.isArray(movement.files)) {
        movement.files.forEach((filename) => {
          formData.append("files", filename); // string for already-uploaded
        });
      }

      // 4. Add new file object
      formData.append("files", file);

      // 5. PATCH update
      await pb.collection("trolley_movements").update(movementID, formData);
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      toast.success("Uploaded!");
      setFile(null);
      onUploaded?.();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-2 py-1 rounded"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
};

export default MovementFileUpload;

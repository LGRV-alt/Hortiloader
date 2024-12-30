import React, { useEffect, useState } from "react";
import Modal from "react-modal"; // Import Modal
import pb from "./lib/pocketbase";
Modal.setAppElement("#root"); // Ensure accessibility

const Pictures = ({ taskID }) => {
  const [pictures, setPictures] = useState([]);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [error, setError] = useState("");
  const id = taskID;

  console.log(id);

  useEffect(() => {
    const fetchPictures = async (projectID) => {
      try {
        const records = await pb
          .collection("files")
          .getList(1, 50, { filter: `taskID = "${projectID}"` }); // Fetch up to 50 pictures
        //   .getList(1, 50); // Fetch up to 50 pictures
        setPictures(records.items);
      } catch (err) {
        console.error("Error fetching pictures:", err);
        // setError("Failed to load pictures.");
      }
    };

    fetchPictures(id);
  }, []);

  const openModal = (picture) => {
    setSelectedPicture(picture);
  };

  const closeModal = () => {
    setSelectedPicture(null);
  };

  const deleteFile = async (fileId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this file?"
    );
    if (!confirmed) return;

    try {
      await pb.collection("files").delete(fileId);
      setPictures((prevFiles) =>
        prevFiles.filter((file) => file.id !== fileId)
      );
      alert("File deleted successfully.");
      closeModal();
    } catch (err) {
      console.error("Error deleting file:", err);
      alert("Failed to delete the file.");
    }
  };

  return (
    <div>
      <h2>Picture Gallery</h2>
      {error && <p>{error}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {pictures.map((picture) => (
          <div key={picture.id} style={{ textAlign: "center" }}>
            <img
              src={`${pb.baseUrl}/api/files/${picture.collectionId}/${picture.id}/${picture.file}`}
              alt={picture.title || "Uploaded image"}
              style={{ maxWidth: "200px", height: "auto", cursor: "pointer" }}
              onClick={() => openModal(picture)}
            />
            <p>{picture.title}</p>
          </div>
        ))}
      </div>

      {/* Modal for Enlarged Image */}
      {selectedPicture && (
        <Modal
          isOpen={!!selectedPicture}
          onRequestClose={closeModal}
          contentLabel="Enlarged Image"
          style={{
            overlay: { backgroundColor: "rgba(0, 0, 0, 0.7)" },
            content: {
              maxWidth: "600px",
              margin: "auto",
              borderRadius: "10px",
              textAlign: "center",
            },
          }}
        >
          <img
            src={`${pb.baseUrl}/api/files/${selectedPicture.collectionId}/${selectedPicture.id}/${selectedPicture.file}`}
            alt={selectedPicture.title || "Uploaded image"}
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <p>{selectedPicture.title}</p>
          <button onClick={closeModal} style={{ marginTop: "10px" }}>
            Close
          </button>
          <button onClick={() => deleteFile(selectedPicture.id)}>Delete</button>
        </Modal>
      )}
    </div>
  );
};

export default Pictures;

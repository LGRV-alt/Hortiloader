import React, { useEffect, useState } from "react";
import Modal from "react-modal"; // Import Modal
import pb from "./lib/pocketbase";
Modal.setAppElement("#root"); // Ensure accessibility

const Pictures = () => {
  const [pictures, setPictures] = useState([]);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPictures = async (projectID) => {
      try {
        const records = await pb
          .collection("files")
          .getList(1, 50, { filter: `taskID = "${projectID}"` }); // Fetch up to 50 pictures
        setPictures(records.items);
      } catch (err) {
        console.error("Error fetching pictures:", err);
        setError("Failed to load pictures.");
      }
    };

    fetchPictures("ntysa1l7cpjxick");
  }, []);

  //   const fetchProjectFiles = async (projectId) => {
  //     const files = await pb.collection("files").getFullList(1, 50, {
  //       filter: `project.id = "${projectId}"`,
  //     });
  //     console.log(files);
  //   };

  const openModal = (picture) => {
    setSelectedPicture(picture);
  };

  const closeModal = () => {
    setSelectedPicture(null);
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
        </Modal>
      )}
    </div>
  );
};

export default Pictures;

import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import pb from "./lib/pbConnect";

Modal.setAppElement("#root");

const Pictures = ({ taskID }) => {
  const [pictures, setPictures] = useState([]);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [error, setError] = useState("");
  const id = taskID;

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
      {error && <p>{error}</p>}
      <div className="flex justify-center gap-2 flex-wrap">
        {pictures.map((picture) => (
          <div
            className="text-center border-4 border-white hover:border-orange-600 hover:bg-gray-200 bg-white rounded-lg p-2 "
            key={picture.id}
          >
            <p className="text-lg border-b-2  border-black text-center mb-2">
              {picture.title}
            </p>
            <img
              src={`${pb.baseUrl}/api/files/${picture.collectionId}/${picture.id}/${picture.file}`}
              alt={picture.title || "Uploaded image"}
              style={{ maxWidth: "200px", height: "auto", cursor: "pointer" }}
              onClick={() => openModal(picture)}
            />
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
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
            content: {
              // backgroundColor: "rgb(2 6 23)",
              backgroundColor: "white",
              maxWidth: "800px",
              margin: "auto",
              borderRadius: "10px",
              textAlign: "center",
            },
          }}
          // isOpen={!!selectedPicture}
          // onRequestClose={closeModal}
          // overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
          // className="fixed inset-0 bg-white p-6 flex flex-col justify-between max-h-dvh overflow-y-auto"
        >
          <div className="bg-slate-700 border-black border-4 p-4 rounded-3xl mb-1">
            <p className="text-xl md:text-4xl pb-3 font-bold text-white ">
              {selectedPicture.title.toUpperCase()}
            </p>
            <div className="flex justify-center items-center">
              <button
                className="bg-black text-white py-2 px-4 rounded-md m-1  hover:bg-white hover:text-black transition-all hover:outline w-full "
                onClick={closeModal}
              >
                Close
              </button>
              <button
                className="bg-red-600 text-white py-2 px-4 rounded-md m-1 hover:bg-red-800 transition-all hover:outline hover:outline-red-900 w-1/2 md:w-1/4"
                onClick={() => deleteFile(selectedPicture.id)}
              >
                Delete
              </button>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <img
              src={`${pb.baseUrl}/api/files/${selectedPicture.collectionId}/${selectedPicture.id}/${selectedPicture.file}`}
              alt={selectedPicture.title || "Uploaded image"}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Pictures;

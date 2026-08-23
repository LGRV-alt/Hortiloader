import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import pb from "../api/pbConnect";
import toast from "react-hot-toast";
import { AiFillFilePdf, AiFillFileImage, AiFillFile } from "react-icons/ai";

Modal.setAppElement("#root");

const isPdfFile = (filename) => filename.toLowerCase().endsWith(".pdf");
const isImageFile = (filename) =>
  /\.(jpe?g|png|gif|webp|svg|bmp)$/i.test(filename);

const getFileUrl = (file) =>
  `${pb.baseUrl}/api/files/${file.collectionId}/${file.id}/${file.file}`;

const Pictures = ({ taskID, pictures, setPictures }) => {
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pictureToDelete, setPictureToDelete] = useState(null);
  const [error, setError] = useState("");
  const id = taskID;

  useEffect(() => {
    const fetchPictures = async (projectID) => {
      try {
        const records = await pb
          .collection("files")
          .getList(1, 50, { filter: `taskID = "${projectID}"` });
        setPictures(records.items);
      } catch (err) {
        console.error("Error fetching pictures:", err);
      }
    };

    fetchPictures(id);
  }, [id, setPictures]);

  const role = pb.authStore.record.role;

  const openModal = (picture) => {
    setSelectedPicture(picture);
  };

  const closeModal = () => {
    setSelectedPicture(null);
  };

  const handleDeleteConfirmed = async () => {
    if (!pictureToDelete) return;

    try {
      await pb.collection("files").delete(pictureToDelete.id);
      setPictures((prev) =>
        prev.filter((file) => file.id !== pictureToDelete.id),
      );
      toast.success("File deleted successfully.");
      setShowDeleteModal(false);
      setPictureToDelete(null);
      setSelectedPicture(null);
    } catch (err) {
      console.error("Error deleting file:", err);
      toast.error("Failed to delete the file.");
    }
  };

  const confirmDelete = (picture) => {
    setPictureToDelete(picture);
    setShowDeleteModal(true);
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <div className="flex justify-center gap-2 flex-wrap pt-2">
        {pictures.map((picture) => {
          const isPDF = isPdfFile(picture.file);
          const isImage = isImageFile(picture.file);
          return (
            <div
              className="h-16 p-2 flex flex-col justify-center items-center text-center border-2 gap-1 bg-gray-100 dark:border-darkBorder dark:bg-slate-800 hover:border-secondary-colour rounded-lg"
              key={picture.id}
              style={{ width: "150px", minHeight: "150px" }}
            >
              <p className="md:text-lg capitalize w-full text-center">
                {picture.title}
              </p>
              <div
                onClick={() => openModal(picture)}
                style={{
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  backgroundColor: "#f3f4f6",
                  cursor: "pointer",
                }}
              >
                {isPDF ? (
                  <AiFillFilePdf size={32} color="#d32f2f" />
                ) : isImage ? (
                  <AiFillFileImage size={32} color="#2563eb" />
                ) : (
                  <AiFillFile size={32} color="#6b7280" />
                )}
              </div>
              {role !== "viewer" && (
                <button
                  className="bg-red-600 w-full text-sm text-white font-semibold hover:bg-red-500"
                  onClick={() => confirmDelete(picture)}
                >
                  Delete
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal for Enlarged Image or PDF */}
      {selectedPicture && (
        <Modal
          isOpen={!!selectedPicture}
          onRequestClose={closeModal}
          contentLabel="Enlarged View"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.85)",
            },
            content: {
              padding: 0,
              inset: "10% 15% 2% 15%",
              border: "none",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              backgroundColor: "black",
            },
          }}
        >
          <div className="flex justify-between items-center p-2 bg-black bg-opacity-70 z-10">
            <p className="text-white font-bold text-lg truncate">
              {selectedPicture.title.toUpperCase()}
            </p>
            <div className="flex gap-2">
              <button
                className="bg-white text-black px-4 py-1 rounded hover:bg-gray-200"
                onClick={closeModal}
              >
                Close
              </button>
              {role !== "viwer" && (
                <button
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-800"
                  onClick={() => confirmDelete(selectedPicture)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
          <div className="flex-grow overflow-auto">
            {isPdfFile(selectedPicture.file) ? (
              <iframe
                src={getFileUrl(selectedPicture)}
                title="PDF Viewer"
                className="w-full h-full bg-white"
              ></iframe>
            ) : isImageFile(selectedPicture.file) ? (
              <img
                src={getFileUrl(selectedPicture)}
                alt={selectedPicture.title || "Uploaded image"}
                className="w-full h-full object-contain bg-black"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white gap-4">
                <AiFillFile size={80} color="#9ca3af" />
                <a
                  href={getFileUrl(selectedPicture)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 underline"
                >
                  Open {selectedPicture.title}
                </a>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onRequestClose={() => setShowDeleteModal(false)}
          contentLabel="Confirm Delete"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            content: {
              position: "static",
              inset: "auto",
              width: "90%",
              maxWidth: "400px",
              padding: "2rem",
              borderRadius: "12px",
              backgroundColor: "white",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              border: "none",
              textAlign: "center",
            },
          }}
        >
          <h2 className="text-xl mb-4 font-bold text-red-600">
            Confirm Delete
          </h2>
          <p className="mb-4">Are you sure you want to delete this file?</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirmed}
              className="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Pictures;

/* eslint-disable react/prop-types */
/* eslint-disable no-undef */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// -----------------Maybe add this in later--------------
import Pictures from "../Components/Pictures";
import FileUpload from "../Components/FileUpload";
// ------------------------------------------------------
import toast from "react-hot-toast";
import DanishTrolleyLoader from "../Components/DanishTrolleyLoader";
import pb from "../api/pbConnect";
import { useTaskStore } from "../hooks/useTaskStore";

export default function ViewTask() {
  const [isEditing, setIsEditing] = useState(false);
  const records = useTaskStore((state) => state.tasks);
  const optimisticDeleteTask = useTaskStore((state) => state.deleteTask);
  const optimisticUpdateTask = useTaskStore((state) => state.updateTask);
  const { id } = useParams();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(pb.authStore.record);
  const [isSaving, setIsSaving] = useState(false);
  const weekNumbers = Array.from({ length: 52 }, (_, i) => i + 1);
  const [loading, setLoading] = useState(true);

  // --------------------Form Data---------------------------
  const [title, setTitle] = useState("");
  const [day, setDay] = useState("");
  const [postcode, setPostcode] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [other, setOther] = useState("");
  const [weekNumber, setWeekNumber] = useState("");
  const [orderInfo, setOrderInfo] = useState("");
  const [status, setStatus] = useState("");
  const [year, setYear] = useState("");
  const [trollies, setTrollies] = useState("");
  const [extras, setExtras] = useState("");
  const [taskDetail, setTaskDetail] = useState(null);

  // --------------------Delete modal----------------------------
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [savingState, setSavingState] = useState("Save");
  const [pictures, setPictures] = useState([]);

  // useEffect(() => {
  //   // Stop polling when editing starts
  //   useTaskStore.getState().stopPolling();

  //   return () => {
  //     // Resume polling when editing ends
  //     useTaskStore.getState().startPolling();
  //   };
  // }, []);

  useEffect(() => {
    useTaskStore.getState().stopPolling();
    if (!id) return;
    setLoading(true);
    pb.collection("tasks")
      .getOne(id, { expand: "created_by,updated_by" })
      .then((task) => {
        setTaskDetail(task);
        // Set your form fields here as well:
        setTitle(task.title ?? "");
        setDay(task.day ?? "");
        setPostcode(task.postcode ?? "");
        setOrderNumber(task.orderNumber ?? "");
        setCustomerType(task.customerType ?? "");
        setOther(task.other ?? "");
        setWeekNumber(task.weekNumber ?? "");
        setOrderInfo(task.orderInfo ?? "");
        setStatus(task.status ?? "");
        setYear(task.year ?? "");
        setTrollies(task.trollies ?? "");
        setExtras(task.extras ?? "");
        setLoading(false);
      })
      .catch((e) => {
        toast.error("Could not load task.");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const updateUser = () => setUser(pb.authStore.record);
    updateUser();
    return pb.authStore.onChange(updateUser);
  }, []);

  useEffect(() => {
    const updateUserName = () => {
      setUserName(pb.authStore.record?.display_username?.toLowerCase() || "");
    };
    updateUserName();

    // Listen for changes and get unsubscribe function
    const unsubscribe = pb.authStore.onChange(updateUserName);

    // Cleanup
    return unsubscribe;
  }, []);

  const handleSubmit = async () => {
    if (!title) {
      toast.error("Task needs a title");
      return;
    }
    setIsSaving(true);
    setSavingState("Saving...");
    try {
      await optimisticUpdateTask(id, {
        title,
        other,
        weekNumber,
        day,
        postcode,
        orderNumber,
        customerType,
        orderInfo,
        status,
        year,
        trollies,
        extras,
        updated_by: user.id,
      });
      setSavingState("Save");
      toast.success("Order updated successfully!");
      useTaskStore.getState().startPolling();
      navigate(-1);
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error("Something went wrong while saving.");
      setSavingState("Save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deletePassword.toLowerCase() !== userName) {
      toast.error("Incorrect username.");
      return;
    }

    try {
      await optimisticDeleteTask(id);
      toast.success("Task deleted.");
      navigate(-1);
    } catch (err) {
      toast.error("Failed to delete task.");
      console.error(err);
    } finally {
      setShowDeleteModal(false);
      setDeletePassword("");
    }
  };

  const chip = {
    new: "bg-amber-100 text-amber-800 border-amber-200",
    working: "bg-purple-100 text-purple-800 border-purple-200",
    loaded: "bg-blue-100 text-blue-800 border-blue-200",
    pulled: "bg-emerald-100 text-emerald-800 border-emerald-200",
    missed: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="p-10 bg-surface grid grid-cols-[2fr_1fr] gap-4 text-sm md:text-lg h-full ">
      {/* ----------------Load Spinner --------------- */}
      {loading && (
        <div className="absolute inset-0 bg-white z-50 pt-20 flex flex-col items-center justify-center pointer-events-auto">
          <h2 className="text-xl font-bold mb-8">Fetching Data...</h2>
          <div className="relative w-full h-full overflow-hidden">
            <div className="absolute left-0  -translate-y-1/2">
              <DanishTrolleyLoader />
            </div>
          </div>
        </div>
      )}

      {/* ------------Task---------------- */}

      <div className=" shadow-lg shadow-gray-400 rounded-3xl bg-white">
        <div className="grid grid-cols-[2fr_1fr] min-h-28 rounded-t-3xl p-3 bg-regal-blue text-white">
          <div className="w-full">
            {/* Title */}

            <input
              readOnly={!isEditing}
              className={`bg-transparent capitalize truncate w-full text-base md:text-2xl font-semibold tracking-tighter ${
                isEditing
                  ? "border-b-2 border-black focus:border-secondary-colour focus:outline-none"
                  : "border-none pointer-events-none"
              }`}
              type="text"
              placeholder="Customer Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* Order Number */}
            <div className="flex items-center gap-2">
              <p>Order Number - </p>
              <input
                readOnly={!isEditing}
                className={`bg-transparent truncate text-base md:text-lg ${
                  isEditing
                    ? "border-b-2 border-black focus:border-secondary-colour focus:outline-none"
                    : "border-none pointer-events-none"
                }`}
                placeholder="Order No."
                onChange={(e) => setOrderNumber(e.target.value)}
                value={orderNumber}
                required
              />
            </div>

            {/* Customer Type */}
            <div className="flex items-center gap-2">
              <p>Customer Type - </p>
              <select
                readOnly={!isEditing}
                className={`bg-transparent truncate text-base md:text-lg appearance-none ${
                  isEditing
                    ? "border-b-2 border-black focus:border-secondary-colour focus:outline-none"
                    : "border-none pointer-events-none"
                }`}
                name="customerType"
                id="customerType"
                onChange={(e) => setCustomerType(e.target.value)}
                value={customerType}
              >
                <option value=" " disabled>
                  Customer Type
                </option>
                <option value="wholesale">Wholesale</option>
                <option value="retail">Retail</option>
                <option value="missed">Missed</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Order Number */}
            <div className="flex items-center gap-2">
              <p>Postcode - </p>
              <input
                readOnly={!isEditing}
                className={`bg-transparent truncate text-base md:text-lg uppercase ${
                  isEditing
                    ? "border-b-2 border-black focus:border-secondary-colour focus:outline-none"
                    : "border-none pointer-events-none"
                }`}
                type="text"
                placeholder="Postcode"
                onChange={(e) => setPostcode(e.target.value)}
                value={postcode}
                required
              />
            </div>
          </div>

          <div className="flex flex-col justify-start items-end gap-1 text-sm md:text-base">
            <p>Monday</p>
            <p>Week</p>
            <p>Year</p>
          </div>
        </div>

        <div className="flex min-h-48 justify-center items-center text-center">
          <p className="line-clamp-3  w-full md:px-4 text-sm md:text-base">
            Order Info here
          </p>
          <div className="text-center gap-1 flex flex-col w-full md:w-1/2 pr-1 md:px-4">
            <h5 className="text-sm tracking-tighter font-semibold">
              ORDER STATUS
            </h5>
            <span
              className={`w-2/3 md:w-1/2 self-center md:px-4 py-1 text-sm rounded-full border ${
                chip[status] || chip.new
              }`}
            >
              {status === "" ? "New" : uppercaseFirstLetter(status)}
            </span>
            {trollies !== "" && (
              <p className="font-bold text-sm text-green-500">
                {trollies} Trollies
              </p>
            )}
            {extras !== "" && (
              <p className="line-clamp-2 font-bold text-sm text-green-500">
                {extras}
              </p>
            )}
            <button onClick={() => setIsEditing(!isEditing)}>Edit</button>
          </div>
        </div>
      </div>
      {user.role !== "viewer" && (
        <div className="flex flex-col items-center w-full">
          <div className="">
            <FileUpload taskID={id} onUpload={setPictures} />
          </div>
          <Pictures taskID={id} pictures={pictures} setPictures={setPictures} />
        </div>
      )}
    </div>
  );
}

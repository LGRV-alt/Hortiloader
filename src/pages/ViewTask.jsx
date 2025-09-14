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
    new: "bg-red-300 text-red-800 border-red-200",
    working: "bg-yellow-400 text-yellow-800 border-yellow-200",
    loaded: "bg-blue-100 text-blue-800 border-blue-200",
    pulled: "bg-emerald-100 text-emerald-800 border-emerald-200",
    missed: "bg-purple-100 text-purple-800 border-purple-200",
  };

  return (
    <div className="p-10 bg-surface h-full grid grid-cols-[2fr_1fr] gap-4 text-sm md:text-lg  ">
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
      <div className="grid grid-rows-[1fr_2.5fr_0.5fr]  shadow-lg shadow-gray-400 rounded-3xl bg-white">
        {/* ------ HEADER ------ */}
        <div className="grid grid-cols-[2fr_1fr]  rounded-t-3xl p-3 bg-regal-blue text-white">
          {/* ---------------------left side of the card header-------------------------- */}
          <div className="w-full flex flex-col">
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

            {/* Postcode */}
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
          {/* --------------------right side of the card header------------------------- */}
          <div className="flex flex-col justify-start items-end ">
            <div className="text-sm md:text-lg font-semibold border-black flex gap-2">
              {/* Weekday */}
              <select
                readOnly={!isEditing}
                className={`bg-transparent capitalize appearance-none text-end ${
                  isEditing
                    ? "border-b-2 border-black focus:border-secondary-colour focus:outline-none"
                    : "border-none pointer-events-none"
                }`}
                name="day"
                id="day"
                onChange={(e) => setDay(e.target.value)}
                value={day}
              >
                <option disabled>Day</option>
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
                <option value="sunday">Sunday</option>
              </select>

              {/* Week */}
              <div className="flex gap-1">
                <p className="text-end">Week</p>
                <select
                  value={weekNumber}
                  readOnly={!isEditing}
                  className={`bg-transparent capitalize appearance-none ${
                    isEditing
                      ? "border-b-2 border-black focus:border-secondary-colour focus:outline-none"
                      : "border-none pointer-events-none"
                  }`}
                  onChange={(e) => setWeekNumber(e.target.value)}
                  name=""
                  id=""
                >
                  {weekNumbers.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <select
                value={year}
                readOnly={!isEditing}
                className={`bg-transparent capitalize appearance-none ${
                  isEditing
                    ? "border-b-2 border-black focus:border-secondary-colour focus:outline-none"
                    : "border-none pointer-events-none"
                }`}
                onChange={(e) => setYear(e.target.value)}
                name=""
                id=""
              >
                <option value="0">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>

            {/* -----data fingerprint----- */}
            <div className="text-sm ">
              <p className="capitalize">
                Created by:{" "}
                {taskDetail?.expand?.created_by?.display_username ||
                  taskDetail?.created_by}
              </p>
              <p className="capitalize">
                Updated by:{" "}
                {taskDetail?.expand?.updated_by?.display_username ||
                  taskDetail?.updated_by}
              </p>
            </div>
          </div>
        </div>
        {/* ----- Main Body ------ */}
        <div className="grid grid-cols-2 pt-20 px-2">
          <div className="w-full h-full flex-col items-center flex">
            {/* <h3 className="pb-2  font-medium  ">Additional Info</h3> */}
            <textarea
              readOnly={!isEditing}
              className={`p-2 w-4/5 h-2/3 text-center  bg-transparent border-2 border-black focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 resize-none  ${
                isEditing
                  ? "border-b-2 border-black focus:border-secondary-colour focus:outline-none"
                  : "border-none pointer-events-none appearance-none overflow-hidden"
              }`}
              type="text"
              placeholder="Issues/Load information"
              onChange={(e) => setOrderInfo(e.target.value)}
              value={orderInfo}
              required
            />
          </div>

          <div className="text-center gap-1 flex flex-col justify-start w-full h-full">
            <h5 className="text-lg tracking-wide font-bold underline">
              ORDER STATUS
            </h5>
            <span
              className={`w-2/3 font-semibold text-base md:w-auto self-center md:px-10 py-1 rounded-full border ${
                chip[status] || chip.new
              }`}
            >
              <select
                value={status === "" ? "New" : status}
                className="cursor-pointer bg-transparent text-center outline-none focus-within:text-black appearance-none "
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="new">New</option>
                <option value="working">Working</option>
                <option value="missed">Query</option>
                <option value="pulled">Pulled</option>
                <option value="loaded">Loaded</option>
              </select>
            </span>

            {/* ------trolley count----- */}
            <div className="flex items-center justify-center text-green-500 font-semibold  ">
              <input
                className={`bg-transparent w-6 text-center text-base md:text-lg  focus:outline-none"}`}
                type="text"
                placeholder="0"
                onChange={(e) => setTrollies(e.target.value)}
                value={trollies}
                required
              />
              <p className="">Trollies</p>
            </div>

            {/* -----extra items----- */}
            <div className=" text-green-500 font-semibold">
              <textarea
                className={`bg-transparent w-2/3 h-full text-center text-base md:text-lg capitalize resize-none "}`}
                type="text"
                placeholder="Extra Items"
                onChange={(e) => setExtras(e.target.value)}
                value={extras}
                required
              />
            </div>
          </div>
        </div>

        <div className=" pt-3 rounded-b-xl">
          {user.role !== "viewer" && (
            <div className="grid grid-cols-3  md:gap-8 gap-2 md:px-12">
              <button
                className="bg-orange-500 rounded-md text-white px-4 py-2 hover:bg-orange-600"
                onClick={() => setIsEditing(!isEditing)}
              >
                Edit
              </button>
              <button
                className="bg-green-500 py-2 px-4 rounded-md text-white hover:text-white  transition-all hover:outline hover:bg-green-600 "
                onClick={handleSubmit}
              >
                <p>{savingState}</p>
              </button>
              {(user?.role === "admin" || user?.role === "super-user") && (
                <button
                  className="bg-red-500 rounded-md text-white px-4 py-2 hover:bg-red-600"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <p>Delete</p>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ------Picture/File Upload-------- */}
      {user.role !== "viewer" && (
        <div className="flex flex-col items-center w-full shadow-lg shadow-gray-400 rounded-2xl bg-white">
          <div className="w-full">
            <FileUpload taskID={id} onUpload={setPictures} />
          </div>
          <Pictures taskID={id} pictures={pictures} setPictures={setPictures} />
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Confirm Delete
            </h2>
            <p className="mb-2 text-black">
              Enter username to delete this task:{" "}
              <span className="font-bold">{userName}</span>
            </p>
            <input
              type="text"
              className="w-full border px-3 py-2 mb-4 rounded text-black"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

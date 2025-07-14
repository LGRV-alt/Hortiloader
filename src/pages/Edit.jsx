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

const userName = pb.authStore.model?.username?.toLowerCase() || "";

export default function Edit() {
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

  useEffect(() => {
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
      setUserName(pb.authStore.baseModel?.username?.toLowerCase() || "");
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

  if (loading) {
    {
      return (
        <div className="relative h-full w-full overflow-hidden">
          <div className="flex justify-center mt-28 ">
            <h2 className="text-4xl font-bold">Loading...</h2>
          </div>
          <div className="absolute left-0 top-1/3 -translate-y-1/2">
            <DanishTrolleyLoader />
          </div>
        </div>
      );
    }
  } else {
    return (
      <div className="p-2 bg-surface grid grid-cols-1 gap-4 text-sm md:text-lg h-full ">
        <div className="bg-white  border-black gap-5 md:gap-10 border-2 grid md:grid-cols-2 rounded-2xl p-2">
          <div className=" flex flex-col gap-2">
            <div className="flex items-center justify-center md:justify-between gap-2 ">
              <div>
                <h2 className="text-sm md:text-2xl font-medium text-secondary">
                  Edit Order
                </h2>
                <p className="text-xs">
                  Created by:{" "}
                  {taskDetail?.expand?.created_by?.username ||
                    taskDetail?.created_by}
                </p>
                <p className="text-xs">
                  Updated by:{" "}
                  {taskDetail?.expand?.updated_by?.username ||
                    taskDetail?.updated_by}
                </p>
              </div>

              <div className="flex font-semibold gap-1 border-b-2 border-black">
                <select
                  className="text-center w-auto md:w-auto cursor-pointer bg-transparent text-input appearance-none focus:outline-none focus:border-secondary-colour placeholder:text-gray-400  focus-within:text-black"
                  name="day"
                  id="day"
                  onChange={(e) => setDay(e.target.value)}
                  value={day}
                >
                  <option disabled>Day Required</option>
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
                <p>Week</p>
                <select
                  value={weekNumber}
                  className="cursor-pointer appearance-none w-auto bg-transparent focus:text-black focus:bg-white "
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
                <select
                  value={year}
                  className="pl-2 pr-5 appearance-none cursor-pointer w-auto bg-transparent focus:text-black focus:bg-white "
                  onChange={(e) => setYear(e.target.value)}
                  name=""
                  id=""
                >
                  <option value="0">2024</option>
                  <option value="2025">2025</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col  gap-2">
              <input
                className="pl-1 bg-transparent  text-input border-b-2 focus:outline-none border-black focus:border-secondary-colour placeholder:text-gray-400"
                type="text"
                placeholder="Customer Name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <input
                className="pl-1 bg-transparent  text-input border-b-2 border-black focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 "
                type="text"
                placeholder="Postcode"
                onChange={(e) => setPostcode(e.target.value)}
                value={postcode}
                required
              />
              <input
                className="pl-1 bg-transparent text-input border-b-2 focus:outline-none border-black focus:border-secondary-colour placeholder:text-gray-400"
                type="text"
                placeholder="Order No."
                onChange={(e) => setOrderNumber(e.target.value)}
                value={orderNumber}
                required
              />

              <select
                className="cursor-pointer bg-transparent text-input border-b-2 border-black focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 focus-within:text-black"
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

              <select
                className="cursor-pointer bg-transparent text-input border-b-2 border-black focus:outline-none focus:border-secondary-colour placeholder:text-gray-400  focus-within:text-black"
                name="day"
                id="day"
                value={other}
                onChange={(e) => setOther(e.target.value)}
              >
                <option disabled>Type</option>
                <option value="none">Whiteboard</option>
                <option value="holding">Holding</option>
                <option value="collect">Collect</option>
              </select>

              <select
                value={status}
                className="cursor-pointer bg-transparent text-input border-b-2 border-black focus:outline-none focus:border-secondary-colour placeholder:text-gray-400  focus-within:text-black"
                onChange={(e) => setStatus(e.target.value)}
              >
                <option disabled value="">
                  Order Status
                </option>
                <option value="working">Working</option>
                <option value="missed">Query</option>
                <option value="pulled">Pulled</option>
                <option value="loaded">Loaded</option>
              </select>
              <input
                className="pl-1 bg-transparent text-input border-b-2 border-black focus:outline-none focus:border-secondary-colour placeholder:text-gray-400"
                type="text"
                placeholder="Trollies"
                onChange={(e) => setTrollies(e.target.value)}
                value={trollies}
                required
              />
              <input
                className="pl-1 bg-transparent text-input border-b-2  border-black focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 "
                type="text"
                placeholder="Extra Items"
                onChange={(e) => setExtras(e.target.value)}
                value={extras}
                required
              />
            </div>
            <div className="flex flex-col w-full">
              <div className="w-full flex-col items-center flex p-2">
                <h3 className="pb-2  font-medium  ">Additional Info</h3>
                <textarea
                  className=" p-2 h-32 w-full text-center  bg-transparent border-2 border-black focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 "
                  type="text"
                  placeholder="Issues/Load information"
                  onChange={(e) => setOrderInfo(e.target.value)}
                  value={orderInfo}
                  required
                />
              </div>
              {user.role !== "viewer" && (
                <div className="grid grid-cols-[4fr_1fr] items-center md:gap-8 gap-2 md:p-2">
                  <button
                    className="bg-secondary py-2 px-4 rounded-md text-white hover:text-white  transition-all hover:outline w-full"
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
          {/* -------------Right hand side------------------ */}
          {user.role !== "viewer" && (
            <div className="flex flex-col items-center w-full">
              <div className="">
                <FileUpload taskID={id} onUpload={setPictures} />
              </div>
              <Pictures
                taskID={id}
                pictures={pictures}
                setPictures={setPictures}
              />
            </div>
          )}
        </div>

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
              <div className="flex justify-end space-x-2">
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
}

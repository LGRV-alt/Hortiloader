/* eslint-disable react/prop-types */
/* eslint-disable no-undef */

import { useEffect, useState } from "react";
import { deleteTask, updateTask } from "../Components/lib/pocketbase";
import { useNavigate, useParams } from "react-router-dom";
import Pictures from "../Components/Pictures";
import FileUpload from "../Components/FileUpload";
import toast from "react-hot-toast";
import DanishTrolleyLoader from "../Components/DanishTrolleyLoader";
import pb from "../Components/lib/pbConnect";

const userName = pb.authStore.model.username.toLowerCase();

export default function Edit({ records }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const loadingState = [
    {
      title: "loading",
      day: "Monday",
      postcode: "loading",
      orderNumber: "0000",
      customerType: "Wholesale",
    },
  ];
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(loadingState);

  useEffect(() => {
    const record = records.find((r) => r.id === id) || loadingState[0];
    setSelectedRecord(record);
    setTitle(record.title);
    setDay(record.day);
    setPostcode(record.postcode);
    setOrderNumber(record.orderNumber);
    setCustomerType(record.customerType);
    setOther(record.other);
    setWeekNumber(record.weekNumber);
    setOrderInfo(record.orderInfo);
    setStatus(record.status);
    setYear(record.year);
    setTrollies(record.trollies);
    setExtras(record.extras);
  }, [records, id]);
  // Form Data
  const [title, setTitle] = useState();
  const [day, setDay] = useState();
  const [postcode, setPostcode] = useState();
  const [orderNumber, setOrderNumber] = useState();
  const [customerType, setCustomerType] = useState();
  const [other, setOther] = useState();
  const [weekNumber, setWeekNumber] = useState();
  const [orderInfo, setOrderInfo] = useState();
  const [status, setStatus] = useState();
  const [year, setYear] = useState();
  const [trollies, setTrollies] = useState();
  const [extras, setExtras] = useState();

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [savingState, setSavingState] = useState("Save");

  const weeks = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
  ];
  let weekNumbers = weeks.map((item) => {
    return (
      <option key={item} value={item}>
        {item}
      </option>
    );
  });

  const handleSubmit = async () => {
    if (!title) {
      toast.error("Task needs a title");
      return;
    }

    setIsSaving(true);
    setSavingState("Saving...");
    try {
      await updateTask(
        id,
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
        extras
      );
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

  if (records.length < 1) {
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
      <div className="p-1 bg-surface h-full md:p-8 grid grid-cols-1 gap-4 md:text-lg ">
        <div className="bg-white border-black  border-2 grid md:grid-cols-2 md:h-4/5 p-4 md:p-8 rounded-2xl ">
          <div className=" flex flex-col gap-2 w-full md:px-10">
            <div className=" flex justify-between pt-2">
              <div className="flex w-full items-center justify-between gap-2 ">
                <h2 className="text-xl md:text-2xl font-medium text-secondary">
                  Edit Order -{" "}
                </h2>{" "}
                <div className="flex font-semibold gap-1 border-b-2 border-black">
                  <select
                    className="text-center w-auto md:w-auto cursor-pointer bg-transparent text-input appearance-none focus:outline-none focus:border-secondary-colour placeholder:text-gray-400  focus-within:text-black"
                    name="day"
                    id="day"
                    onChange={(e) => setDay(e.target.value)}
                    value={day ? day : []}
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
                    {weekNumbers}
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
            </div>
            <input
              className="bg-transparent w-2/3 md:w-1/3  text-input border-b-2 focus:outline-none border-black focus:border-secondary-colour placeholder:text-gray-400"
              type="text"
              placeholder="Customer Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              className="bg-transparent w-2/3 md:w-1/3 text-input border-b-2 border-black focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 "
              type="text"
              placeholder="Postcode"
              onChange={(e) => setPostcode(e.target.value)}
              value={postcode}
              required
            />
            <input
              className="w-2/3 md:w-1/3 bg-transparent text-input border-b-2 focus:outline-none border-black focus:border-secondary-colour placeholder:text-gray-400"
              type="text"
              placeholder="Order No."
              onChange={(e) => setOrderNumber(e.target.value)}
              value={orderNumber}
              required
            />

            <select
              className="w-1/2 md:w-1/4 cursor-pointer bg-transparent text-input border-b-2 border-black focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 focus-within:text-black"
              name="customerType"
              id="customerType"
              onChange={(e) => setCustomerType(e.target.value)}
              value={customerType ? customerType : []}
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
              className="w-1/2 md:w-1/4 cursor-pointer bg-transparent text-input border-b-2 border-black focus:outline-none focus:border-secondary-colour placeholder:text-gray-400  focus-within:text-black"
              name="day"
              id="day"
              value={other ? other : []}
              onChange={(e) => setOther(e.target.value)}
            >
              <option disabled>Type</option>
              <option value="none">Whiteboard</option>
              <option value="holding">Holding</option>
              <option value="collect">Collect</option>
            </select>
          </div>
          {/* -------------Right hand side------------------ */}
          <div className="flex flex-col justify-end items-start">
            <div className="grid grid-cols-[1fr_4fr] p-1 md:p-8 w-full">
              <label className="">Status - </label>
              <select
                value={status}
                className="w-24 md:w-28 cursor-pointer bg-transparent text-input border-black focus:outline-none focus:border-secondary-colour placeholder:text-gray-400  focus-within:text-black"
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value=""></option>
                <option value="working">Working</option>
                <option value="missed">Query</option>
                <option value="pulled">Pulled</option>
                <option value="loaded">Loaded</option>
              </select>
              <label className="">Trollies - </label>
              <input
                className="pl-1 w-24 bg-transparent text-input border-b-2 border-black focus:outline-none focus:border-secondary-colour placeholder:text-gray-400"
                type="text"
                placeholder="Trollies"
                onChange={(e) => setTrollies(e.target.value)}
                value={trollies}
                required
              />
              <label className="">Extras - </label>
              <input
                className="pl-1 w-24 bg-transparent text-input border-b-2  border-black focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 "
                type="text"
                placeholder="Extras"
                onChange={(e) => setExtras(e.target.value)}
                value={extras}
                required
              />
            </div>

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
            <div className="grid grid-cols-[4fr_1fr] items-center w-full gap-8 p-2">
              <button
                className="bg-secondary py-2 px-4 rounded-md text-white hover:text-white  transition-all hover:outline w-full"
                onClick={handleSubmit}
              >
                <p>{savingState}</p>
              </button>

              <button
                className=" bg-red-500 rounded-md  text-white px-4 py-2 hover:bg-red-600"
                onClick={() => setShowDeleteModal(true)}
              >
                <p>Delete</p>
              </button>
            </div>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 grid-rows-[0.5fr_2fr] md:grid-cols-1 "></div> */}
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
                  onClick={() => {
                    if (deletePassword.toLowerCase() === userName) {
                      deleteTask(id);
                      toast.success("Task deleted.");
                      navigate(-1);
                    } else {
                      toast.error("Incorrect password.");
                    }
                    setShowDeleteModal(false);
                    setDeletePassword("");
                  }}
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

/* eslint-disable react/prop-types */
/* eslint-disable no-undef */

import { useEffect, useState } from "react";
import {
  deleteTask,
  getDateWeek,
  updateTask,
} from "../Components/lib/pocketbase";
import { useNavigate, useParams } from "react-router-dom";
import Pictures from "../Components/Pictures";
import FileUpload from "../Components/FileUpload";
const realPass = "gilmore";

export default function Edit({ records, setRefresh }) {
  const currentWeek = getDateWeek();
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
  }, [records, id]);

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

  const handleSubmit = () => {
    if (!title) {
      window.alert("Please enter a title");
      return;
    }
    navigate(-1);
    setRefresh(Math.random());
    updateTask(
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
      year
    );
  };

  const handleDelete = (id) => {
    const pass = prompt("Enter Password").toLocaleLowerCase();
    if (pass === realPass) {
      navigate(-1);
      deleteTask(id);
    } else {
      alert("Wrong Password");
    }
  };

  if (records.length < 1) {
    {
      return (
        <div className="flex justify-center items-center h-full bg-regal-blue ">
          <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />
        </div>
      );
    }
  } else {
    return (
      <div className="h-full pt-5 md:pt-16 bg-regal-blue grid grid-cols-1 grid-rows-[4.5fr] md:grid-cols-2  ">
        <div className="flex justify-center h-full pb-2 ">
          <div className="  flex flex-col  gap-2 w-full px-10 md:px-2 md:w-2/3">
            <div className="flex justify-between pt-2 ">
              <div className="flex items-center gap-2 ">
                <h2 className="text-xl md:text-2xl font-medium text-secondary-colour ">
                  Edit Order -{" "}
                </h2>{" "}
                <select
                  value={status}
                  className="cursor-pointer bg-transparent text-input text-lg  focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white focus-within:text-black"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value=""></option>
                  <option value="working">Working</option>
                  <option value="pulled">Pulled</option>
                  <option value="loaded">Loaded</option>
                  <option value="missed">Missed</option>
                </select>
              </div>
              <div className="items-center flex justify-center">
                <button
                  className="ml-1 bg-red-500 rounded-md w-12 h-7 text-white px-2 hover:bg-red-600"
                  onClick={() => handleDelete(id)}
                >
                  <span className="material-symbols-outlined">X</span>
                </button>
              </div>
            </div>
            <input
              className="pl-1 bg-transparent text-input text-lg border-b-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white"
              type="text"
              placeholder="Customer Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <label
              className=" flex justify-between w-full md:w-[250px]  pl-1 text-lg text-white"
              htmlFor=""
            >
              {" "}
              Postcode -
              <input
                className="pl-1 w-24 bg-transparent text-input text-lg border-b-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white"
                type="text"
                placeholder="Postcode"
                onChange={(e) => setPostcode(e.target.value)}
                value={postcode}
                required
              />
            </label>
            <label
              className="flex justify-between w-full md:w-[250px] pl-1 text-lg text-white"
              htmlFor=""
            >
              {" "}
              Order Number -
              <input
                className=" pl-1 w-24 bg-transparent text-input text-lg border-b-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white"
                type="text"
                placeholder="Order No."
                onChange={(e) => setOrderNumber(e.target.value)}
                value={orderNumber}
                required
              />
            </label>
            <select
              className="cursor-pointer bg-transparent text-input text-lg border-b-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white focus-within:text-black"
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
              className="cursor-pointer bg-transparent text-input text-lg border-b-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white focus-within:text-black"
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
            <select
              className="cursor-pointer bg-transparent text-input text-lg border-b-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white focus-within:text-black"
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

            {/* ----------------Week Select ------------------- */}
            <div className="flex gap-2 pl-1 text-lg text-white">
              <p>Week Number</p>
              <select
                value={weekNumber}
                className="cursor-pointer w-12 bg-transparent focus:text-black focus:bg-white  border-white border-2"
                onChange={(e) => setWeekNumber(e.target.value)}
                name=""
                id=""
              >
                {weekNumbers}
              </select>
            </div>
            {/* -------------- Year Select -------------------- */}
            <div className="flex gap-2 pl-1 text-lg text-white ">
              <p>Year</p>
              <select
                value={year}
                className="cursor-pointer w-16 bg-transparent focus:text-black focus:bg-white  border-white border-2"
                onChange={(e) => setYear(e.target.value)}
                name=""
                id=""
              >
                <option value="0">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>
            {/* -------------------- Info Section-------------------- */}
            <div className="w-full flex-col items-center flex p-2">
              <h3 className="pb-2 text-lg font-medium text-white ">
                Additional Info
              </h3>
              <textarea
                className=" p-2 w-full text-center outline bg-transparent  text-lg border-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white"
                type="text"
                placeholder="Issues/Load information"
                onChange={(e) => setOrderInfo(e.target.value)}
                value={orderInfo}
                required
              />
            </div>
            <div className="flex justify-center items-start w-full">
              <button
                className="bg-secondary-colour  text-white py-2 px-4 rounded-md m-1 hover:bg-regal-blue hover:text-secondary-colour transition-all hover:outline w-full md:w-1/2"
                onClick={handleSubmit}
              >
                <p className="">Save</p>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 grid-rows-[0.5fr_2fr] md:grid-cols-1 ">
          <div className="flex justify-center mb-4">
            <FileUpload taskID={id} setRefresh={setRefresh} />
          </div>
          <div className="pb-5">
            <Pictures taskID={id} />
          </div>
        </div>
      </div>
    );
  }
}

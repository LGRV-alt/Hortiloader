/* eslint-disable react/prop-types */
import { useState } from "react";
import { createTask, getDateWeek } from "./lib/pocketbase";

import { useNavigate } from "react-router-dom";

export default function CreateCustomer({ setRefresh }) {
  const currentWeek = getDateWeek();
  const navigate = useNavigate();

  const [title, setTitle] = useState(null);
  const [day, setDay] = useState("monday");
  const [postcode, setPostcode] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const [customerType, setCustomerType] = useState("wholesale");
  const [other, setOther] = useState("none");
  const [weekNumber, setWeekNumber] = useState(currentWeek);
  const [orderInfo, setOrderInfo] = useState("");

  const handleSubmit = () => {
    if (!title) {
      window.alert("Please enter a title");
      return;
    }
    // navigate(-1);
    setRefresh(Math.random());
    createTask(
      title,
      day,
      postcode,
      orderNumber,
      customerType,
      other,
      weekNumber,
      orderInfo
    );
  };
  return (
    <div className="flex flex-col items-center  h-full  justify-start bg-regal-blue pb-2 ">
      <div className="flex-col md:flex-row  flex gap-2 items-center">
        <h2 className="text-lg font-medium text-white ">Create Order</h2>
        <div className=" flex-col md:flex-row flex gap-2">
          <input
            className=" bg-transparent text-input text-lg border-b-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white"
            type="text"
            placeholder="Customer Name"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            className=" w-24 bg-transparent text-input text-lg border-b-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white"
            type="text"
            placeholder="Postcode"
            onChange={(e) => setPostcode(e.target.value)}
            required
          />
          <input
            className=" w-24 bg-transparent text-input text-lg border-b-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white"
            type="text"
            placeholder="Order No."
            onChange={(e) => setOrderNumber(e.target.value)}
            required
          />

          <select
            className=" bg-transparent text-input text-lg border-b-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white focus-within:text-black"
            name="customerType"
            id="customerType"
            onChange={(e) => setCustomerType(e.target.value)}
          >
            <option value="" disabled>
              Customer Type
            </option>
            <option value="wholesale">Wholesale</option>
            <option value="retail">Retail</option>
            <option value="missed">Missed</option>
            <option value="other">Other</option>
          </select>

          <select
            className=" bg-transparent text-input text-lg border-b-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white focus-within:text-black"
            name="day"
            id="day"
            onChange={(e) => setDay(e.target.value)}
          >
            <option value="" disabled>
              Day Required
            </option>
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
            <option value="saturday">Saturday</option>
            <option value="sunday">Sunday</option>
          </select>

          <select
            className=" bg-transparent text-input text-lg border-b-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white focus-within:text-black"
            name="day"
            id="day"
            onChange={(e) => setOther(e.target.value)}
          >
            <option value="" disabled>
              Type
            </option>
            <option value="none">Whiteboard</option>
            <option value="holding">Holding</option>
            <option value="collect">Collect</option>
          </select>
          <input
            className=" w-16 bg-transparent text-input text-lg border-b-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white"
            type="number"
            min={currentWeek}
            max={52}
            placeholder="Week"
            onChange={(e) => setWeekNumber(e.target.value)}
            required
          />
        </div>
        <h3 className="md:hidden pb-2 text-lg font-medium text-white ">
          Additional Info
        </h3>
        <textarea
          className="md:hidden p-2 w-full h-full text-center outline bg-transparent  text-lg border-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white"
          type="text"
          placeholder="Issues/Load information"
          onChange={(e) => setOrderInfo(e.target.value)}
          value={orderInfo}
          required
        />
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-md m-1 hover:bg-green-600 "
          onClick={handleSubmit}
        >
          <div className="">
            <p className="">Save</p>
          </div>
        </button>
      </div>
      <div className="h-full w-full p-2 flex flex-col items-center">
        <h3 className="hidden md:block pb-2 text-lg font-medium text-white ">
          Additional Info
        </h3>
        <textarea
          className="hidden md:flex p-2 w-full h-1/2 text-center outline bg-transparent  text-lg border-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white"
          type="text"
          placeholder="Issues/Load information"
          onChange={(e) => setOrderInfo(e.target.value)}
          value={orderInfo}
          required
        />
      </div>
    </div>
  );
}

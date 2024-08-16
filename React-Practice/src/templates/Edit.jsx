/* eslint-disable react/prop-types */
/* eslint-disable no-undef */

import { useState } from "react";
import { getDateWeek, updateTask } from "../Components/lib/pocketbase";
import { useNavigate, useParams } from "react-router-dom";

export default function Edit({ records, setRefresh }) {
  const currentWeek = getDateWeek();
  const { id } = useParams();
  const navigate = useNavigate();

  const selectedRecord = records.filter((record) => record.id == id);
  const [title, setTitle] = useState(selectedRecord[0].title);
  const [day, setDay] = useState(selectedRecord[0].day);
  const [postcode, setPostcode] = useState(selectedRecord[0].postcode);
  const [orderNumber, setOrderNumber] = useState(selectedRecord[0].orderNumber);
  const [customerType, setCustomerType] = useState(
    selectedRecord[0].customerType
  );
  const [other, setOther] = useState(selectedRecord[0].other);
  const [weekNumber, setWeekNumber] = useState(selectedRecord[0].weekNumber);
  const [orderInfo, setOrderInfo] = useState(selectedRecord[0].orderInfo);
  const [status, setStatus] = useState(selectedRecord[0].status);

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
      status
    );
  };

  return (
    <div className="h-full pt-5 md:pt-16 bg-regal-blue grid grid-cols-1 grid-rows-[4.5fr_6fr_1fr] md:grid-cols-2  ">
      <div className="flex justify-center h-full pb-2 ">
        <div className="  flex flex-col  gap-2 w-1/2">
          <div className="flex gap-2 pt-2">
            <h2 className="text-lg font-medium text-white ">Edit Order</h2>{" "}
            <select
              value={status}
              className=" bg-transparent text-input text-lg border-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white focus-within:text-black"
              onChange={(e) => setStatus(e.target.value)}
            >
              <option disabled>Status</option>
              <option value="working">Working</option>
              <option value="pulled">Pulled</option>
              <option value="loaded">Loaded</option>
              <option value="missed">Missed</option>
            </select>
          </div>
          <input
            className=" bg-transparent text-input text-lg border-b-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white"
            type="text"
            placeholder="Customer Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            className=" w-24 bg-transparent text-input text-lg border-b-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white"
            type="text"
            placeholder="Postcode"
            onChange={(e) => setPostcode(e.target.value)}
            value={postcode}
            required
          />
          <input
            className=" w-24 bg-transparent text-input text-lg border-b-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white"
            type="text"
            placeholder="Order No."
            onChange={(e) => setOrderNumber(e.target.value)}
            value={orderNumber}
            required
          />
          <select
            className=" bg-transparent text-input text-lg border-b-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white focus-within:text-black"
            name="customerType"
            id="customerType"
            onChange={(e) => setCustomerType(e.target.value)}
            value={customerType ? customerType : []}
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
            className=" bg-transparent text-input text-lg border-b-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white focus-within:text-black"
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
          <input
            className=" w-16 bg-transparent text-input text-lg border-b-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white"
            type="number"
            min={currentWeek}
            max={52}
            placeholder="Week"
            value={weekNumber}
            onChange={(e) => setWeekNumber(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="md:row-start-1 md:row-end-3 md:col-start-2 md:pr-10 w-full flex-col  items-center h-2/3 flex p-2">
        <h3 className="pb-2 text-lg font-medium text-white ">
          Additional Info
        </h3>
        <textarea
          className="  p-2 w-full h-full md:h-full text-center outline bg-transparent  text-lg border-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white"
          type="text"
          placeholder="Issues/Load information"
          onChange={(e) => setOrderInfo(e.target.value)}
          value={orderInfo}
          required
        />
      </div>
      <div className="flex justify-center items-start">
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-md m-1 hover:bg-green-600 w-full md:w-1/2"
          onClick={handleSubmit}
        >
          <p className="">Save</p>
        </button>
      </div>
    </div>
  );
}

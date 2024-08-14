/* eslint-disable react/prop-types */
/* eslint-disable no-undef */

import { useState } from "react";
import { getDateWeek, updateTask } from "../Components/lib/pocketbase";
import { useNavigate, useParams } from "react-router-dom";

export default function Edit({ records }) {
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

  const handleSubmit = () => {
    if (!title) {
      window.alert("Please enter a title");
      return;
    }
    navigate(-1);
    updateTask(
      id,
      title,
      other,
      weekNumber,
      day,
      postcode,
      orderNumber,
      customerType
    );
  };

  return (
    <div className="h-full grid ">
      <div className="flex h-full bg-regal-blue pb-2 ">
        <div className=" ml-10 mt-28 flex flex-col gap-2 w-1/2">
          <h2 className="text-lg font-medium text-white ">Edit Order-</h2>
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
            value={customerType}
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
            <option value={day} disabled>
              Day Required
            </option>
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
          </select>

          <select
            className=" bg-transparent text-input text-lg border-b-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white focus-within:text-black"
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
          <button
            className="bg-green-500 text-white py-2 px-4 rounded-md m-1 hover:bg-green-600 "
            onClick={handleSubmit}
          >
            <p className="">Save</p>
          </button>
        </div>
      </div>
    </div>
  );
}

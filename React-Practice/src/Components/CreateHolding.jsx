import { useState } from "react";
import { createTask, getDateWeek } from "./lib/pocketbase";

export default function CreateHolding() {
  const currentWeek = getDateWeek();
  const other = "holding";

  const [title, setTitle] = useState(null);
  const [day, setDay] = useState("monday");
  const [postcode, setPostcode] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const [customerType, setCustomerType] = useState("wholesale");
  const [weekNumber, setWeekNumber] = useState(currentWeek);
  const [orderInfo, setCustomerInfo] = useState("");

  const handleSubmit = () => {
    if (!title) {
      window.alert("Please enter a title");
      return;
    }
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
    <div className="flex flex-col justify-center items-center bg-regal-blue pb-2 ">
      <div className="flex gap-2 items-center">
        <h2 className="text-lg font-medium text-white ">Holding Order - </h2>
        <div className="flex gap-2">
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

          {/* <select
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
          </select> */}

          {/* <input
            className=" w-16 bg-transparent text-input text-lg border-b-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white"
            type="number"
            min={currentWeek}
            max={52}
            placeholder="Week"
            onChange={(e) => setWeekNumber(e.target.value)}
            required
          /> */}
        </div>
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-md m-1 hover:bg-green-600 "
          onClick={handleSubmit}
        >
          <div className="">
            <p className="">Save</p>
          </div>
        </button>
      </div>
      <div className="w-1/2 flex justify-center items-center text-white">
        <h2>Notes</h2>
        <input
          className="ml-5 w-full bg-transparent text-input text-lg border-b-2 focus:outline-none focus:border-secondary-colour placeholder:text-gray-400 text-white"
          type="text"
          placeholder="Additonal information"
          onChange={(e) => setCustomerInfo(e.target.value)}
          required
        />
      </div>
    </div>
  );
}

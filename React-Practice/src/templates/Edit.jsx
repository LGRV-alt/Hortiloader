import { useState } from "react";
import { getDateWeek, updateTask } from "../Components/lib/pocketbase";
import { useParams } from "react-router-dom";

export default function Edit() {
  const currentWeek = getDateWeek();
  const { id } = useParams();

  const [title, setTitle] = useState(null);
  //   const [day, setDay] = useState("monday");
  //   const [postcode, setPostcode] = useState(null);
  //   const [orderNumber, setOrderNumber] = useState(null);
  //   const [customerType, setCustomerType] = useState("wholesale");
  //   const [other, setOther] = useState("none");
  //   const [weekNumber, setWeekNumber] = useState(currentWeek);

  const handleSubmit = () => {
    if (!title) {
      window.alert("Please enter a title");
      return;
    }
    updateTask(id, title);
  };
  console.log(id);
  return (
    <div className="flex justify-center bg-regal-blue pb-2 ">
      <div className="flex gap-2 items-center">
        <h2 className="text-lg font-medium text-white ">Create Order-</h2>
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
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-md m-1 hover:bg-green-600 "
          onClick={handleSubmit}
        >
          <div className="">
            <p className="">Save</p>
          </div>
        </button>
      </div>
    </div>
  );
}

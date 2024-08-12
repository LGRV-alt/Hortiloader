import { useState } from "react";
import { createTask } from "./lib/pocketbase";

export default function CreateCustomer() {
  const [title, setTitle] = useState(null);
  const [day, setDay] = useState("monday");
  const [postcode, setPostcode] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const [customerType, setCustomerType] = useState("wholesale");

  const handleSubmit = () => {
    if (!title) {
      window.alert("Please enter a title");
      return;
    }
    createTask(title, day, postcode, orderNumber, customerType);
  };
  return (
    <div className="flex justify-center bg-regal-blue pb-2 ">
      <div className="flex gap-2 items-center">
        <h2 className="text-lg font-bold text-white ">Create Order-</h2>
        <div className="flex gap-2">
          <input
            className="text-input"
            type="text"
            placeholder="Customer Name"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            className="text-input "
            type="text"
            placeholder="Postcode"
            onChange={(e) => setPostcode(e.target.value)}
            required
          />
          <input
            className="text-input "
            type="text"
            placeholder="Order No."
            onChange={(e) => setOrderNumber(e.target.value)}
            required
          />

          <select
            className="outline"
            name="customerType"
            id="customerType"
            onChange={(e) => setCustomerType(e.target.value)}
          >
            <option value="wholesale">Wholesale</option>
            <option value="retail">Retail</option>
            <option value="missed">Missed</option>
            <option value="other">Other</option>
          </select>

          <select
            className="outline"
            name="day"
            id="day"
            onChange={(e) => setDay(e.target.value)}
          >
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
          </select>
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

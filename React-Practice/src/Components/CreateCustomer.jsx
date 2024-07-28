import { useState } from "react";
import { createTask } from "./lib/pocketbase";

export default function CreateCustomer() {
  const [title, setTitle] = useState(null);
  const [day, setDay] = useState("monday");
  const [postcode, setPostcode] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);

  const handleSubmit = () => {
    if (!title) {
      window.alert("Please enter a title");
      return;
    }
    createTask(title, day, postcode, orderNumber);
  };
  return (
    <div className="flex justify-center">
      <div className="flex gap-3 items-center">
        <h2 className="">Create Task</h2>
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

          <select name="day" id="day" onChange={(e) => setDay(e.target.value)}>
            <option value="monday">monday</option>
            <option value="tuesday">tuesday</option>
            <option value="wednesday">wednesday</option>
            <option value="thursday">thursday</option>
            <option value="friday">friday</option>
          </select>
        </div>
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 "
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

/* eslint-disable react/prop-types */
import { useState } from "react";
import { createTask, deleteTask } from "./lib/pocketbase";

export default function Body({ records }) {
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [date, setDate] = useState(null);
  const [day, setDay] = useState("monday");

  const filterUsersByDay = (day) => {
    // eslint-disable-next-line react/prop-types
    return records.filter((record) => record.day == day);
  };

  const monday = filterUsersByDay("monday");
  const tuesday = filterUsersByDay("tuesday");
  const wednesday = filterUsersByDay("wednesday");
  const thursday = filterUsersByDay("thursday");
  const friday = filterUsersByDay("friday");

  const handleSubmit = () => {
    if (!title) {
      window.alert("Please enter a title");
      return;
    }
    createTask(title, description, date, day);
  };
  return (
    <>
      <div className="bg-gray-500 flex flex-col">
        <div>
          <h2>Create Task</h2>
          <div className="grid gap-6 mt-4 text-base">
            <input
              className="text-input "
              type="text"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              className="text-input"
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              placeholder="Description"
            />
            <input
              className="text-input"
              onChange={(e) => setDate(e.target.value)}
              type="date"
              placeholder="Date"
            />
            <select
              name="day"
              id="day"
              onChange={(e) => setDay(e.target.value)}
            >
              <option value="monday">monday</option>
              <option value="tuesday">tuesday</option>
              <option value="wednesday">wednesday</option>
              <option value="thursday">thursday</option>
              <option value="friday">friday</option>
            </select>
          </div>
          <button
            className="bg-green-500 text-white py-2 px-4 rounded-md text-base mt-6 hover:bg-green-600"
            onClick={handleSubmit}
          >
            <div className="flex">
              <span className="material-symbols-outlined -ml-2">save</span>
              <p className="text-base ml-2">Save</p>
            </div>
          </button>

          {/* ------------------------------------------------------- */}
          <div className="grid grid-cols-[5rem_auto]">
            <div>
              <h3 className="">sidebar</h3>
            </div>
            <div className="grid grid-cols-5 border">
              <div className="border ">
                <h5>Monday</h5>
                {monday.map((record) => (
                  <div className="flex" key={record.id}>
                    <p>
                      {record.title} {record.description} {record.day}
                    </p>
                    <button
                      className="ml-4 bg-red-500 rounded-md text-white px-2 hover:bg-red-600"
                      onClick={() => deleteTask(record.id)}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
              <div>
                <h5>Tuesday</h5>
                {tuesday.map((record) => (
                  <div className="flex" key={record.id}>
                    <p>
                      {record.title} {record.description} {record.day}
                    </p>
                    <button
                      className="ml-4 bg-red-500 rounded-md text-white px-2 hover:bg-red-600"
                      onClick={() => deleteTask(record.id)}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
              <div>
                <h5>Wednesday</h5>
                {wednesday.map((record) => (
                  <div className="flex" key={record.id}>
                    <p>
                      {record.title} {record.description} {record.day}
                    </p>
                    <button
                      className="ml-4 bg-red-500 rounded-md text-white px-2 hover:bg-red-600"
                      onClick={() => deleteTask(record.id)}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
              <div>
                <h5>Thursday</h5>
                {thursday.map((record) => (
                  <div className="flex" key={record.id}>
                    <p>
                      {record.title} {record.description} {record.day}
                    </p>
                    <button
                      className="ml-4 bg-red-500 rounded-md text-white px-2 hover:bg-red-600"
                      onClick={() => deleteTask(record.id)}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
              <div>
                <h5>Friday</h5>
                {friday.map((record) => (
                  <div className="flex" key={record.id}>
                    <p>
                      {record.title} {record.description} {record.day}
                    </p>
                    <button
                      className="ml-4 bg-red-500 rounded-md text-white px-2 hover:bg-red-600"
                      onClick={() => deleteTask(record.id)}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// export default Body;

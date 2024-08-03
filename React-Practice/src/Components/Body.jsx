/* eslint-disable react/prop-types */

import { deleteTask, taskStatus } from "./lib/pocketbase";
import CreateCustomer from "./CreateCustomer";

export default function Body({ records }) {
  const filterUsersByDay = (day) => {
    // eslint-disable-next-line react/prop-types
    return records.filter((record) => record.day == day);
  };

  const monday = filterUsersByDay("monday");
  const tuesday = filterUsersByDay("tuesday");
  const wednesday = filterUsersByDay("wednesday");
  const thursday = filterUsersByDay("thursday");
  const friday = filterUsersByDay("friday");

  return (
    <div className=" flex flex-col h-full">
      <CreateCustomer></CreateCustomer>

      {/* ------------------------------------------------------- */}
      <div className="grid grid-cols-[7rem_auto] h-full">
        <div className="pl-2 h-auto">
          <h3 className="">sidebar</h3>
        </div>
        <div className="grid grid-cols-5 outline">
          <div className="border-r-2 border-black">
            <h5 className="flex justify-center pb-2">Monday</h5>
            {monday.map((record) => (
              <div className="flex justify-between px-1 pb-2" key={record.id}>
                <p>
                  {record.title} {record.postcode} {record.orderNumber}{" "}
                </p>
                <select
                  value={record.status}
                  onChange={(e) =>
                    taskStatus(record.id, record.title, e.target.value)
                  }
                >
                  <option value="pulled">Pulled</option>
                  <option value="loaded">Loaded</option>
                  <option value="sent">Sent</option>
                </select>

                <button
                  className="ml-4 bg-red-500 rounded-md text-white px-2 hover:bg-red-600"
                  onClick={() => deleteTask(record.id)}
                >
                  <span className="material-symbols-outlined">X</span>
                </button>
              </div>
            ))}
          </div>
          <div className="border-r-2 border-black">
            <h5 className="flex justify-center pb-2">Tuesday</h5>
            {tuesday.map((record) => (
              <div className="flex  justify-between px-1 pb-2" key={record.id}>
                <p>
                  {record.title} {record.postcode} {record.orderNumber}{" "}
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
          <div className="border-r-2 border-black">
            <h5 className="flex justify-center pb-2">Wednesday</h5>
            {wednesday.map((record) => (
              <div className="flex  justify-between px-1 pb-2" key={record.id}>
                <p>
                  {record.title}-{record.postcode.toUpperCase()}-
                  {record.orderNumber}
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
          <div className="border-r-2 border-black">
            <h5 className="flex justify-center pb-2">Thursday</h5>
            {thursday.map((record) => (
              <div className="flex justify-between px-1 pb-2" key={record.id}>
                <p>
                  {record.title}-{record.postcode}-{record.orderNumber}
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
            <h5 className="flex justify-center pb-2">Friday</h5>
            {friday.map((record) => (
              <div className="flex  justify-between px-1 pb-2" key={record.id}>
                <p>
                  {record.title}-{record.postcode}-{record.orderNumber}
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
  );
}

// export default Body;

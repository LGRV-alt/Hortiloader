/* eslint-disable react/prop-types */

import { deleteTask } from "./lib/pocketbase";
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
    <>
      <div className="bg-gray-500 flex flex-col">
        <div>
          <CreateCustomer></CreateCustomer>

          {/* ------------------------------------------------------- */}
          <div className="grid grid-cols-[5rem_auto] h-full">
            <div>
              <h3 className="">sidebar</h3>
            </div>
            <div className="grid grid-cols-5 border">
              <div className="border ">
                <h5>Monday</h5>
                {monday.map((record) => (
                  <div className="flex" key={record.id}>
                    <p>
                      {record.title} {record.postcode} {record.orderNumber}
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
                      {record.title} {record.postcode} {record.orderNumber}
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
              <div>
                <h5>Thursday</h5>
                {thursday.map((record) => (
                  <div className="flex" key={record.id}>
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
                <h5>Friday</h5>
                {friday.map((record) => (
                  <div className="flex" key={record.id}>
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
      </div>
    </>
  );
}

// export default Body;

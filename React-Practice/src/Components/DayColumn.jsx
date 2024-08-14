import { Link } from "react-router-dom";
import { deleteTask, taskStatus } from "./lib/pocketbase";

// eslint-disable-next-line react/prop-types
export default function DayColumn({ arr, day, route }) {
  const array = arr;

  return (
    <>
      <div className="flex flex-col justify-center items-center  border-b-2   border-black">
        <h5 className="text-lg font-bold">{day}</h5>
        <p>{route}</p>
      </div>
      {array.map((record) => (
        <div className="flex justify-between px-1 pt-2" key={record.id}>
          <div className="flex hover:outline hover:outline-red-500">
            <Link to={`/edit/${record.id}`}>
              {record.customerType === "retail" ? (
                <p className="text-blue-700">
                  {record.title} {record.postcode.toUpperCase()}{" "}
                  {record.orderNumber}{" "}
                </p>
              ) : record.customerType === "other" ? (
                <p className="text-red-500">
                  {record.title} {record.postcode.toUpperCase()}{" "}
                  {record.orderNumber}{" "}
                </p>
              ) : record.customerType === "missed" ? (
                <p className="text-fuchsia-600">
                  {record.title} {record.postcode.toUpperCase()}{" "}
                  {record.orderNumber}{" "}
                </p>
              ) : (
                <p className="">
                  {record.title} {record.postcode.toUpperCase()}{" "}
                  {record.orderNumber}{" "}
                </p>
              )}
            </Link>

            <select
              className="w-4"
              onChange={(e) =>
                taskStatus(record.id, record.title, e.target.value)
              }
            >
              <option></option>
              <option value="working">Working</option>
              <option value="pulled">Pulled</option>
              <option value="loaded">Loaded</option>
              <option value="missed">Missed</option>
            </select>
          </div>
          <div className="flex">
            {record.status === "pulled" ? (
              <p>Pulled</p>
            ) : record.status === "loaded" ? (
              <p>Loaded</p>
            ) : record.status === "working" ? (
              <p>Working</p>
            ) : record.status === "missed" ? (
              <p>Missed</p>
            ) : (
              <p></p>
            )}

            <button
              className="ml-1 bg-red-500 rounded-md text-white px-2 hover:bg-red-600"
              onClick={() => deleteTask(record.id)}
            >
              <span className="material-symbols-outlined">X</span>
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

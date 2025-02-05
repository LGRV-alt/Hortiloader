/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
// import { deleteTask } from "./lib/pocketbase";

// eslint-disable-next-line react/prop-types
export default function DayColumn({ arr, day, route, numberOfDay }) {
  const array = arr;

  return (
    <>
      <div className=" flex flex-col justify-center items-center border-b-2  md:border-b-2 border-black">
        <div className="flex items-center gap-2">
          <h5 className="text-lg font-bold">{day}</h5>

          <p className="font-bold"> {numberOfDay}</p>
        </div>
        <p>{route}</p>
      </div>
      {array.map((record) => (
        <div
          className="  flex justify-between items-center px-1 pt-1 "
          key={record.id}
        >
          <div className="flex justify-between w-full  hover:bg-slate-300  hover:border-black  transition-all">
            <Link to={`/edit/${record.id}`}>
              <a
                data-tooltip-id={`my-tooltip-${record.id}`}
                data-tooltip-content={record.orderInfo}
              >
                <Tooltip id={`my-tooltip-${record.id}`} />
                <div className="flex">
                  {record.customerType === "retail" ? (
                    <p className="text-blue-700 ">
                      {record.title} {record.postcode.toUpperCase()}{" "}
                      {record.orderNumber ? record.orderNumber : ""}{" "}
                    </p>
                  ) : record.customerType === "other" ? (
                    <p className="text-red-500 ">
                      {record.title} {record.postcode.toUpperCase()}{" "}
                      {record.orderNumber ? record.orderNumber : ""}{" "}
                    </p>
                  ) : record.customerType === "missed" ? (
                    <p className="text-fuchsia-600">
                      {record.title} {record.postcode.toUpperCase()}{" "}
                      {record.orderNumber ? record.orderNumber : ""}{" "}
                    </p>
                  ) : (
                    <p className="">
                      {record.title} {record.postcode.toUpperCase()}{" "}
                      {record.orderNumber ? record.orderNumber : ""}{" "}
                    </p>
                  )}
                </div>
              </a>
            </Link>
            <Link to={`/edit/${record.id}`}>
              <div className="pl-2 flex justify-center items-center">
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
              </div>
            </Link>

            {/* <button
              className="ml-1 bg-red-500 rounded-md text-white px-2 hover:bg-red-600"
              onClick={() => deleteTask(record.id)}
            >
              <span className="material-symbols-outlined">X</span>
            </button> */}
          </div>
        </div>
      ))}
    </>
  );
}

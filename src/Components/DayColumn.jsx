/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { FaSearchPlus } from "react-icons/fa";
import { IoCheckmarkSharp } from "react-icons/io5";
import { FaExclamation } from "react-icons/fa";
import { TiSpanner } from "react-icons/ti";
import { MdPresentToAll } from "react-icons/md";
import { useState } from "react";
// import { deleteTask } from "./lib/pocketbase";

// eslint-disable-next-line react/prop-types
export default function DayColumn({
  arr,
  day,
  route,
  numberOfDay,
  chosenWeek,
  chosenYear,
  edit,
  setCustomerList,
  customerList,
}) {
  const array = arr;

  // const handleCustomerList = (string) => {
  //   customerList.push(string);
  //   console.log(customerList);
  // };
  const handleCustomerList = (id) => {
    setCustomerList(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((itemId) => itemId !== id) // remove
          : [...prevSelected, id] // add
    );
  };

  return (
    <>
      {/* Whole column */}
      <div className="bg-neutral-200 flex flex-col justify-center items-center border-b-2  md:border-b-2 border-black">
        <div className="flex items-center gap-2 ">
          {/* Title of column */}
          <h5 className="text-lg font-bold" onClick={() => console.log(arr)}>
            {day}
          </h5>
          <p className="font-bold"> {numberOfDay}</p>
          <NavLink
            to={`weekday/${chosenYear}/${chosenWeek}/${day}/${numberOfDay}`}
          >
            <FaSearchPlus />
          </NavLink>
        </div>
        <p>{route}</p>
      </div>

      {/* Data in the column */}
      {array.map((record) => (
        <div
          className="flex justify-between items-center px-1 pt-1 "
          key={record.id}
        >
          {/* Working on this section - Toggle switch to remove linking to the edit page so the orders can be added to an array */}
          <div className="flex justify-between w-full   hover:bg-slate-300  hover:border-black  transition-all">
            {edit ? (
              <a
                className={`hover:bg-slate-300  border rounded cursor-pointer transition ${
                  customerList.includes(record.id) ? "bg-blue-200" : "bg-white"
                }`}
                data-tooltip-id={`my-tooltip-${record.id}`}
                data-tooltip-content={record.orderInfo}
                // onClick={(e) => handleCustomerList(e.target.textContent)}
                onClick={() => handleCustomerList(record.id)}
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
            ) : (
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
            )}
            {edit ? (
              ""
            ) : (
              <Link
                className="flex justify-center items-center"
                to={`/edit/${record.id}`}
              >
                <div className="flex justify-center items-center">
                  {record.status === "pulled" ? (
                    // <p>Pulled</p>
                    <IoCheckmarkSharp color="green" fontSize="1.5em" />
                  ) : record.status === "loaded" ? (
                    // <p>Loaded</p>
                    <MdPresentToAll color="green" fontSize="1.5em" />
                  ) : record.status === "working" ? (
                    // <p>Working</p>
                    <TiSpanner fontSize="1.5em" />
                  ) : record.status === "missed" ? (
                    // <p>Missed</p>
                    <FaExclamation color="red" fontSize="1em" />
                  ) : (
                    <FaExclamation color="black" fontSize="1em" />
                  )}
                </div>
              </Link>
            )}
          </div>
        </div>
      ))}
    </>
  );
}

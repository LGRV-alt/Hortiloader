/* eslint-disable react/prop-types */

// -----------------Icons------------------------
import { FaSearchPlus } from "react-icons/fa";
import { IoCheckmarkSharp } from "react-icons/io5";
import { FaExclamation } from "react-icons/fa";
import { TiSpanner } from "react-icons/ti";
import { MdOutlineQuestionMark } from "react-icons/md";
import { BiCheckDouble } from "react-icons/bi";

import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import toast from "react-hot-toast";

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
  const handleCustomerList = (id) => {
    setCustomerList((prevSelected) => {
      const isRemoving = prevSelected.includes(id);

      if (isRemoving) {
        toast.error("Order Removed");
        return prevSelected.filter((itemId) => itemId !== id); // remove
      } else {
        toast.success("Order Added");
        return [...prevSelected, id]; // add
      }
    });
  };

  // ----------------------Order Colour----------------------------
  const getCustomerTextColor = (record) => {
    if (record.other === "collect") return "text-orange-500";
    switch (record.customerType) {
      case "retail":
        return "text-blue-700";
      case "other":
        return "text-green-500";
      case "missed":
        return "text-fuchsia-600";
      default:
        return "";
    }
  };

  // -----------------------Order Symbol----------------------------
  const getStatusIcon = (status) => {
    switch (status) {
      case "pulled":
        return <IoCheckmarkSharp color="green" fontSize="1.5em" />;
      case "loaded":
        return <BiCheckDouble color="green" fontSize="1.5em" />;
      case "working":
        return <TiSpanner fontSize="1.5em" />;
      case "missed":
        return <MdOutlineQuestionMark color="red" fontSize="1.5em" />;
      default:
        return <FaExclamation color="black" fontSize="1em" />;
    }
  };

  return (
    <>
      {/* Whole column */}
      <div className="bg-[#cdd6e1] flex flex-col justify-center items-center border-b-2  md:border-b-2 border-black">
        <div className="flex items-center gap-2 ">
          {/* Title of column */}
          <h5 className="font-bold" onClick={() => console.log(arr)}>
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
      {arr.map((record) => (
        <div
          className="flex justify-between items-center px-1 pt-1 "
          key={record.id}
        >
          <div
            className={`${
              !edit && "hover:bg-slate-300"
            } flex justify-between w-full  hover:border-black  transition-all`}
          >
            {edit ? (
              <a
                className={`hover:bg-slate-300  border rounded cursor-pointer transition ${
                  customerList.includes(record.id) ? "bg-blue-200" : "bg-white"
                }`}
                data-tooltip-id={`my-tooltip-${record.id}`}
                data-tooltip-content={record.orderInfo}
                onClick={() => handleCustomerList(record.id)}
              >
                <Tooltip id={`my-tooltip-${record.id}`} />
                <div className="flex">
                  <p className={getCustomerTextColor(record)}>
                    {record.title} {record.postcode.toUpperCase()}{" "}
                    {record.orderNumber || ""}
                  </p>
                </div>
              </a>
            ) : (
              <Link
                to={`/view/${record.id}`}
                data-tooltip-id={`my-tooltip-${record.id}`}
                data-tooltip-content={record.orderInfo}
              >
                <Tooltip id={`my-tooltip-${record.id}`} />
                <div className="flex text-sm">
                  <p className={getCustomerTextColor(record)}>
                    {record.title} {record.postcode.toUpperCase()}{" "}
                    {record.orderNumber || ""}
                  </p>
                </div>
              </Link>
            )}
            {edit ? (
              ""
            ) : (
              <Link
                className="flex justify-center items-center"
                to={`/view/${record.id}`}
              >
                <div className="flex justify-center items-center">
                  {getStatusIcon(record.status)}
                </div>
              </Link>
            )}
          </div>
        </div>
      ))}
    </>
  );
}

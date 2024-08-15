/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import CreateHolding from "../Components/CreateHolding";
import { deleteTask } from "../Components/lib/pocketbase";

export default function HoldingPage({ records }) {
  const holding = records.filter((record) => record.other == "holding");
  console.log(holding);

  return (
    <div>
      <div className="hidden md:block">
        {/* <CreateHolding></CreateHolding> */}
      </div>
      <div className="flex justify-start flex-col mx-5 mt-5 ">
        {holding.map((record) => (
          <div className="flex  items-center border-b-2 mb-5" key={record.id}>
            <button
              className="mr-2 bg-red-500 rounded-md text-white px-2 hover:bg-red-600"
              onClick={() => deleteTask(record.id)}
            >
              <span className="material-symbols-outlined">X</span>
            </button>
            <Link to={`/edit/${record.id}`}>
              <div className="flex hover:text-blue-500">
                <h3 className="font-medium md:text-lg mr-2">{record.title}</h3>
                <p className="font-medium md:text-lg mr-2">
                  {record.postcode.toUpperCase()}
                </p>
                <p className="mr-2 ">{record.orderNumber}</p>
                <p className="hidden md:block">{record.orderInfo}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

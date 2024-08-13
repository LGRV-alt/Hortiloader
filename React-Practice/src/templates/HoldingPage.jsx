/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import CreateHolding from "../Components/CreateHolding";
import { deleteTask } from "../Components/lib/pocketbase";

export default function HoldingPage({ records }) {
  const holding = records.filter((record) => record.other == "holding");
  console.log(holding);

  return (
    <div>
      <CreateHolding></CreateHolding>
      <div className="flex justify-start flex-col mx-5 mt-5 ">
        {holding.map((record) => (
          <div className="flex  items-center border-b-2 mb-5" key={record.id}>
            <Link to={`/edit/${record.id}`}>
              <button className="ml-4 bg-gray-500 rounded-md text-white px-2 hover:bg-gray-600 mr-2">
                <span className="">edit</span>
              </button>
            </Link>
            <button
              className="mr-2 bg-red-500 rounded-md text-white px-2 hover:bg-red-600"
              onClick={() => deleteTask(record.id)}
            >
              <span className="material-symbols-outlined">X</span>
            </button>
            <h3 className="font-medium text-lg mr-2">{record.title}</h3>
            <p className="font-medium text-lg mr-2">
              {record.postcode.toUpperCase()}
            </p>
            <p className="mr-2">{record.orderNumber}</p>
            <p>{record.orderInfo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

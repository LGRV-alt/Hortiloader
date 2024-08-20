/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import CreateHolding from "../Components/CreateHolding";
import { deleteTask } from "../Components/lib/pocketbase";

export default function HoldingPage({ records }) {
  const holding = records.filter((record) => record.other == "holding");
  console.log(holding);
  function getDateUpdated(s) {}

  return (
    <div>
      <div className="hidden md:block">
        {/* <CreateHolding></CreateHolding> */}
      </div>
      <div className="flex justify-start flex-col mx-5 mt-5 ">
        {holding.map((record) => (
          <div
            className="flex  items-center border-b-2 border-slate-300 mb-5 "
            key={record.id}
          >
            {/* {console.log(record.updated.slice(5, 10))} */}

            <Link to={`/edit/${record.id}`}>
              <div className="flex items-center hover:text-blue-500">
                {/* <p className="mr-2">Created-{record.created.slice(5, 10)}</p> */}
                <h3 className="font-medium md:text-lg mr-2">{record.title}</h3>
                <p className="font-medium md:text-lg mr-2">
                  {record.postcode.toUpperCase()}
                </p>
                <p className=" ">
                  {record.orderNumber ? record.orderNumber : ""}
                </p>
                <p className="hidden ml-2 md:block">{record.orderInfo}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

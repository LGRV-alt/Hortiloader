/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import pb from "../api/pbConnect";

export default function HoldingPage() {
  const user = pb.authStore.record;

  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchExports = async () => {
      try {
        const records = await pb.collection("tasks").getFullList({
          sort: "-created",
          filter: `org="${user.organization}" && other="holding" && deleted = false `,
        });
        setRecords(records);
      } catch (err) {
        console.error("Error fetching exports:", err);
      }
    };

    fetchExports();
  }, []);

  return (
    <div>
      <div className="hidden md:block"></div>
      <div className="flex justify-start flex-col mx-5 mt-5 ">
        {records.length === 0 && (
          <p className="text-center text-gray-500">No results found.</p>
        )}
        {records.map((record) => (
          <div
            className="flex  items-center border-b-2 border-slate-300 mb-5 "
            key={record.id}
          >
            <Link to={`/view/${record.id}`}>
              <div className="flex items-center hover:border-black hover:border-b-2 ">
                {/* <p className="mr-2">Created-{record.created.slice(5, 10)}</p> */}
                {record.customerType === "retail" ? (
                  <p className="text-blue-700 md:text-lg mr-2 ">
                    {record.title}
                  </p>
                ) : record.customerType === "other" ? (
                  <p className="text-red-500  font-medium md:text-lg mr-2">
                    {record.title}
                  </p>
                ) : record.customerType === "missed" ? (
                  <p className="text-fuchsia-600  font-medium md:text-lg mr-2">
                    {record.title}
                  </p>
                ) : (
                  <p className="font-medium md:text-lg mr-2 ">{record.title}</p>
                )}

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

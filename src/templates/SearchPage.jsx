/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";

export default function searchPage({ records }) {
  // const holding = records.filter((record) => record.other == "holding");
  const [searchItem, setSearchItem] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    setSearchItem(e.target.value);
  };

  const filteredEntry =
    searchItem.length < 1
      ? records.filter((val) => val.title.includes("xxxxxxx"))
      : records.filter(
          (val) =>
            val.title.toLowerCase().includes(searchItem) ||
            val.orderNumber.toString().includes(searchItem)
        );

  return (
    <div>
      <div className="flex justify-start flex-col mx-5 mt-5 ">
        <input
          type="text"
          placeholder="Search here"
          onChange={handleChange}
          value={searchItem}
        />
        {filteredEntry.map((record) => (
          <div
            className="flex  items-center border-b-2 border-slate-300 mb-5 "
            key={record.id}
          >
            <Link to={`/edit/${record.id}`}>
              <div className="flex items-center hover:border-black hover:border-b-2 ">
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

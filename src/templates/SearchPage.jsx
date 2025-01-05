/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import FileUpload from "../Components/FileUpload";
import Pictures from "../Components/Pictures";

export default function searchPage({ records }) {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation(); // Get the current location
  const navigate = useNavigate();

  // Update searchTerm based on URL when on the search page
  useEffect(() => {
    if (location.pathname === "/search") {
      const params = new URLSearchParams(location.search);
      const query = params.get("q");
      if (query) {
        setSearchTerm(query);
      }
    }
  }, [location]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (location.pathname === "/search") {
      // Only update the URL if on the search page
      const params = new URLSearchParams();
      params.set("q", value);
      navigate(`?${params.toString()}`, { replace: true });
    }
  };

  const filteredEntry =
    searchTerm.length < 1
      ? records.filter((val) => val.title.includes("xxxxxxx"))
      : records.filter(
          (val) =>
            val.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            val.orderNumber.toString().includes(searchTerm)
        );

  function compare(a, b) {
    if (a.weekNumber > b.weekNumber) {
      return -1;
    }
    if (a.weekNumberk < b.weekNumber) {
      return 1;
    }
    return 0;
  }

  filteredEntry.sort(compare);

  return (
    <div>
      <div className="flex justify-start flex-col md:mx-24 mt-5">
        <div className="flex justify-center items-center w-full border-b-4 pb-4 border-black mb-4">
          <p className="text-xl pr-2">Search -</p>
          <input
            className=" text-xl border-2 w-1/2 p-2 rounded-xl border-black"
            type="text"
            placeholder="Enter details"
            onChange={handleChange}
            value={searchTerm}
          />
        </div>

        {filteredEntry.map((record) => (
          <div
            className="flex pl-2  items-center border-b-2 border-slate-300 mb-5 "
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

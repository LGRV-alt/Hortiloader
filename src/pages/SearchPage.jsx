/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import pb from "../api/pbConnect";
import toast from "react-hot-toast";

export default function SearchPage() {
  const user = pb.authStore.record;

  const [records, setRecords] = useState([]);
  const [searching, setSearching] = useState(false);

  async function searchData() {
    // e.preventDefault();
    if (searchTerm.length === 0) {
      toast.error("Please enter search term");
      return;
    }
    setSearching(true);
    try {
      const records = await pb.collection("tasks").getFullList({
        sort: "-created",
        filter: `org="${user.organization}" && (title~"${searchTerm}" || orderInfo~"${searchTerm}" || postcode~"${searchTerm}" || orderNumber~"${searchTerm}") `,
      });
      setRecords(records);
      setSearching(false);
      records.length === 0 ? toast.error("No Results Found") : "";
    } catch (err) {
      console.error("Error fetching exports:", err);
      setSearching(false);
    }
  }

  const [searchTerm, setSearchTerm] = useState("");
  // const location = useLocation();
  // const navigate = useNavigate();

  console.log(records);
  console.log(searchTerm);

  // Update searchTerm based on URL when on the search page
  // useEffect(() => {
  //   if (location.pathname === "/search") {
  //     const params = new URLSearchParams(location.search);
  //     const query = params.get("q");
  //     if (query) {
  //       setSearchTerm(query);
  //       searchData();
  //     }
  //   }
  // }, []);

  // const handleChange = (e) => {
  //   const value = e.target.value;
  //   setSearchTerm(value);

  //   if (location.pathname === "/search") {
  //     // Only update the URL if on the search page
  //     const params = new URLSearchParams();
  //     params.set("q", value);
  //     navigate(`?${params.toString()}`, { replace: true });
  //   }
  // };

  return (
    <div className="bg-surface h-full pt-5">
      <div className="flex justify-start flex-col mx-8  ">
        <p className="text-center text-gray-500 pb-4">
          Search details such as name, postcode, order number or any information
          saved within the order.
        </p>
        <form
          action=""
          className="gap-1 flex justify-center items-center w-full border-b-2 pb-4 border-black mb-4"
        >
          {/* <p className="text-xl pr-2">Search -</p> */}
          <input
            className=" text-xl bg-gray-300 w-1/2 p-3 rounded "
            type="text"
            placeholder="Enter details"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="py-2 w-40 bg-green-600 justify-center  rounded hover:bg-green-700 flex text-white"
            type="submit"
            onClick={() => searchData()}
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </form>
        <div className="grid grid-cols-2 gap-2">
          {records.map((record) => (
            <Link key={record.id} to={`/edit/${record.id}`}>
              <div className=" rounded-3xl bg-white h-60 hover:bg-red-300">
                <div className="flex rounded-t-3xl p-3 bg-gray-300 flex-col">
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
                    <p className="font-medium md:text-lg mr-2 ">
                      {record.title}
                    </p>
                  )}

                  <p className="font-medium md:text-lg mr-2">
                    {record.postcode ? record.postcode.toUpperCase() : ""}
                  </p>
                  <p className=" ">
                    {record.orderNumber ? record.orderNumber : ""}
                  </p>
                </div>
                <p className="hidden ml-2 md:block">{record.orderInfo}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

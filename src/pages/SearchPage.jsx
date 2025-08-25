/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import pb from "../api/pbConnect";
import toast from "react-hot-toast";

export default function SearchPage() {
  const user = pb.authStore.record;

  const [records, setRecords] = useState([]);
  const [searching, setSearching] = useState(false);

  const chip = {
    new: "bg-amber-100 text-amber-800 border-amber-200",
    working: "bg-purple-100 text-purple-800 border-purple-200",
    loaded: "bg-blue-100 text-blue-800 border-blue-200",
    pulled: "bg-emerald-100 text-emerald-800 border-emerald-200",
    missed: "bg-red-100 text-red-800 border-red-200",
  };

  async function searchData(e) {
    e.preventDefault();
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

  function uppercaseFirstLetter(string) {
    let newString = [];
    newString = string.split("");
    newString.splice(0, 1, newString[0].toUpperCase());
    return newString.join("");
  }

  return (
    <div className="bg-gray-200 h-full pt-5">
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
            className="w-full text-base md:text-xl bg-white outline md:w-1/2 p-2 rounded-xl pl-5 "
            type="text"
            placeholder="Enter details"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="text-sm md:text-base py-2 w-28 md:w-40 bg-green-600 justify-center  rounded hover:bg-green-700 flex text-white"
            type="submit"
            onClick={(e) => searchData(e)}
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </form>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-10">
          {records.map((record) => (
            <Link key={record.id} to={`/edit/${record.id}`}>
              <div className="shadow-lg shadow-gray-400 rounded-3xl bg-white hover:outline hover:outline-black">
                <div className="grid grid-cols-[2fr_1fr] min-h-28 rounded-t-3xl p-3 bg-regal-blue text-white">
                  <div>
                    <h4 className="truncate w-5/6 text-base md:text-2xl font-semibold tracking-tighter">
                      {uppercaseFirstLetter(record.title)}
                    </h4>
                    <p className="text-sm md:text-lg font-semibold">
                      {record.orderNumber ? record.orderNumber : ""}
                    </p>
                    <p className="text-sm md:text-lg font-semibold">
                      {uppercaseFirstLetter(record.customerType)}
                    </p>

                    <p className="text-sm md:text-sm text-gray-100">
                      {record.postcode !== "" && record.postcode.toUpperCase()}
                    </p>
                  </div>

                  <div className="flex flex-col justify-start items-end gap-1 text-sm md:text-base">
                    <p>{uppercaseFirstLetter(record.day[0])}</p>
                    <p>Week {record.weekNumber}</p>
                    <p>{record.year === 0 ? "2024" : record.year}</p>
                  </div>
                </div>

                <div className="flex min-h-48 justify-center items-center text-center">
                  <p className="line-clamp-3  w-full md:px-4 text-sm md:text-base">
                    {record.orderInfo}
                  </p>
                  <div className="text-center gap-1 flex flex-col w-full md:w-1/2 pr-1 md:px-4">
                    <h5 className="text-sm tracking-tighter font-semibold">
                      ORDER STATUS
                    </h5>
                    <span
                      className={`w-2/3 md:w-1/2 self-center md:px-4 py-1 text-sm rounded-full border ${
                        chip[record.status] || chip.new
                      }`}
                    >
                      {record.status === ""
                        ? "New"
                        : uppercaseFirstLetter(record.status)}
                    </span>
                    {record.trollies !== "" && (
                      <p className="font-bold text-sm text-green-500">
                        {record.trollies} Trollies
                      </p>
                    )}
                    {record.extras !== "" && (
                      <p className="line-clamp-2 font-bold text-sm text-green-500">
                        {record.extras}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

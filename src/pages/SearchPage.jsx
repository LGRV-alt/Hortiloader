// /* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import {
  Link,
  useNavigate,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import pb from "../api/pbConnect";
import toast from "react-hot-toast";

export default function SearchPage() {
  const user = pb.authStore.record;
  const navigate = useNavigate();
  const location = useLocation();

  const navType = useNavigationType();
  const lastSearchedRef = useRef("");

  const [records, setRecords] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const chip = {
    new: "bg-amber-100 text-amber-800 border-amber-200",
    working: "bg-purple-100 text-purple-800 border-purple-200",
    loaded: "bg-blue-100 text-blue-800 border-blue-200",
    pulled: "bg-emerald-100 text-emerald-800 border-emerald-200",
    missed: "bg-red-100 text-red-800 border-red-200",
  };

  // async function searchData(e) {
  //   e.preventDefault();
  //   if (searchTerm.length === 0) {
  //     toast.error("Please enter search term");
  //     return;
  //   }
  //   setSearching(true);
  //   try {
  //     const records = await pb.collection("tasks").getFullList({
  //       sort: "-created",
  //       filter: `org="${user.organization}" && (title~"${searchTerm}" || orderInfo~"${searchTerm}" || postcode~"${searchTerm}" || orderNumber~"${searchTerm}") `,
  //     });
  //     setRecords(records);
  //     setSearching(false);
  //     records.length === 0 ? toast.error("No Results Found") : "";
  //   } catch (err) {
  //     console.error("Error fetching exports:", err);
  //     setSearching(false);
  //   }
  // }

  // function uppercaseFirstLetter(string) {
  //   let newString = [];
  //   newString = string.split("");
  //   newString.splice(0, 1, newString[0].toUpperCase());
  //   return newString.join("");
  // }

  // Read ?q= from the URL to populate the input (no auto-search)
  useEffect(() => {
    if (navType !== "POP") return; // only when coming back/forward
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";

    setSearchTerm(q); // keep the input in sync

    // If there’s a query and we don’t already have results for it, fetch them.
    if (q && (records.length === 0 || lastSearchedRef.current !== q)) {
      runSearch(q);
    }
    if (!q) setRecords([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navType, location.search]);

  // escape quotes for PocketBase filter
  const esc = (s = "") => String(s).replace(/(["\\])/g, "\\$1");

  async function runSearch(term) {
    if (!term.trim()) {
      toast.error("Please enter search term");
      return;
    }
    if (!user?.organization) {
      toast.error("You must be signed in to search");
      return;
    }

    setSearching(true);
    try {
      const q = esc(term);
      const list = await pb.collection("tasks").getFullList({
        sort: "-created",
        filter: `org="${esc(
          user.organization
        )}" && (title~"${q}" || orderInfo~"${q}" || postcode~"${q}" || orderNumber~"${q}")`,
      });
      setRecords(list);
      lastSearchedRef.current = term;
      if (list.length === 0) toast("No Results Found", { icon: "🧐" });
    } catch (err) {
      console.error("Search error:", err);
      toast.error("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  }

  // Submit handler: update URL and then run the search
  function onSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (searchTerm) params.set("q", searchTerm);
    else params.delete("q");
    navigate({ search: params.toString() }, { replace: false }); // keep history
    runSearch(searchTerm);
  }

  // Optional: clear input + URL + results
  function onClear() {
    setSearchTerm("");
    setRecords([]);
    const params = new URLSearchParams(location.search);
    params.delete("q");
    navigate({ search: params.toString() }, { replace: true });
  }

  function uppercaseFirstLetter(string = "") {
    return string ? string[0].toUpperCase() + string.slice(1) : "";
    // your original version also works
  }

  return (
    <div className="bg-gray-200 h-full pt-5 scroll-smooth">
      <div className="flex justify-start flex-col mx-8  ">
        <p className="text-center text-gray-500 pb-4">
          Search details such as name, postcode, order number or any information
          saved within the order.
        </p>
        <form
          action=""
          className="gap-1 flex justify-center items-center w-full border-b-2 pb-4 border-black mb-4"
          onSubmit={onSubmit}
        >
          {/* <p className="text-xl pr-2">Search -</p> */}
          <input
            className="w-full text-base md:text-xl bg-white outline md:w-1/2 p-2 rounded-xl pl-5 "
            type="text"
            placeholder="Enter details"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // If you *strictly* want click-only (disable Enter), uncomment:
            // onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
          />
          <button
            className="text-sm md:text-base py-2 w-28 md:w-40 bg-green-600 justify-center  rounded hover:bg-green-700 flex text-white"
            type="submit"
            disabled={searching}
            // onClick={(e) => searchData(e)}
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </form>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-10">
          {records.map((record) => (
            <Link key={record.id} to={`/view/${record.id}`}>
              <div className=" shadow-lg shadow-gray-400 rounded-3xl bg-white hover:outline hover:outline-black">
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
                    <p className="capitalize">
                      {record.other === "none" ? "Whiteboard" : record.other}
                    </p>
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

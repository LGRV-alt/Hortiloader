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

const STATUS_OPTIONS = ["working", "loaded", "pulled", "missed"];

const chip = {
  new: "bg-amber-100 text-amber-800 border-amber-200",
  working: "bg-purple-100 text-purple-800 border-purple-200",
  loaded: "bg-blue-100 text-blue-800 border-blue-200",
  pulled: "bg-emerald-100 text-emerald-800 border-emerald-200",
  missed: "bg-red-100 text-red-800 border-red-200",
};

// escape quotes/backslashes for PocketBase filter strings
const esc = (s = "") => String(s).replace(/(["\\])/g, "\\$1");

function getISOWeekYear(date = new Date()) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  const year = d.getUTCFullYear();
  return { week, year };
}

// Build the PB filter from EXPLICIT inputs (no reliance on stale state)
function buildFilter({ org, term, segment, statuses, datePreset }) {
  const parts = [`org="${esc(org)}"`, `deleted=false`];

  if (term && term.trim()) {
    const q = esc(term.trim());
    if (segment === "title") parts.push(`title~"${q}"`);
    else if (segment === "orderNumber") parts.push(`orderNumber~"${q}"`);
    else if (segment === "postcode") parts.push(`postcode~"${q}"`);
    else if (segment === "orderInfo") parts.push(`orderInfo~"${q}"`);
    else
      parts.push(
        `(title~"${q}" || orderInfo~"${q}" || postcode~"${q}" || orderNumber~"${q}")`
      );
  }

  if (Array.isArray(statuses) && statuses.length) {
    parts.push(`(${statuses.map((s) => `status="${esc(s)}"`).join(" || ")})`);
  }

  if (datePreset === "week") {
    const { week, year } = getISOWeekYear(new Date());
    parts.push(`weekNumber=${week} && year=${year}`);
  }

  return parts.join(" && ");
}

// URL helpers
function parseUrl(search) {
  const params = new URLSearchParams(search);
  const q = params.get("q") || "";
  const seg = params.get("seg") || "all"; // all | title | orderNumber | postcode | orderInfo
  const date = params.get("date") || "any"; // any | week
  const statusRaw = params.get("status") || ""; // comma list
  const statuses = statusRaw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => STATUS_OPTIONS.includes(s));
  return { q, seg, date, statuses };
}

function writeUrl(existingSearch, { q, seg, statuses, date }) {
  const params = new URLSearchParams(existingSearch);
  if (q) params.set("q", q);
  else params.delete("q");

  if (seg && seg !== "all") params.set("seg", seg);
  else params.delete("seg");

  if (Array.isArray(statuses) && statuses.length)
    params.set("status", statuses.join(","));
  else params.delete("status");

  if (date && date !== "any") params.set("date", date);
  else params.delete("date");

  return `?${params.toString()}`;
}

export default function SearchPage() {
  const user = pb?.authStore?.record;
  const navigate = useNavigate();
  const location = useLocation();
  const navType = useNavigationType();
  const lastSearchedRef = useRef("");

  const [records, setRecords] = useState([]);
  const [searching, setSearching] = useState(false);

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [segment, setSegment] = useState("all");
  const [statuses, setStatuses] = useState([]);
  const [datePreset, setDatePreset] = useState("any"); // any | week

  const showEmpty =
    !searching &&
    lastSearchedRef.current && // only after a real submit
    searchTerm === lastSearchedRef.current && // hide while typing
    records.length === 0;

  const lastSearch = useRef({
    term: "",
    seg: "all",
    statuses: [],
    date: "any",
  });

  // INITIAL mount: hydrate inputs from URL only (no auto-search)
  useEffect(() => {
    const { q, seg, date, statuses: st } = parseUrl(location.search);
    setSearchTerm(q);
    setSegment(seg);
    setStatuses(st);
    setDatePreset(date === "week" ? "week" : "any");
    // no search here on purpose
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // POP (back/forward): restore from URL and RUN the search with EXPLICIT inputs
  useEffect(() => {
    if (navType !== "POP") return;
    const { q, seg, date, statuses: st } = parseUrl(location.search);

    setSearchTerm(q);
    setSegment(seg);
    setStatuses(st);
    setDatePreset(date);

    if (q) {
      lastSearchedRef.current = q;
      runSearch({
        term: q,
        seg,
        statuses: st,
        datePreset: date,
      });
    } else {
      setRecords([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navType, location.search]);

  async function runSearch({ term, seg, statuses: st, datePreset: dp }) {
    if (!term || !term.trim()) {
      toast.error("Please enter search term");
      return;
    }
    if (!user?.organization) {
      toast.error("You must be signed in to search");
      return;
    }
    lastSearch.current = { term, seg, statuses, date: datePreset };

    const filter = buildFilter({
      org: user.organization,
      term,
      segment: seg ?? segment,
      statuses: st ?? statuses,
      datePreset: dp ?? (datePreset === "week" ? "week" : "any"),
    });

    setSearching(true);
    try {
      const list = await pb.collection("tasks").getFullList({
        sort: "-created",
        filter,
      });
      setRecords(list);
      lastSearchedRef.current = term;
      if (list.length === 0) toast("No Results Found");
    } catch (err) {
      console.error("Search error:", err);
      toast.error("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  }

  // Submit: write URL with all filters, then search using explicit inputs
  function onSubmit(e) {
    e.preventDefault();
    lastSearchedRef.current = searchTerm;
    const nextSearch = writeUrl(location.search, {
      q: searchTerm,
      seg: segment,
      statuses,
      date: datePreset,
    });
    navigate({ search: nextSearch }, { replace: false });

    runSearch({
      term: searchTerm,
      seg: segment,
      statuses,
      datePreset,
    });
  }

  function onClear() {
    lastSearchedRef.current = "";
    setSearchTerm("");
    setStatuses([]);
    setSegment("all");
    setDatePreset("any");
    setRecords([]);
    const next = writeUrl(location.search, {
      q: "",
      seg: "all",
      statuses: [],
      date: "any",
    });
    navigate({ search: next }, { replace: true });
  }

  function uppercaseFirstLetter(string = "") {
    return string ? string[0].toUpperCase() + string.slice(1) : "";
  }

  const toggleStatus = (s) =>
    setStatuses((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  if (!user) {
    return (
      <div className="bg-gray-200 min-h-[60vh] pt-10 px-6">
        <p className="text-gray-600">
          You’re not signed in. Please log in to search orders.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 h-full pt-5 scroll-smooth">
      <div className="flex justify-start flex-col mx-8">
        <p className="text-center text-gray-500 pb-4">
          Search details such as name, postcode, order number or any information
          saved within the order.
        </p>

        {/* Segmented search + filters */}
        <form
          className="w-full border-b-2 pb-4 border-black mb-4"
          onSubmit={onSubmit}
          role="search"
          aria-label="Orders"
        >
          {/* Segments */}
          <div className="mb-2 flex flex-wrap gap-2 justify-center">
            {[
              { key: "all", label: "All" },
              { key: "title", label: "Title" },
              { key: "orderNumber", label: "Order #" },
              { key: "postcode", label: "Postcode" },
              { key: "orderInfo", label: "Notes" },
            ].map((seg) => (
              <button
                key={seg.key}
                type="button"
                aria-pressed={segment === seg.key}
                onClick={() => setSegment(seg.key)}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  segment === seg.key
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {seg.label}
              </button>
            ))}
          </div>

          {/* Search row */}
          <div className="gap-2 flex justify-center items-center">
            <input
              className="w-full text-base md:text-xl bg-white md:w-1/2 p-2 rounded-xl pl-5"
              type="text"
              placeholder="Enter details"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="text-sm md:text-base py-2 w-28 md:w-40 bg-green-600 justify-center rounded hover:bg-green-700 flex text-white disabled:opacity-60"
              type="submit"
              disabled={searching}
            >
              {searching ? "Searching..." : "Search"}
            </button>

            <button
              type="button"
              onClick={onClear}
              className="text-sm md:text-base py-2 px-3 bg-gray-300 rounded hover:bg-gray-400"
            >
              Clear
            </button>
          </div>

          {/* Filters */}
          <div className="mt-3 flex flex-col md:flex-row md:items-center gap-3 justify-center">
            {/* Status */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-gray-500">
                Status:
              </span>
              <button
                type="button"
                onClick={() => setStatuses([])}
                aria-pressed={statuses.length === 0}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  statuses.length === 0
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Any
              </button>
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={statuses.includes(s)}
                  onClick={() => toggleStatus(s)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition ${
                    statuses.includes(s)
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {uppercaseFirstLetter(s)}
                </button>
              ))}
            </div>

            {/* Date */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-gray-500">
                Date:
              </span>
              <button
                type="button"
                onClick={() => setDatePreset("any")}
                aria-pressed={datePreset === "any"}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  datePreset === "any"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Any time
              </button>
              <button
                type="button"
                onClick={() => setDatePreset("week")}
                aria-pressed={datePreset === "week"}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  datePreset === "week"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                This week
              </button>
            </div>
          </div>
        </form>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-10">
          {records.map((record) => (
            <Link key={record.id} to={`/view/${record.id}`}>
              <div className="shadow-lg shadow-gray-400 rounded-3xl bg-white hover:outline hover:outline-black">
                <div className="grid grid-cols-[2fr_1fr] min-h-28 rounded-t-3xl p-3 bg-regal-blue text-white">
                  <div>
                    <h4 className="truncate w-5/6 text-base md:text-2xl font-semibold tracking-tighter">
                      {uppercaseFirstLetter(record.title)}
                    </h4>
                    <p className="text-sm md:text-lg font-semibold">
                      {record.orderNumber || ""}
                    </p>
                    <p className="text-sm md:text-lg font-semibold">
                      {uppercaseFirstLetter(record.customerType)}
                    </p>
                    <p className="text-sm text-gray-100">
                      {record.postcode !== "" &&
                        String(record.postcode).toUpperCase()}
                    </p>
                  </div>

                  <div className="flex flex-col justify-start items-end gap-1 text-sm md:text-base">
                    <p>
                      {Array.isArray(record.day)
                        ? uppercaseFirstLetter(record.day[0])
                        : ""}
                    </p>
                    <p>
                      {record.weekNumber ? `Week ${record.weekNumber}` : ""}
                    </p>
                    <p>{record.year === 0 ? "2024" : record.year}</p>
                    <p className="capitalize">
                      {record.other === "none" ? "Whiteboard" : record.other}
                    </p>
                  </div>
                </div>

                <div className="flex min-h-48 justify-center items-center text-center">
                  <p className="line-clamp-3 w-full md:px-4 text-sm md:text-base">
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
                    {!!record.trollies && (
                      <p className="font-bold text-sm text-green-500">
                        {record.trollies} Trollies
                      </p>
                    )}
                    {!!record.extras && (
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

        {/* Empty state */}
        {showEmpty && (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
            No results for{" "}
            <span className="font-semibold">“{lastSearchedRef.current}”</span>.
          </div>
        )}
      </div>
    </div>
  );
}

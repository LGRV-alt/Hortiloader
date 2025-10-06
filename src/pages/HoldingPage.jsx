/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import pb from "../api/pbConnect";

const CHIP = {
  new: "bg-amber-100 text-amber-800 border-amber-200",
  working: "bg-purple-100 text-purple-800 border-purple-200",
  loaded: "bg-blue-100 text-blue-800 border-blue-200",
  pulled: "bg-emerald-100 text-emerald-800 border-emerald-200",
  missed: "bg-red-100 text-red-800 border-red-200",
};

export default function HoldingPage() {
  const user = pb?.authStore?.record;

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  // Build filter safely once user is known
  const filter = useMemo(() => {
    if (!user?.organization) return null;
    // PocketBase filter uses && and = for equality; escape quotes if needed
    return `org="${user.organization}" && other="holding" && deleted=false`;
  }, [user?.organization]);

  useEffect(() => {
    if (!filter) {
      setLoading(false);
      return;
    }

    const ctrl = new AbortController();

    (async () => {
      try {
        setLoading(true);
        // If the collection could be large, consider getList(page, perPage)
        const list = await pb.collection("tasks").getFullList({
          sort: "-created",
          filter,
          $autoCancel: false, // we'll handle via AbortController
        });

        if (!ctrl.signal.aborted) setRecords(list);
      } catch (err) {
        if (ctrl.signal.aborted) return;
        console.error("Error fetching holding tasks:", err);
        setErrMsg("Sorry, we couldn’t load the holding tasks.");
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [filter]);

  if (!user) {
    return (
      <div className="px-10 py-10">
        <p className="text-gray-600">
          You’re not signed in. Please log in to view holding tasks.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-10">
      <div className="flex flex-col justify-center items-center py-5">
        <h2 className="text-2xl lg:text-3xl font-bold tracking-tighter">
          Holding Page
        </h2>
        <p className="text-center text-gray-500 text-sm lg:text-base pb-4">
          Orders held within the holding section, move them to the working board
          when ready.
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-3xl bg-white shadow-lg shadow-gray-400 p-6 h-48"
            >
              <div className="h-6 w-1/3 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && errMsg && (
        <div className="pb-10">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {errMsg}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !errMsg && records.length === 0 && (
        <div className="pb-10">
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <p className="text-gray-600">No orders in holding right now.</p>
          </div>
        </div>
      )}

      {/* List */}
      {!loading && !errMsg && records.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-10">
          {records.map((record) => {
            const {
              id,
              title,
              orderNumber,
              customerType,
              postcode,
              day,
              weekNumber,
              year,
              other,
              orderInfo,
              status,
              trollies,
              extras,
            } = record || {};

            const safeDay = Array.isArray(day) && day.length > 0 ? day[0] : "";
            const safeYear = typeof year === "number" && year > 0 ? year : "";
            const safePostcode =
              typeof postcode === "string" ? postcode.trim().toUpperCase() : "";
            const chipClass = CHIP[status] || CHIP.new;

            return (
              <Link
                key={id}
                to={`/view/${id}`}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black rounded-3xl"
                aria-label={`Open ${title || "order"}`}
              >
                <article className="shadow-lg shadow-gray-400 rounded-3xl bg-white hover:outline hover:outline-black">
                  <header className="grid grid-cols-[2fr_1fr] min-h-28 rounded-t-3xl p-3 bg-regal-blue text-white">
                    <div>
                      <h4 className="truncate w-5/6 text-base md:text-2xl font-semibold tracking-tighter">
                        {title || "Untitled"}
                      </h4>
                      <p className="text-sm md:text-lg font-semibold">
                        {orderNumber || ""}
                      </p>
                      <p className="text-sm md:text-lg font-semibold">
                        {customerType || ""}
                      </p>
                      <p className="text-sm text-gray-100">{safePostcode}</p>
                    </div>

                    <div className="flex flex-col justify-start items-end gap-1 text-sm md:text-base">
                      <p>{safeDay}</p>
                      <p>{weekNumber ? `Week ${weekNumber}` : ""}</p>
                      <p>{safeYear}</p>
                      <p className="capitalize">
                        {other && other !== "none" ? other : "Whiteboard"}
                      </p>
                    </div>
                  </header>

                  <div className="flex min-h-48 justify-center items-center text-center">
                    <p className="line-clamp-3 w-full md:px-4 text-sm md:text-base">
                      {orderInfo || "No order information."}
                    </p>

                    <div className="text-center gap-1 flex flex-col w-full md:w-1/2 pr-1 md:px-4">
                      <h5 className="text-sm tracking-tighter font-semibold">
                        ORDER STATUS
                      </h5>

                      <span
                        className={`w-2/3 md:w-1/2 self-center md:px-4 py-1 text-sm rounded-full border ${chipClass}`}
                      >
                        {status ? status : "New"}
                      </span>

                      {!!trollies && (
                        <p className="font-bold text-sm text-green-600">
                          {trollies}{" "}
                          {Number(trollies) === 1 ? "Trolley" : "Trolleys"}
                        </p>
                      )}

                      {!!extras && (
                        <p className="line-clamp-2 font-bold text-sm text-green-600">
                          {extras}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

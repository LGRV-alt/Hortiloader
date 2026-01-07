/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useTaskStore } from "../hooks/useTaskStore";

export default function WeekdayPage() {
  const [extras, setExtras] = useState(false);
  const exportRef = useRef(); // Optional: Keep if you need to target for advanced styling
  const records = useTaskStore((state) => state.tasks);
  const [printing, setPrinting] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([
    "wholesale",
    "retail",
    "missed",
    "other",
  ]);
  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const { year, day, week, number } = useParams();

  const arr = records.filter(
    (record) =>
      record.weekNumber == week &&
      record.year == year &&
      record.other === "none" &&
      record.day[0] === day.toLowerCase() &&
      selectedTypes.includes(record.customerType)
  );

  const handlePrint = () => {
    setPrinting(true);
    window.print();
    setPrinting(false);
  };

  return (
    <div className="m-0 p-0 min-h-screen bg-white print:min-h-0 print:h-auto portrait-print">
      <div
        ref={exportRef}
        className="m-0 p-0 w-full h-full bg-white"
        style={{ margin: 0, padding: 0 }}
      >
        <div
          className={`${
            printing ? "h-12" : "h-36"
          }w-full flex justify-center flex-col items-center bg-slate-300 text-center border-b-2 border-black`}
        >
          <h3 className="md:text-3xl text-xl font-bold">{`${day}-${number} ${year}`}</h3>
          <div className="w-full flex flex-wrap gap-4 justify-center mt-4 print:hidden">
            {" "}
            {/* Hide filters/buttons on print */}
            {["wholesale", "retail", "missed", "other"].map((type) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleTypeToggle(type)}
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
            <div className="w-full text-sm md:text-base flex justify-center">
              <button
                className="w-auto mr-2 px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg shadow hover:bg-orange-700 transition"
                onClick={() => setExtras(!extras)}
              >
                Show Extras
              </button>
              <button
                onClick={handlePrint}
                className="w-1/4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
              >
                Print
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          {arr.map((record) => (
            <div
              key={record.id}
              className="flex justify-between items-center border-b-2  border-black md:pl-4"
            >
              <Link to={`/edit/${record.id}`}>
                <div className="flex hover:border-black hover:border-b-2 ">
                  <p
                    className={`font-normal  ${
                      record.customerType === "retail"
                        ? "text-blue-700"
                        : record.customerType === "other"
                        ? "text-red-500"
                        : record.customerType === "missed"
                        ? "text-fuchsia-600"
                        : ""
                    }`}
                  >
                    {record.title}
                  </p>
                  <p className="md:text-3xl text-xs self-end">
                    {record.orderNumber || ""}
                  </p>
                  <p className="md:text-3xl text-xs self-end">
                    {record.postcode.toUpperCase() || ""}
                  </p>
                </div>
              </Link>

              {extras && (
                <div className="md:text-2xl text-xs flex gap-1 md:gap-4 md:pr-8">
                  {["Green", "Yellow", "Shelves"].map((label) => (
                    <div key={label} className="flex gap-1">
                      <p className="pb-2">{label}</p>
                      <span className="self-end w-6 h-6 md:w-20 md:h-14 border-black border-2"></span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-500 italic text-center pb-2 hidden print:block">
          {" "}
          {/* Show only on print */}
          Created with Hortiloader.com • {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

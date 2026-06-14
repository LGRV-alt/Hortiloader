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
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const { year, day, week, number } = useParams();

  const arr = records.filter(
    (record) =>
      record.weekNumber == week &&
      record.year == year &&
      record.other === "none" &&
      record.day[0] === day.toLowerCase() &&
      selectedTypes.includes(record.customerType),
  );

  const handlePrint = () => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      console.log(theme);
      setPrinting(true);
      window.print();
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setPrinting(false);
    } else {
      setPrinting(true);
      window.print();
      setPrinting(false);
    }
  };

  return (
    <div className="m-0 p-0 min-h-screen bg-white dark:bg-darkMain print:min-h-0 print:h-auto portrait-print text-black dark:text-white">
      <div
        ref={exportRef}
        className="m-0 p-0 w-full h-full bg-white dark:bg-darkMain"
        style={{ margin: 0, padding: 0 }}
      >
        <div
          className={`${
            printing ? "h-12" : "h-36"
          }w-full flex justify-center flex-col items-center bg-slate-300 dark:bg-darkMain center border-b-2 dark:border-darkBorder border-black`}
        >
          <h3 className="md:text-3xl text-xl font-bold">{`${day}-${number} ${year}`}</h3>
          <div className="w-full flex flex-wrap gap-4 justify-center mt-0 md:mt-2 print:hidden">
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
            <div className="w-full text-sm md:text-base flex justify-center pb-2">
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

        <div className="text-sm md:text-xl flex flex-col justify-center">
          {arr.map((record) => (
            <div
              key={record.id}
              className="flex justify-between items-center border-b-2  border-black dark:border-darkBorder md:pl-4 p-2"
            >
              <Link to={`/edit/${record.id}`}>
                <div className="flex hover:border-black dark:hover:border-darkBorder hover:border-b-2 gap-2 ">
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
                  <p className="md:text-lg text-xs self-center">
                    {record.orderNumber || ""}
                  </p>
                  <p className="md:text-md text-xs self-center">
                    {record.postcode.toUpperCase() || ""}
                  </p>
                </div>
              </Link>

              {extras && (
                <div className="md:text-lg text-xs flex gap-1 md:gap-2 md:pr-8">
                  {["Green", "Yellow", "Shelves"].map((label) => (
                    <div key={label} className="flex gap-1">
                      <p className="">{label}</p>
                      <span className="w-4 md:w-10 border-black dark:border-darkBorder border-2"></span>
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

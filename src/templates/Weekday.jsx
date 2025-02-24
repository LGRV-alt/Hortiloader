/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { usePDF } from "react-to-pdf";

export default function WeekdayPage({ records }) {
  const [extras, setExtras] = useState(false);
  console.log(extras);
  const { year, day, week, number } = useParams();
  const { toPDF, targetRef } = usePDF({
    filename: `${day}-${number}-${year}`,
  });

  const arr = records.filter(
    (record) =>
      record.weekNumber == week &&
      record.year == year &&
      record.other == "none" &&
      record.day[0] == day.toLowerCase()
  );

  return (
    <div>
      <div ref={targetRef}>
        <div className="w-full h-36 flex justify-center items-center bg-slate-300 text-center p-2">
          <h3 className="text-3xl font-bold">{`${day}-${number} ${year}`}</h3>
        </div>
        <div className="flex flex-col justify-center p-3 ">
          {arr.map((record) => (
            <div
              className="flex justify-between items-center border-b-2 border-black p-4 pl-8 mt-12  "
              key={record.id}
            >
              <Link to={`/edit/${record.id}`}>
                <div className=" flex justify-center hover:border-black hover:border-b-2 ">
                  {record.customerType === "retail" ? (
                    <p className="text-blue-700 md:text-5xl mr-2 ">
                      {record.title}
                    </p>
                  ) : record.customerType === "other" ? (
                    <p className="text-red-500  font-medium md:text-5xl mr-2">
                      {record.title}
                    </p>
                  ) : record.customerType === "missed" ? (
                    <p className="text-fuchsia-600  font-medium md:text-5xl mr-2">
                      {record.title}
                    </p>
                  ) : (
                    <p className="font-medium md:text-5xl mr-2 ">
                      {record.title}
                    </p>
                  )}

                  {/* <p className="font-medium md:text-lg mr-2">
                    {record.postcode.toUpperCase()}
                  </p> */}
                  <p className=" text-2xl self-end">
                    {record.orderNumber ? record.orderNumber : ""}
                  </p>
                  {/* <p className="hidden ml-2 md:block">{record.orderInfo}</p> */}
                </div>
              </Link>
              {extras ? (
                <div className="text-2xl flex gap-4 pr-8">
                  <div className="flex gap-1">
                    <p className="pb-2">Green</p>
                    <span className="self-end w-20 h-14 border-black border-2"></span>
                  </div>

                  <div className="flex gap-1">
                    <p className="pb-2">Yellow</p>
                    <span className="self-end w-20 h-14 border-black border-2"></span>
                  </div>

                  <div className="flex gap-1">
                    <p className="pb-2">Shelves</p>
                    <span className="self-end w-20 h-14 border-black border-2"></span>
                  </div>

                  <div className="flex gap-1">
                    <p className="pb-2">Pallets</p>
                    <span className="self-end w-20 h-14 border-black border-2"></span>
                  </div>

                  <div className="flex gap-1">
                    <p className="pb-2">Cages</p>
                    <span className="self-end w-20 h-14 border-black border-2"></span>
                  </div>

                  <div className="flex gap-1">
                    <p className="pb-2">Extras</p>
                    <span className="self-end w-20 h-14 border-black border-2"></span>
                  </div>
                </div>
              ) : (
                <p></p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="pb-4 w-full flex justify-center">
        <button
          className="w-1/6 mr-2 px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg shadow hover:bg-orange-700 transition"
          onClick={() => setExtras(!extras)}
        >
          Show Extras
        </button>
        <button
          onClick={() => toPDF()}
          className="w-1/6 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
        >
          Print
        </button>
      </div>
    </div>
  );
}

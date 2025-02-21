/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { usePDF } from "react-to-pdf";

export default function WeekdayPage({ records }) {
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
        <div className="flex flex-col justify-center p-3">
          {arr.map((record) => (
            <div
              className="flex items-center border-b-2 border-black p-2 mb-5 "
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
                    <p className="font-medium md:text-lg mr-2 ">
                      {record.title}
                    </p>
                  )}

                  <p className="font-medium md:text-lg mr-2">
                    {record.postcode.toUpperCase()}
                  </p>
                  <p className=" ">
                    {record.orderNumber ? record.orderNumber : ""}
                  </p>
                  {/* <p className="hidden ml-2 md:block">{record.orderInfo}</p> */}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="pb-4 w-full flex justify-center">
        <button
          onClick={() => toPDF()}
          className="w-1/2 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}

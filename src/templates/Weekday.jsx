/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";

export default function WeekdayPage({ records }) {
  const { year, day, week } = useParams();
  //   const arr = filterUsersByDay(day);
  const arr = records.filter(
    (record) =>
      record.weekNumber == week &&
      record.year == year &&
      record.other == "none" &&
      record.day[0] == day.toLowerCase()
  );
  console.log(arr);

  console.log(year, day, week);
  return (
    <div>
      <div className="hidden md:block">
        {/* <CreateHolding></CreateHolding> */}
      </div>
      <div className="flex justify-start flex-col mx-5 mt-5 ">
        {arr.map((record) => (
          <div
            className="flex  items-center border-b-2 border-slate-300 mb-5 "
            key={record.id}
          >
            {/* {console.log(record.updated.slice(5, 10))} */}

            <Link to={`/edit/${record.id}`}>
              <div className="flex items-center hover:border-black hover:border-b-2 ">
                {/* <p className="mr-2">Created-{record.created.slice(5, 10)}</p> */}
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

import { deleteTask, taskStatus } from "./lib/pocketbase";

// eslint-disable-next-line react/prop-types
export default function DayColumn({ arr, day }) {
  const array = arr;

  return (
    <>
      <h5 className="flex justify-center border-b-2 mb-2 text-lg font-bold border-black">
        {day}
      </h5>
      {array.map((record) => (
        <div className="flex justify-between px-1 pt-2" key={record.id}>
          <div className="flex">
            {record.customerType === "retail" ? (
              <p className="text-blue-700">
                {record.title} {record.postcode} {record.orderNumber}{" "}
              </p>
            ) : record.customerType === "other" ? (
              <p className="text-red-500">
                {record.title} {record.postcode} {record.orderNumber}{" "}
              </p>
            ) : record.customerType === "missed" ? (
              <p className="text-fuchsia-600">
                {record.title} {record.postcode} {record.orderNumber}{" "}
              </p>
            ) : (
              <p className="">
                {record.title} {record.postcode} {record.orderNumber}{" "}
              </p>
            )}

            <select
              className="w-4"
              onChange={(e) =>
                taskStatus(record.id, record.title, e.target.value)
              }
            >
              <option></option>
              <option value="pulled">Pulled</option>
              <option value="loaded">Loaded</option>
              <option value="sent">Sent</option>
            </select>
          </div>
          {record.status === "pulled" ? (
            <p>pulled</p>
          ) : record.status === "loaded" ? (
            <p>Loaded</p>
          ) : (
            <p>Sent</p>
          )}

          <button
            className="ml-4 bg-red-500 rounded-md text-white px-2 hover:bg-red-600"
            onClick={() => deleteTask(record.id)}
          >
            <span className="material-symbols-outlined">X</span>
          </button>
        </div>
      ))}
    </>
  );
}

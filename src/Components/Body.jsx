/* eslint-disable react/prop-types */

import DayColumn from "./DayColumn";
import { daysOfWeek } from "./lib/pocketbase";
import DanishTrolleyLoader from "./DanishTrolleyLoader";

export default function Body({
  records,
  chosenWeek,
  chosenYear,
  refresh,
  setRefresh,
  edit,
  setCustomerList,
  customerList,
  userSettings,
  loading,
}) {
  refresh;
  const filterUsersByDay = (day) => {
    // eslint-disable-next-line react/prop-types
    return records.filter(
      (record) =>
        (record.day == day) &
        (record.weekNumber == chosenWeek) &
        (record.other == "none") &
        (record.year === chosenYear)
    );
  };

  const monday = filterUsersByDay("monday");
  const tuesday = filterUsersByDay("tuesday");
  const wednesday = filterUsersByDay("wednesday");
  const thursday = filterUsersByDay("thursday");
  const friday = filterUsersByDay("friday");
  const saturday = filterUsersByDay("saturday");
  const sunday = filterUsersByDay("sunday");

  if (loading) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <div className="flex justify-center mt-28 ">
          <h2 className="text-4xl font-bold">Loading...</h2>
        </div>
        <div className="absolute left-0 top-1/3 -translate-y-1/2">
          <DanishTrolleyLoader />
        </div>
      </div>
    );
  } else {
    return (
      <div className="grid grid-row-7 grid-cols-1 grid-rows-1 md:grid-cols-6 md:grid-rows-2  h-full">
        <div className=" mb-10 md:border-t-0 md:mb-0  md:border-r-2 row-span-2 border-black">
          <DayColumn
            arr={monday}
            day={"Monday"}
            // route={"Glasgow Wholesale"}
            route={userSettings?.monday_heading || "Misc"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][0]}
            chosenYear={chosenYear}
            chosenWeek={chosenWeek}
            edit={edit}
            setCustomerList={setCustomerList}
            customerList={customerList}
          ></DayColumn>
        </div>
        <div className="mb-10 border-t-2 md:border-t-0 md:mb-0 md:border-r-2 row-span-2 border-black">
          <DayColumn
            arr={tuesday}
            day={"Tuesday"}
            route={userSettings?.tuesday_heading || "Misc"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][1]}
            chosenYear={chosenYear}
            chosenWeek={chosenWeek}
            edit={edit}
            setCustomerList={setCustomerList}
            customerList={customerList}
          ></DayColumn>
        </div>
        <div className="mb-10 border-t-2 md:border-t-0 md:mb-0 md:border-r-2 row-span-2 border-black">
          <DayColumn
            arr={wednesday}
            day={"Wednesday"}
            route={userSettings?.wednesday_heading || "Misc"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][2]}
            chosenYear={chosenYear}
            chosenWeek={chosenWeek}
            edit={edit}
            setCustomerList={setCustomerList}
            customerList={customerList}
          ></DayColumn>
        </div>
        <div className="mb-10 border-t-2 md:border-t-0 md:mb-0 md:border-r-2 row-span-2 border-black">
          <DayColumn
            arr={thursday}
            day={"Thursday"}
            route={userSettings?.thursday_heading || "Misc"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][3]}
            chosenYear={chosenYear}
            chosenWeek={chosenWeek}
            edit={edit}
            setCustomerList={setCustomerList}
            customerList={customerList}
          ></DayColumn>
        </div>
        <div className="mb-10 border-t-2 md:border-t-0 md:mb-0 md:border-r-2 row-span-2 border-black">
          <DayColumn
            arr={friday}
            day={"Friday"}
            route={userSettings?.friday_heading || "Misc"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][4]}
            chosenYear={chosenYear}
            chosenWeek={chosenWeek}
            edit={edit}
            setCustomerList={setCustomerList}
            customerList={customerList}
          ></DayColumn>
        </div>
        <div className="mb-10 border-t-2 md:border-t-0 md:mb-0 md:border-r-2 md:row-start-1 md:row-end-2 md:col-start-6 border-black">
          <DayColumn
            arr={saturday}
            day={"Saturday"}
            route={userSettings?.saturday_heading || "Misc"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][5]}
            chosenYear={chosenYear}
            chosenWeek={chosenWeek}
            edit={edit}
            setCustomerList={setCustomerList}
            customerList={customerList}
          ></DayColumn>
        </div>
        <div className="mb-10 border-t-2 md:border-t-2 md:mb-0 md:border-r-2 md:row-start-2 md:row-end-3 md:col-start-6 border-black">
          <DayColumn
            arr={sunday}
            day={"Sunday"}
            route={userSettings?.sunday_heading || "Misc"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][6]}
            chosenYear={chosenYear}
            chosenWeek={chosenWeek}
            edit={edit}
            setCustomerList={setCustomerList}
            customerList={customerList}
          ></DayColumn>
        </div>
      </div>
    );
  }
}

// export default Body;

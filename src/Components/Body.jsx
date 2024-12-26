/* eslint-disable react/prop-types */

import DayColumn from "./DayColumn";
import { daysOfWeek } from "./lib/pocketbase";

export default function Body({
  records,
  chosenWeek,
  chosenYear,
  refresh,
  setRefresh,
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

  return (
    <div className=" flex flex-col h-full">
      <div className="hidden md:block">
        {/* <CreateCustomer></CreateCustomer> */}
      </div>
      <div className="grid grid0=-row-7 grid-cols-1 grid-rows-1 md:grid-cols-6 md:grid-rows-2 md:outline h-full">
        <div className=" mb-10 md:mb-0 md:border-r-2 row-span-2 border-black">
          <DayColumn
            arr={monday}
            day={"Monday"}
            route={"Glasgow Wholesale"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][0]}
            refresh={refresh}
            setRefresh={setRefresh}
          ></DayColumn>
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 row-span-2 border-black">
          <DayColumn
            arr={tuesday}
            day={"Tuesday"}
            route={"Edinburgh + Lanark"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][1]}
            refresh={refresh}
            setRefresh={setRefresh}
          ></DayColumn>
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 row-span-2 border-black">
          <DayColumn
            arr={wednesday}
            day={"Wednesday"}
            route={"Dumfries/South"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][2]}
            refresh={refresh}
            setRefresh={setRefresh}
          ></DayColumn>
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 row-span-2 border-black">
          <DayColumn
            arr={thursday}
            day={"Thursday"}
            route={"North"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][3]}
            refresh={refresh}
            setRefresh={setRefresh}
          ></DayColumn>
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 row-span-2 border-black">
          <DayColumn
            arr={friday}
            day={"Friday"}
            route={"Ayrshire + Glasgow Retails"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][4]}
            refresh={refresh}
            setRefresh={setRefresh}
          ></DayColumn>
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 md:row-start-1 md:row-end-2 md:col-start-6 border-black">
          <DayColumn
            arr={saturday}
            day={"Saturday"}
            route={"Misc"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][5]}
            refresh={refresh}
            setRefresh={setRefresh}
          ></DayColumn>
        </div>
        <div className="mb-10 md:border-t-2 md:mb-0 md:border-r-2 md:row-start-2 md:row-end-3 md:col-start-6 border-black">
          <DayColumn
            arr={sunday}
            day={"Sunday"}
            route={"Misc"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][6]}
            refresh={refresh}
            setRefresh={setRefresh}
          ></DayColumn>
        </div>
      </div>
    </div>
  );
}

// export default Body;

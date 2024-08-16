/* eslint-disable react/prop-types */

import CreateCustomer from "./CreateCustomer";
import DayColumn from "./DayColumn";

export default function Body({ records, chosenWeek, refresh }) {
  const filterUsersByDay = (day) => {
    // eslint-disable-next-line react/prop-types
    return records.filter(
      (record) =>
        (record.day == day) &
        (record.weekNumber == chosenWeek) &
        (record.other == "none")
    );
  };

  // Working on this
  if (chosenWeek == false) {
    console.log("issue");
  }

  const daysOfWeek = {
    1: [1, 2, 3, 4, 5, 7, 8],
    2: [9, 10, 11, 12, 13, 14, 15],
    3: [16, 17, 18, 19, 20, 21, 22],
    4: [23, 24, 25, 26, 27, 28, 29],
    33: [12, 16, 17, 18, 19, 20, 21],
  };
  console.log(daysOfWeek[chosenWeek]);

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
      <div className="grid grid-cols-1 grid-rows-1 md:grid-cols-6 md:grid-rows-2 md:outline h-full">
        <div className=" mb-10 md:mb-0 md:border-r-2 row-span-2 border-black">
          <DayColumn
            arr={monday}
            day={"Monday"}
            route={"Glasgow Wholesale"}
            numberOfDay={daysOfWeek[chosenWeek][0]}
          ></DayColumn>
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 row-span-2 border-black">
          <DayColumn
            arr={tuesday}
            day={"Tuesday"}
            route={"Edinburgh + Lanark"}
            numberOfDay={daysOfWeek[chosenWeek][1]}
          ></DayColumn>
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 row-span-2 border-black">
          <DayColumn
            arr={wednesday}
            day={"Wednesday"}
            route={"Dumfries/South"}
            numberOfDay={daysOfWeek[chosenWeek][2]}
          ></DayColumn>
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 row-span-2 border-black">
          <DayColumn
            arr={thursday}
            day={"Thursday"}
            route={"North"}
            numberOfDay={daysOfWeek[chosenWeek][3]}
          ></DayColumn>
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 row-span-2 border-black">
          <DayColumn
            arr={friday}
            day={"Friday"}
            route={"Ayrshire + Glasgow Retails"}
            numberOfDay={daysOfWeek[chosenWeek][4]}
          ></DayColumn>
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 md:row-start-1 md:row-end-2 md:col-start-6 border-black">
          <DayColumn
            arr={saturday}
            day={"Saturday"}
            route={"Misc"}
            numberOfDay={daysOfWeek[chosenWeek][5]}
          ></DayColumn>
        </div>
        <div className="mb-10  border-t-2 md:mb-0 md:border-r-2 md:row-start-2 md:row-end-3 md:col-start-6 border-black">
          <DayColumn
            arr={sunday}
            day={"Sunday"}
            route={"Misc"}
            numberOfDay={daysOfWeek[chosenWeek][6]}
          ></DayColumn>
        </div>
      </div>
    </div>
  );
}

// export default Body;

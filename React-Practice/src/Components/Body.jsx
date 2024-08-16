/* eslint-disable react/prop-types */

import { useState } from "react";
import CreateCustomer from "./CreateCustomer";
import DayColumn from "./DayColumn";

export default function Body({ records, chosenWeek }) {
  const filterUsersByDay = (day) => {
    // eslint-disable-next-line react/prop-types
    return records.filter(
      (record) =>
        (record.day == day) &
        (record.weekNumber == chosenWeek) &
        (record.other == "none")
    );
  };

  const daysOfWeek = { 33: [12, 16, 17, 18, 19], 1: [1, 2, 3, 4, 5] };
  console.log(daysOfWeek[chosenWeek]);

  const monday = filterUsersByDay("monday");
  const tuesday = filterUsersByDay("tuesday");
  const wednesday = filterUsersByDay("wednesday");
  const thursday = filterUsersByDay("thursday");
  const friday = filterUsersByDay("friday");

  return (
    <div className=" flex flex-col h-full">
      <div className="hidden md:block">
        {/* <CreateCustomer></CreateCustomer> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-1 md:outline h-full">
        <div className=" mb-10 md:mb-0 md:border-r-2  border-black">
          <DayColumn
            arr={monday}
            day={"Monday"}
            route={"Glasgow Wholesale"}
            numberOfDay={daysOfWeek[chosenWeek][0]}
          ></DayColumn>
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 border-black">
          <DayColumn
            arr={tuesday}
            day={"Tuesday"}
            route={"Edinburgh + Lanark"}
            numberOfDay={daysOfWeek[chosenWeek][1]}
          ></DayColumn>
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 border-black">
          <DayColumn
            arr={wednesday}
            day={"Wednesday"}
            route={"Dumfries/South"}
            numberOfDay={daysOfWeek[chosenWeek][2]}
          ></DayColumn>
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 border-black">
          <DayColumn
            arr={thursday}
            day={"Thursday"}
            route={"North"}
            numberOfDay={daysOfWeek[chosenWeek][3]}
          ></DayColumn>
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 border-black">
          <DayColumn
            arr={friday}
            day={"Friday"}
            route={"Ayrshire + Glasgow Retails"}
            numberOfDay={daysOfWeek[chosenWeek][4]}
          ></DayColumn>
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 border-black">
          <DayColumn
            arr={friday}
            day={"Friday"}
            route={"Ayrshire + Glasgow Retails"}
            numberOfDay={daysOfWeek[chosenWeek][4]}
          ></DayColumn>
        </div>
      </div>
    </div>
  );
}

// export default Body;

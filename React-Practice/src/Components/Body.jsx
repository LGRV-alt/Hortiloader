/* eslint-disable react/prop-types */

import CreateCustomer from "./CreateCustomer";
import DayColumn from "./DayColumn";

export default function Body({ records }) {
  const filterUsersByDay = (day) => {
    // eslint-disable-next-line react/prop-types
    return records.filter((record) => record.day == day);
  };

  const monday = filterUsersByDay("monday");
  const tuesday = filterUsersByDay("tuesday");
  const wednesday = filterUsersByDay("wednesday");
  const thursday = filterUsersByDay("thursday");
  const friday = filterUsersByDay("friday");

  return (
    <div className=" flex flex-col h-full">
      <CreateCustomer></CreateCustomer>

      <div className="grid grid-cols-5 grid-rows-1 outline h-full">
        <div className="border-r-2 border-black">
          <DayColumn arr={monday} day={"Monday"}></DayColumn>
        </div>
        <div className="border-r-2 border-black">
          <DayColumn arr={tuesday} day={"Tuesday"}></DayColumn>
        </div>
        <div className="border-r-2 border-black">
          <DayColumn arr={wednesday} day={"Wednesday"}></DayColumn>
        </div>
        <div className="border-r-2 border-black">
          <DayColumn arr={thursday} day={"Thursday"}></DayColumn>
        </div>
        <div className="border-r-2 border-black">
          <DayColumn arr={friday} day={"Friday"}></DayColumn>
        </div>
      </div>
    </div>
  );
}

// export default Body;

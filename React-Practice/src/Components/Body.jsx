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
      <div className="grid grid-cols-[7rem_auto] h-full">
        <div className="pl-2 h-auto">
          <h3 className="">sidebar</h3>
        </div>
        <div className="grid grid-cols-5 outline">
          <div className="border-r-2 border-black">
            <DayColumn arr={monday} day={"monday"}></DayColumn>
          </div>
          <div className="border-r-2 border-black">
            <DayColumn arr={tuesday} day={"tuesday"}></DayColumn>
          </div>
          <div className="border-r-2 border-black">
            <DayColumn arr={wednesday} day={"Wednesday"}></DayColumn>
          </div>
          <div className="border-r-2 border-black">
            <DayColumn arr={thursday} day={"Thursday"}></DayColumn>
          </div>
          <div>
            <DayColumn arr={friday} day={"Friday"}></DayColumn>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default Body;

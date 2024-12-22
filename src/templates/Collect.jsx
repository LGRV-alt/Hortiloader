/* eslint-disable react/prop-types */

import DayColumn from "../Components/DayColumn";

export default function Collect({ records, chosenWeek }) {
  const filterUsersByDay = (day) => {
    // eslint-disable-next-line react/prop-types
    return records.filter(
      (record) =>
        (record.day == day) &
        (record.weekNumber == chosenWeek) &
        (record.other == "collect")
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

      <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 md:outline h-full">
        <div className="md:border-r-2 border-black row-span-2">
          <DayColumn arr={monday} day={"Monday"}></DayColumn>
        </div>
        <div className="md:border-r-2 border-black row-span-2 ">
          <DayColumn arr={tuesday} day={"Tuesday"}></DayColumn>
        </div>
        <div className="md:border-r-2 border-black row-span-2">
          <DayColumn arr={wednesday} day={"Wednesday"}></DayColumn>
        </div>
        <div className="md:border-r-2 border-black row-span-2">
          <DayColumn arr={thursday} day={"Thursday"}></DayColumn>
        </div>
        <div className="md:border-r-2  border-black row-span-2">
          <DayColumn arr={friday} day={"Friday"}></DayColumn>
        </div>
        <div className="md:border-r-2 border-black ">
          <DayColumn arr={saturday} day={"Saturday"}></DayColumn>
        </div>
        <div className="md:border-r-2 border-t-2 border-black">
          <DayColumn arr={sunday} day={"Sunday"}></DayColumn>
        </div>
      </div>
    </div>
  );
}

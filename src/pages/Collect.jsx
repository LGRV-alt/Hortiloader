/* eslint-disable react/prop-types */

import DayColumn from "../Components/DayColumn";
import { daysOfWeek } from "../api/pocketbase";
import { useTaskStore } from "../hooks/useTaskStore";

export default function Collect({ chosenWeek, chosenYear }) {
  const records = useTaskStore((state) => state.tasks);

  const filterUsersByDay = (day) => {
    // eslint-disable-next-line react/prop-types
    return records.filter(
      (record) =>
        (record.day == day) &
        (record.weekNumber == chosenWeek) &
        (record.other == "collect") &
        (record.year == chosenYear)
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
          <DayColumn
            arr={monday}
            day={"Monday"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][0]}
          ></DayColumn>
        </div>
        <div className="md:border-r-2 border-black row-span-2 ">
          <DayColumn
            arr={tuesday}
            day={"Tuesday"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][1]}
          ></DayColumn>
        </div>
        <div className="md:border-r-2 border-black row-span-2">
          <DayColumn
            arr={wednesday}
            day={"Wednesday"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][2]}
          ></DayColumn>
        </div>
        <div className="md:border-r-2 border-black row-span-2">
          <DayColumn
            arr={thursday}
            day={"Thursday"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][3]}
          ></DayColumn>
        </div>
        <div className="md:border-r-2  border-black row-span-2">
          <DayColumn
            arr={friday}
            day={"Friday"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][4]}
          ></DayColumn>
        </div>
        <div className="md:border-r-2 border-black ">
          <DayColumn
            arr={saturday}
            day={"Saturday"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][5]}
          ></DayColumn>
        </div>
        <div className="md:border-r-2 border-t-2 border-black">
          <DayColumn
            arr={sunday}
            day={"Sunday"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][6]}
          ></DayColumn>
        </div>
      </div>
    </div>
  );
}

/* eslint-disable react/prop-types */

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

  const monday = filterUsersByDay("monday");
  const tuesday = filterUsersByDay("tuesday");
  const wednesday = filterUsersByDay("wednesday");
  const thursday = filterUsersByDay("thursday");
  const friday = filterUsersByDay("friday");

  return (
    <div className=" flex flex-col h-full">
      <div className="hidden md:block">
        <CreateCustomer></CreateCustomer>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 grid-rows-1 md:outline h-full">
        <div className=" mb-10 md:mb-0 md:border-r-2  border-black">
          <DayColumn
            arr={monday}
            day={"Monday"}
            route={"Glasgow Wholesale"}
          ></DayColumn>
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 border-black">
          <DayColumn
            arr={tuesday}
            day={"Tuesday"}
            route={"Edinburgh + Lanark"}
          ></DayColumn>
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 border-black">
          <DayColumn
            arr={wednesday}
            day={"Wednesday"}
            route={"Dumfries/South"}
          ></DayColumn>
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 border-black">
          <DayColumn
            arr={thursday}
            day={"Thursday"}
            route={"North"}
          ></DayColumn>
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 border-black">
          <DayColumn
            arr={friday}
            day={"Friday"}
            route={"Ayrshire + Glasgow Retails"}
          ></DayColumn>
        </div>
      </div>
    </div>
  );
}

// export default Body;

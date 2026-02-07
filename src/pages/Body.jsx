/* eslint-disable react/prop-types */
import DayColumn from "../Components/DayColumn";
import { daysOfWeek } from "../api/pocketbase";
import { useTaskStore } from "../hooks/useTaskStore";

export default function Body({
  chosenWeek,
  chosenYear,
  edit,
  setCustomerList,
  customerList,
  userSettings,
}) {
  const records = useTaskStore((state) => state.tasks);
  const filterUsersByDay = (day) => {
    return records.filter(
      (record) =>
        record.day == day &&
        record.weekNumber == chosenWeek &&
        (record.other === "none" || record.other === "collect") &&
        record.year === chosenYear,
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
    <div className="relative h-full">
      {/* Actual Day Grid Layout */}
      <div className="grid grid-row-7 grid-cols-1 grid-rows-1 md:grid-cols-6 md:grid-rows-2 h-full">
        <div className="mb-10 md:mb-0 md:border-r-2 border-black row-span-2 ">
          <DayColumn
            arr={monday}
            day="Monday"
            route={userSettings?.monday_heading || "Misc"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][0]}
            chosenYear={chosenYear}
            chosenWeek={chosenWeek}
            edit={edit}
            setCustomerList={setCustomerList}
            customerList={customerList}
          />
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 border-black row-span-2 border-t-2 md:border-t-0">
          <DayColumn
            arr={tuesday}
            day="Tuesday"
            route={userSettings?.tuesday_heading || "Misc"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][1]}
            chosenYear={chosenYear}
            chosenWeek={chosenWeek}
            edit={edit}
            setCustomerList={setCustomerList}
            customerList={customerList}
          />
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 border-black row-span-2 border-t-2 md:border-t-0">
          <DayColumn
            arr={wednesday}
            day="Wednesday"
            route={userSettings?.wednesday_heading || "Misc"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][2]}
            chosenYear={chosenYear}
            chosenWeek={chosenWeek}
            edit={edit}
            setCustomerList={setCustomerList}
            customerList={customerList}
          />
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 border-black row-span-2 border-t-2 md:border-t-0">
          <DayColumn
            arr={thursday}
            day="Thursday"
            route={userSettings?.thursday_heading || "Misc"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][3]}
            chosenYear={chosenYear}
            chosenWeek={chosenWeek}
            edit={edit}
            setCustomerList={setCustomerList}
            customerList={customerList}
          />
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 border-black row-span-2 border-t-2 md:border-t-0">
          <DayColumn
            arr={friday}
            day="Friday"
            route={userSettings?.friday_heading || "Misc"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][4]}
            chosenYear={chosenYear}
            chosenWeek={chosenWeek}
            edit={edit}
            setCustomerList={setCustomerList}
            customerList={customerList}
          />
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 md:row-start-1 md:row-end-2 md:col-start-6 border-black border-t-2 md:border-t-0">
          <DayColumn
            arr={saturday}
            day="Saturday"
            route={userSettings?.saturday_heading || "Misc"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][5]}
            chosenYear={chosenYear}
            chosenWeek={chosenWeek}
            edit={edit}
            setCustomerList={setCustomerList}
            customerList={customerList}
          />
        </div>
        <div className="mb-10 border-t-2 md:border-t-2 md:mb-0 md:border-r-2 md:row-start-2 md:row-end-3 md:col-start-6 border-black ">
          <DayColumn
            arr={sunday}
            day="Sunday"
            route={userSettings?.sunday_heading || "Misc"}
            numberOfDay={daysOfWeek[chosenYear][chosenWeek][6]}
            chosenYear={chosenYear}
            chosenWeek={chosenWeek}
            edit={edit}
            setCustomerList={setCustomerList}
            customerList={customerList}
          />
        </div>
      </div>
    </div>
  );
}

// export default Body;

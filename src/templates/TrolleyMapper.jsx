/* eslint-disable react/prop-types */
import React, { useState } from "react";
import DragAndDropList from "../Components/DragAndDropList";
import Vehicle from "../Components/Vehicle";

export default function TrolleyMapper({ records, customerList }) {
  const selectedRecords = records.filter((item) =>
    customerList.includes(item.id)
  );
  const [tasks, setTasks] = useState(selectedRecords);

  const handleReorder = (newOrder) => {
    console.log("Reordered Tasks:", newOrder);
    setTasks(newOrder);
  };

  console.log(tasks);
  return (
    <div className="flex h-full">
      <div className=" w-1/2 p-2 bg-gray-100">
        <DragAndDropList items={tasks} onReorder={handleReorder} />
      </div>
      <div className="w-1/2  bg-gray-100 ">
        <Vehicle items={tasks} onReorder={handleReorder} />
      </div>
    </div>
  );
}

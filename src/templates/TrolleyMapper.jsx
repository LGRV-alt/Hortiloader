/* eslint-disable react/prop-types */
import React, { useState } from "react";
import DragAndDropList from "../Components/DragAndDropList";

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
    <div>
      <div className="min-h-screen bg-gray-100">
        <DragAndDropList items={tasks} onReorder={handleReorder} />
      </div>
    </div>
  );
}

/* eslint-disable react/prop-types */
import React, { useState } from "react";
import DragAndDropList from "../Components/DragAndDropList";

const initialTasks = [
  {
    id: "cp47w6z5h4e3h2i",
    title: "Caulfield",
    postcode: "ka10 7lh",
    orderNumber: 8375,
  },
  {
    id: "r6bbpsns2zk48t9",
    title: "The Good Garden",
    postcode: "KA91RE",
    orderNumber: 3004046,
  },
  // more items...
];

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

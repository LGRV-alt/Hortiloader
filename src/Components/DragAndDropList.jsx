import { useState } from "react";
import { nanoid } from "nanoid";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";

export default function DragAndDropList({
  items: initialItems = [],
  onReorder,
  setCustomerName,
  export: exportToPDF,
  readOnly,
  isExporting,
  vehicleInfo,
  setVehicleInfo,
}) {
  const [items, setItems] = useState(initialItems);
  const [isEditing, setIsEditing] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));
  let trolleyTotal = handleTotalTrollies(items);

  function handleTotalTrollies(arr) {
    let trolleyCount = 0;
    arr.forEach((item) => {
      const value = Number(item.trollies);
      trolleyCount += isNaN(value) ? 0 : value;
    });
    return trolleyCount;
  }

  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setVehicleInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddTask = () => {
    const newTask = {
      id: nanoid(),
      title: "",
      postcode: "",
      trollies: "",
      extras: "",
    };
    setItems((prev) => [...prev, newTask]);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    const newArray = arrayMove(items, oldIndex, newIndex);
    setItems(newArray);
    if (onReorder) onReorder(newArray); // callback to parent if needed
  };

  const handleItemEdit = (id, newData) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, ...newData } : item
    );
    setItems(updated);
  };
  console.log(vehicleInfo);

  return (
    <div className="w-full border-black border-2 rounded-lg p-2">
      {/* This is the view when working on the page and not exporting the PDF */}
      {!isExporting && (
        <div className="flex justify-between items-center border-black border-b-2 pb-2">
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isEditing ? "Finish Editing" : "Edit"}
          </button>
          <p>Total Trollies-{trolleyTotal}</p>
          {!isEditing && (
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Export to PDF
            </button>
          )}

          {isEditing && (
            <button
              onClick={handleAddTask}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              + Add Task
            </button>
          )}
        </div>
      )}

      {/* This is the view when exporting the page - Needs to display certain information */}
      {isExporting && (
        <div className="flex justify-between  border-black border-b-2 pb-2">
          <div className="flex gap-8 justify-between">
            <p>{`Driver - ${vehicleInfo.driver.toUpperCase()}`}</p>
            <p>{`Reg - ${vehicleInfo.reg.toUpperCase()}`}</p>
            <p>{`Date - ${vehicleInfo.date}`}</p>
          </div>
          <div className="flex justify-end items-center">
            <p> Total Trollies-{trolleyTotal}</p>
          </div>
        </div>
      )}

      {isEditing ? (
        <div className="flex p-2">
          {" "}
          <input
            name="driver"
            type="text"
            placeholder="Driver"
            value={vehicleInfo.driver}
            onChange={handleVehicleChange}
            className="border p-2 rounded w-full"
          />
          <input
            name="reg"
            type="text"
            placeholder="Reg"
            value={vehicleInfo.reg}
            onChange={handleVehicleChange}
            className="border p-2 rounded w-full"
          />
          <input
            name="code"
            type="text"
            placeholder="Code"
            value={vehicleInfo.code}
            onChange={handleVehicleChange}
            className="border p-2 rounded w-full"
          />
          <input
            name="date"
            type="date"
            value={vehicleInfo.date}
            onChange={handleVehicleChange}
            className="border p-2 rounded w-full"
          />
        </div>
      ) : (
        ""
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-1">
            {items.map((item, index) => (
              <SortableItem
                key={item.id}
                item={item}
                index={index}
                isEditing={isEditing}
                onEdit={handleItemEdit}
                onDelete={handleDelete}
                setCustomerName={setCustomerName}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

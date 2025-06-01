import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  TouchSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";

export default function DragAndDropList({
  items: initialItems = [],
  onReorder,
  setCustomerName,
  export: exportToPDF,
  readOnly,
  isExporting,
  vehicleInfo,
  setVehicleInfo,
  saveToPocketBase,
  saveStatus,
}) {
  const [items, setItems] = useState(initialItems);
  const [isEditing, setIsEditing] = useState(false);

  // const sensors = useSensors(useSensor(PointerSensor));
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Require a 250ms hold
        tolerance: 5, // User can move finger 5px before cancel
      },
    })
  );
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
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    if (onReorder) onReorder(updated); // Notify parent
  };
  const handleAddTask = () => {
    const newTask = {
      id: nanoid(),
      title: "",
      postcode: "",
      trollies: "",
      extras: "",
    };
    const updated = [...items, newTask];
    setItems(updated);
    if (onReorder) onReorder(updated); // Notify parent
  };

  useEffect(() => {
    return () => {
      clearAllBodyScrollLocks(); // Clean up if the component unmounts
    };
  }, []);

  const handleDragStart = () => {
    disableBodyScroll(document.body); // lock scrolling
  };

  const handleDragEnd = (event) => {
    enableBodyScroll(document.body); // unlock scrolling
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
    if (onReorder) onReorder(updated); // sync back to parent
  };

  return (
    <div className="w-full border-black border-2 rounded-lg p-2">
      {/* This is the view when working on the page and not exporting the PDF */}
      {!isExporting && (
        <div className="flex justify-between items-center border-black border-b-2 pb-2">
          <p className="text-sm md:text-base">Total Trollies-{trolleyTotal}</p>

          {!isEditing && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing((prev) => !prev)}
                className="md:p-2 p-1 text-sm md:text-base bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isEditing ? "Finish Editing" : "Edit"}
              </button>
              <div className="flex items-center">
                {saveStatus === "saving" && (
                  <p className="text-sm text-blue-600">Saving...</p>
                )}
                {saveStatus === "saved" && (
                  <p className="text-sm text-green-600">Saved!</p>
                )}
                {saveStatus === "error" && (
                  <p className="text-sm text-red-600">Error saving export.</p>
                )}
                <button
                  onClick={saveToPocketBase}
                  className="md:p-2 p-1 text-sm md:text-base bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
              </div>

              <button
                onClick={exportToPDF}
                className="md:p-2 p-1 text-sm md:text-base bg-blue-600 text-white rounded"
              >
                Print
              </button>
            </div>
          )}

          {isEditing && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing((prev) => !prev)}
                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isEditing ? "Finish Editing" : "Edit"}
              </button>
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                + Add
              </button>
            </div>
          )}
        </div>
      )}

      {/* This is the view when exporting the page - Needs to display certain information */}
      {isExporting && (
        <div className="flex justify-between  border-black border-b-2 md:pb-2">
          <div className="flex gap-2 md:gap-8 md:text-lg text-xs md:justify-between">
            <p>{`${vehicleInfo.driver.toUpperCase()}`}</p>
            <p>{`${vehicleInfo.reg.toUpperCase()}`}</p>
            <p>{`${vehicleInfo.date.split("-").reverse().join("-")}`}</p>
          </div>
          <div className="flex justify-end items-center text-xs md:text-lg">
            <p> Total Trollies-{trolleyTotal}</p>
          </div>
        </div>
      )}

      {isEditing ? (
        <div className="flex p-2 text-xs md:text-base">
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
        onDragStart={handleDragStart}
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

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

export default function DragAndDropList({ items: initialItems = [] }) {
  const [items, setItems] = useState(initialItems);
  const [isEditing, setIsEditing] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

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
  };

  const handleItemEdit = (id, newData) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, ...newData } : item
    );
    setItems(updated);
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isEditing ? "Finish Editing" : "Edit All"}
        </button>
        {isEditing && (
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Add Task
          </button>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-3">
            {items.map((item, index) => (
              <SortableItem
                key={item.id}
                item={item}
                index={index}
                isEditing={isEditing}
                onEdit={handleItemEdit}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

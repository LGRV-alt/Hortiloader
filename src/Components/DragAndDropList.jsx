import { useState } from "react";
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
      <button
        onClick={() => setIsEditing((prev) => !prev)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {isEditing ? "Finish Editing" : "Edit All"}
      </button>

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
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

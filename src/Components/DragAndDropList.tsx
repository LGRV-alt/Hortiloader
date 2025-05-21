import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableItem({ item }) {
  const { id, title, postcode } = item;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`p-4 mb-2 bg-white rounded shadow cursor-move transition ${
        isDragging ? "opacity-50" : "hover:bg-gray-100"
      }`}
    >
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-gray-500">{postcode}</div>
    </li>
  );
}

export default function DragAndDropList({
  items: initialItems = [],
  onReorder,
}) {
  const [items, setItems] = useState(initialItems);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const newArray = arrayMove(items, oldIndex, newIndex);
    setItems(newArray);
    if (onReorder) onReorder(newArray);
  };

  return (
    <div className="">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul>
            {items.map((item) => (
              <SortableItem key={item.id} item={item} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

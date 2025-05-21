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

function SortableItem({ item, index }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

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
      className={`flex items-center gap-4 p-4 bg-white rounded-xl shadow-md transition-all duration-200 cursor-move 
        ${isDragging ? "opacity-50 scale-95" : "hover:shadow-lg"}
      `}
    >
      <span className="text-gray-500 w-6 text-right">{index + 1}.</span>
      <div>
        <div className="font-semibold text-lg text-gray-800">{item.title}</div>
        <div className="text-sm text-gray-500">{item.postcode}</div>
      </div>
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
            {items.map((item, index) => (
              <SortableItem key={item.id} item={item} index={index} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableItem({ item, index, isEditing, onEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const [formData, setFormData] = useState({
    title: item.title || "",
    postcode: item.postcode || "",
    trollies: item.trollies || "",
    extras: item.extras || "",
  });

  useEffect(() => {
    setFormData({
      title: item.title || "",
      postcode: item.postcode || "",
      trollies: item.trollies || "",
      extras: item.extras || "",
    });
  }, [isEditing, item]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleChange = (key, value) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    onEdit(item.id, updated);
  };

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`p-4 bg-white rounded-xl shadow-md transition-all duration-200 cursor-move space-y-2 ${
        isDragging ? "opacity-50 scale-95" : "hover:shadow-lg"
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-sm">{index + 1}.</span>
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            className="w-full border rounded px-3 py-1"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Title"
          />
          <input
            type="text"
            className="w-full border rounded px-3 py-1"
            value={formData.postcode}
            onChange={(e) => handleChange("postcode", e.target.value)}
            placeholder="Postcode"
          />
          <input
            type="text"
            className="w-full border rounded px-3 py-1"
            value={formData.trollies}
            onChange={(e) => handleChange("trollies", e.target.value)}
            placeholder="Trollies"
          />
          <input
            type="text"
            className="w-full border rounded px-3 py-1"
            value={formData.extras}
            onChange={(e) => handleChange("extras", e.target.value)}
            placeholder="Extras"
          />
        </div>
      ) : (
        <div>
          <div className="font-semibold text-lg">{item.title}</div>
          <div className="text-sm text-gray-500">Postcode: {item.postcode}</div>
          {item.trollies && (
            <div className="text-sm text-gray-500">
              Trollies: {item.trollies}
            </div>
          )}
          {item.extras && (
            <div className="text-sm text-gray-500">Extras: {item.extras}</div>
          )}
        </div>
      )}
    </li>
  );
}

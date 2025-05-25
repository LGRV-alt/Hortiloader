import { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableItem({
  item,
  index,
  isEditing,
  onEdit,
  onDelete,
}) {
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
      {...(isEditing ? {} : attributes)}
      {...(isEditing ? {} : listeners)}
      style={style}
      className={`bg-slate-400 ${
        isDragging ? "opacity-50 scale-95" : "hover:shadow-lg"
      }`}
    >
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
          <button
            onClick={() => onDelete(item.id)}
            className="mt-2 text-red-600 hover:text-red-800 text-sm"
          >
            Delete
          </button>
        </div>
      ) : (
        <div className="flex justify-between p-1">
          <div className="flex gap-2 justify-start items-center">
            <div className="flex justify-between items-center">
              <span className="text-sm">{index + 1}.</span>
            </div>
            <div className="font-semibold text-lg">{item.title}</div>
            <p>{item.orderNumber}</p>
            <div className="text-sm ">{item.postcode}</div>
          </div>
          <div className="flex items-center gap-2">
            {item.trollies && <div className="">{item.trollies}T</div>}
            {item.extras && <div className="text-red-500">{item.extras}</div>}
          </div>
        </div>
      )}
    </li>
  );
}

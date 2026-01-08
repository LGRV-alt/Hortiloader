import { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react"; // Optional: install with `lucide-react` or use "≡"

export default function SortableItem({
  item,
  index,
  isEditing,
  onEdit,
  onDelete,
  setCustomerName,
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
    orderNumber: item.orderNumber || "",
  });

  useEffect(() => {
    setFormData({
      title: item.title || "",
      postcode: item.postcode || "",
      orderNumber: item.orderNumber || "",
      trollies: item.trollies || "",
      extras: item.extras || "",
    });
  }, [isEditing, item]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  function reduceOrderNumber(num) {
    if (!num) return "";
    return num.toString().slice(-4);
  }

  function sortPostCode(string) {
    if (string.length < 1) return "";
    if (/\d/.test(string)) {
      const reversePostCode = string.split("").reverse();
      const lastPart = reversePostCode.slice(0, 3).reverse().join("");
      const firstPart = reversePostCode.slice(3).reverse().join("");
      return `${firstPart} ${lastPart}`.toUpperCase();
    }
    return string;
  }

  const handleChange = (key, value) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    onEdit(item.id, updated);
  };

  const handleCustomerName = (title, orderNumber) => {
    return orderNumber == 0 ? title : `${title} - ${orderNumber}`;
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`border-b-2 w-full border-black  ${
        isDragging ? "opacity-50 scale-95" : "hover:shadow-lg"
      }`}
      onClick={() =>
        setCustomerName(handleCustomerName(item.title, item.orderNumber))
      }
    >
      {isEditing ? (
        <div className="p-2 gap-2 flex items-center text-xs md:text-base">
          <span
            {...attributes}
            {...listeners}
            className="cursor-grab select-none touch-none text-gray-500"
            title="Drag"
          >
            {/* <GripVertical size={16} /> */}
            {index + 1}.
          </span>
          <input
            type="text"
            className="w-2/3 border rounded text-center"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Title"
          />
          <input
            type="text"
            className="w-1/3 border rounded text-center"
            value={formData.orderNumber}
            onChange={(e) => handleChange("orderNumber", e.target.value)}
            placeholder="Order No"
          />
          <input
            type="text"
            className="w-1/3 border rounded text-center"
            value={formData.postcode}
            onChange={(e) => handleChange("postcode", e.target.value)}
            placeholder="Postcode"
          />
          <input
            type="text"
            className="w-1/3 border rounded text-center"
            value={formData.trollies}
            onChange={(e) => handleChange("trollies", e.target.value)}
            placeholder="Trollies"
          />
          <input
            type="text"
            className="w-full border rounded text-center"
            value={formData.extras}
            onChange={(e) => handleChange("extras", e.target.value)}
            placeholder="Extras"
          />
          <button
            onClick={() => onDelete(item.id)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            X
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span
              {...attributes}
              {...listeners}
              className="cursor-grab select-none touch-none md:text-xl"
              title="Drag"
            >
              {/* <GripVertical size={16} /> */}
              {index + 1}.
            </span>
            <div
              className={`flex gap-2 text-sm items-center font-normal capitalize  ${
                item.customerType === "retail"
                  ? "text-blue-700"
                  : item.customerType === "other"
                  ? "text-red-500"
                  : item.customerType === "missed"
                  ? "text-fuchsia-600"
                  : ""
              }`}
            >
              <p className="font-semibold md:text-2xl">{item.title}</p>
              <p className="text-xs md:text-xl">
                {reduceOrderNumber(item.orderNumber)}
              </p>
              <p className="">{sortPostCode(item.postcode)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm md:text-2xl">
            {item.trollies && <p>{item.trollies}T</p>}
            {item.extras && <p className="text-red-500">{item.extras}</p>}
          </div>
        </div>
      )}
    </li>
  );
}

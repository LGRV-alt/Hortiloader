import { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  };

  function reduceOrderNumber(num) {
    if (!num) {
      return "";
    } else {
      let newOrderNumber = num.toString().slice(-4);
      return newOrderNumber;
    }
  }

  function sortPostCode(string) {
    if (string.length < 1) {
      return "";
    } else if (/\d/.test(string)) {
      let reversePostCode = string.split("").reverse();
      let lastPart = reversePostCode.slice(0, 3).reverse().join("").toString();
      let firstPart = reversePostCode.slice(3).reverse().join("").toString();
      let newPostCode = `${firstPart} ${lastPart}`;
      return newPostCode.toUpperCase();
    } else {
      return string;
    }
  }

  const handleChange = (key, value) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    onEdit(item.id, updated);
  };

  function handleCustomerName(title, orderNumber) {
    let customerName = "";
    if (orderNumber == 0) {
      customerName = title;
    } else {
      customerName = `${title} - ${orderNumber}`;
    }
    return customerName;
  }

  return (
    <li
      // onClick={() => setCustomerName(`${item.title} - ${item.orderNumber}`)}
      onClick={() =>
        setCustomerName(handleCustomerName(item.title, item.orderNumber))
      }
      style={style}
      className={`border-b-2 border-black ${
        isDragging ? "opacity-50 scale-95" : "hover:shadow-lg"
      }`}
    >
      {isEditing ? (
        <div className="p-2 gap-2 flex items-center">
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
            className=" text-red-600 hover:text-red-800 text-sm"
          >
            Delete
          </button>
        </div>
      ) : (
        <div className="flex justify-between p-1">
          <div className=" flex gap-2 justify-start items-center">
            <div className="flex justify-between items-center">
              <span
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                className="text-sm"
              >
                {index + 1}.
              </span>
            </div>
            <div className="font-semibold text-lg">{item.title}</div>
            <p>{reduceOrderNumber(item.orderNumber)}</p>
            <div className="text-sm ">{sortPostCode(item.postcode)}</div>
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

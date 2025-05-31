// /* eslint-disable react/prop-types */
// import React, { useRef, useState } from "react";
// import DragAndDropList from "../Components/DragAndDropList";
// import Vehicle from "../Components/Vehicle";

// export default function TrolleyMapper({ records, customerList }) {
//   const selectedRecords = records.filter((item) =>
//     customerList.includes(item.id)
//   );
//   const [tasks, setTasks] = useState(selectedRecords);
//   const [customerName, setCustomerName] = useState("");

//   const handleReorder = (newOrder) => {
//     console.log("Reordered Tasks:", newOrder);
//     setTasks(newOrder);
//   };

//   return (
//     <div className="flex h-full">
//       <div className=" w-1/2 p-2 bg-gray-100">
//         <DragAndDropList
//           setCustomerName={setCustomerName}
//           items={tasks}
//           onReorder={handleReorder}
//         />
//       </div>

//       <div className="w-1/2  bg-gray-100 ">
//         <Vehicle
//           customerName={customerName}
//           items={tasks}
//           onReorder={handleReorder}
//           setCustomerName={setCustomerName}
//         />
//       </div>
//     </div>
//   );
// }

/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import DragAndDropList from "../Components/DragAndDropList";
import Vehicle from "../Components/Vehicle";
import pb from "../Components/lib/pbConnect";

export default function TrolleyMapper({ records, customerList }) {
  const [tasks, setTasks] = useState(
    records.filter((item) => customerList.includes(item.id))
  );
  console.log(tasks);
  const [customerName, setCustomerName] = useState("");
  const [isExporting, setIsExporting] = useState(false); // 👈 control what's shown
  const [vehicleInfo, setVehicleInfo] = useState({
    driver: "",
    reg: "",
    code: "",
    date: "",
  });

  const exportRef = useRef();

  const handleReorder = (newOrder) => setTasks(newOrder);

  const exportToPDF = async () => {
    setIsExporting(true); // 🔒 Show/hide things based on this flag
    await new Promise((resolve) => setTimeout(resolve, 100)); // wait for DOM to update

    // Upload to PocketBase before exporting
    try {
      await pb.collection("trolley_exports").create({
        name: `Export ${new Date().toLocaleString()}`,
        data: tasks,
        user: pb.authStore.model.id,
      });
      console.log("Export data saved to PocketBase");
    } catch (err) {
      console.error("Error saving export to PocketBase:", err);
    }

    const element = exportRef.current;
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const pxPerMm = 3.779528;
    const canvasWidthMm = canvas.width / pxPerMm;
    const canvasHeightMm = canvas.height / pxPerMm;
    const scale = Math.min(
      pdfWidth / canvasWidthMm,
      pdfHeight / canvasHeightMm
    );

    const imgWidth = canvasWidthMm * scale;
    const imgHeight = canvasHeightMm * scale;

    const x = (pdfWidth - imgWidth) / 2;
    const y = 0; // Start at top of page

    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
    // pdf.save("trolley-map.pdf");
    pdf.save(
      `${vehicleInfo.date.split("-").reverse().join("-")}_${
        vehicleInfo.driver
      }.pdf`
    );

    setIsExporting(false); // 🔓 Restore full UI
  };

  return (
    <div className="flex flex-col h-full">
      {/* Export button (not shown during export) */}

      {/* Exportable content */}
      <div ref={exportRef} className="flex flex-grow h-full">
        <div className="w-1/2 p-2">
          {isExporting && (
            <div className="mt-4 text-sm text-gray-600 italic pb-4">
              Exported by Hortiloader • {new Date().toLocaleDateString()} /{" "}
              {vehicleInfo.code}
            </div>
          )}
          <DragAndDropList
            setCustomerName={setCustomerName}
            items={tasks}
            onReorder={handleReorder}
            hideEditButtons={isExporting} // 👈 optional control inside component
            export={exportToPDF}
            isExporting={isExporting}
            setVehicleInfo={setVehicleInfo}
            vehicleInfo={vehicleInfo}
          />
        </div>

        <div className="w-1/2 p-2">
          <Vehicle
            customerName={customerName}
            items={tasks}
            onReorder={handleReorder}
            setCustomerName={setCustomerName}
            readOnly={isExporting} // 👈 optional: lock inputs or hide elements
          />
        </div>
      </div>
    </div>
  );
}

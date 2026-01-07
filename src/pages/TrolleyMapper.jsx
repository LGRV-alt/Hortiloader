// /* eslint-disable react/prop-types */
// import { useEffect, useRef, useState } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import DragAndDropList from "../Components/DragAndDropList";
// import Vehicle from "../Components/Vehicle";
// import pb from "../api/pbConnect";
// import toast from "react-hot-toast";
// import { useTaskStore } from "../hooks/useTaskStore";

// export default function TrolleyMapper({
//   customerList,
//   vehicleInfoFromExport,
//   initialTasks,
// }) {
//   const records = useTaskStore((state) => state.tasks);
//   const [tasks, setTasks] = useState(
//     initialTasks ?? records.filter((item) => customerList.includes(item.id))
//   );

//   const user = pb.authStore.record;

//   const [customerName, setCustomerName] = useState("");
//   const [saveStatus, setSaveStatus] = useState("Save");
//   const [isExporting, setIsExporting] = useState(false);

//   const [vehicleInfo, setVehicleInfo] = useState({
//     driver: "",
//     reg: "",
//     code: "",
//     date: "",
//     vehicleType: "",
//     trolleyNumber: 0,
//     grid: [], // <- array of customer names
//   });

//   const isVehicleInfoComplete = () => {
//     return vehicleInfo.driver && vehicleInfo.reg && vehicleInfo.date;
//   };

//   useEffect(() => {
//     if (vehicleInfoFromExport) {
//       setVehicleInfo(vehicleInfoFromExport);
//     }
//   }, [vehicleInfoFromExport]);

//   const exportRef = useRef();

//   const saveToPocketBase = async () => {
//     if (user.role === "viewer") {
//       toast.error("Viewer cannot edit orders");
//       return;
//     }
//     if (!isVehicleInfoComplete()) {
//       toast.error("Please enter driver, registration and date before saving.");
//       return;
//     }

//     setSaveStatus("Saving...");

//     const name = `${vehicleInfo.date.split("-").reverse().join("-")}-${
//       vehicleInfo.driver
//     }-${vehicleInfo.reg}`;

//     try {
//       // Check if a record with this name already exists
//       const existing = await pb
//         .collection("trolley_exports")
//         .getFirstListItem(`name="${name}"`);

//       // If it exists, update it
//       await pb.collection("trolley_exports").update(existing.id, {
//         name,
//         data: tasks,
//         vehicleInfo,
//         user: pb.authStore.record.id,
//         organization: pb.authStore.record.organization,
//       });

//       setSaveStatus("Save");
//       toast.success("Run Updated");
//     } catch (error) {
//       if (error.status === 404) {
//         // If not found, create a new record
//         try {
//           await pb.collection("trolley_exports").create({
//             name,
//             data: tasks,
//             vehicleInfo,
//             user: pb.authStore.record.id,
//             organization: pb.authStore.record.organization,
//           });
//           setSaveStatus("Save");
//           toast.success("Run Saved");
//         } catch (createErr) {
//           console.error("Error creating export in PocketBase:", createErr);
//           toast.error("error");
//         }
//       } else {
//         console.error("Error checking for existing export:", error);
//         toast.error("error");
//       }
//     }

//     // Reset status after a short delay
//     setTimeout(() => setSaveStatus("Save"), 3000);
//   };

//   const handleReorder = (newOrder) => setTasks(newOrder);

//   const exportToPDF = async () => {
//     setIsExporting(true);
//     await new Promise((resolve) => setTimeout(resolve, 100));

//     const name = `${vehicleInfo.date.split("-").reverse().join("-")}-${
//       vehicleInfo.driver
//     }-${vehicleInfo.reg}`;

//     // Save/update in PocketBase before exporting PDF
//     try {
//       try {
//         const existing = await pb
//           .collection("trolley_exports")
//           .getFirstListItem(`name="${name}"`);

//         // Update existing record
//         await pb.collection("trolley_exports").update(existing.id, {
//           name,
//           data: tasks,
//           vehicleInfo,
//           user: pb.authStore.model.id,
//         });

//         console.log("Export data updated in PocketBase");
//       } catch (error) {
//         if (error.status === 404) {
//           // Record doesn't exist, create new
//           await pb.collection("trolley_exports").create({
//             name,
//             data: tasks,
//             vehicleInfo,
//             user: pb.authStore.model.id,
//           });

//           console.log("Export data saved to PocketBase");
//         } else {
//           throw error;
//         }
//       }
//     } catch (err) {
//       console.error("Error saving/updating export to PocketBase:", err);
//     }

//     // PDF generation and download
//     const element = exportRef.current;
//     const canvas = await html2canvas(element, {
//       scale: 1,
//       useCORS: true,
//     });

//     const imgData = canvas.toDataURL("image/png", 1);
//     const pdf = new jsPDF("landscape", "mm", "a4");

//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = pdf.internal.pageSize.getHeight();
//     const pxPerMm = 3.779528;
//     const canvasWidthMm = canvas.width / pxPerMm;
//     const canvasHeightMm = canvas.height / pxPerMm;
//     const scale =
//       Math.min(pdfWidth / canvasWidthMm, pdfHeight / canvasHeightMm) * 0.95;

//     const imgWidth = canvasWidthMm * scale;
//     const imgHeight = canvasHeightMm * scale;
//     const x = (pdfWidth - imgWidth) / 2;
//     const y = 0;

//     pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
//     pdf.save(
//       `${vehicleInfo.date.split("-").reverse().join("-")}_${
//         vehicleInfo.driver
//       }.pdf`
//     );

//     setIsExporting(false);
//   };

//   return (
//     <div className="flex flex-col h-full">
//       {/* Export button (not shown during export) */}

//       {/* Exportable content */}
//       <div
//         ref={exportRef}
//         className="flex md:flex-row flex-col flex-grow h-full"
//       >
//         <div className="w-full md:w-1/2 p-2">
//           {isExporting && (
//             <div className="mt-4 text-base text-gray-600 italic pb-4">
//               Created with Hortiloader.com •{" "}
//               {new Date().toLocaleDateString().split("-").reverse().join("-")} /{" "}
//               {vehicleInfo.code}
//             </div>
//           )}

//           <DragAndDropList
//             setCustomerName={setCustomerName}
//             items={tasks}
//             onReorder={handleReorder}
//             hideEditButtons={isExporting} // 👈 optional control inside component
//             export={exportToPDF}
//             isExporting={isExporting}
//             setVehicleInfo={setVehicleInfo}
//             vehicleInfo={vehicleInfo}
//             saveToPocketBase={saveToPocketBase}
//             saveStatus={saveStatus}
//           />
//         </div>

//         <div className="w-full md:w-1/2 p-2">
//           <Vehicle
//             customerName={customerName}
//             items={tasks}
//             onReorder={handleReorder}
//             setCustomerName={setCustomerName}
//             readOnly={isExporting} // 👈 optional: lock inputs or hide elements
//             vehicleInfo={vehicleInfo}
//             setVehicleInfo={setVehicleInfo}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import DragAndDropList from "../Components/DragAndDropList";
import Vehicle from "../Components/Vehicle";
import pb from "../api/pbConnect";
import toast from "react-hot-toast";
import { useTaskStore } from "../hooks/useTaskStore";
import { TbChevronsDownLeft } from "react-icons/tb";

export default function TrolleyMapper({
  customerList,
  vehicleInfoFromExport,
  initialTasks,
}) {
  const records = useTaskStore((state) => state.tasks);
  const [tasks, setTasks] = useState(
    initialTasks ?? records.filter((item) => customerList.includes(item.id))
  );

  const user = pb.authStore.record;

  const [customerName, setCustomerName] = useState("");
  const [saveStatus, setSaveStatus] = useState("Save");

  const [vehicleInfo, setVehicleInfo] = useState({
    driver: "",
    reg: "",
    code: "",
    date: "",
    vehicleType: "",
    trolleyNumber: 0,
    grid: [],
  });

  const isVehicleInfoComplete = () => {
    return vehicleInfo.driver && vehicleInfo.reg && vehicleInfo.date;
  };

  useEffect(() => {
    if (vehicleInfoFromExport) {
      setVehicleInfo(vehicleInfoFromExport);
    }
  }, [vehicleInfoFromExport]);

  const saveToPocketBase = async () => {
    if (user.role === "viewer") {
      toast.error("Viewer cannot edit orders");
      return;
    }
    if (!isVehicleInfoComplete()) {
      toast.error("Please enter driver, registration and date before saving.");
      return;
    }

    setSaveStatus("Saving...");
    const name = `${vehicleInfo.date.split("-").reverse().join("-")}-${
      vehicleInfo.driver
    }-${vehicleInfo.reg}`;

    try {
      // Check if a record with this name already exists
      const existing = await pb
        .collection("trolley_exports")
        .getFirstListItem(`name="${name}"`);

      // If it exists, update it
      await pb.collection("trolley_exports").update(existing.id, {
        name,
        data: tasks,
        vehicleInfo,
        user: pb.authStore.record.id,
        organization: pb.authStore.record.organization,
      });

      setSaveStatus("Save");
      toast.success("Run Updated");
    } catch (error) {
      if (error.status === 404) {
        // If not found, create a new record
        try {
          await pb.collection("trolley_exports").create({
            name,
            data: tasks,
            vehicleInfo,
            user: pb.authStore.record.id,
            organization: pb.authStore.record.organization,
          });
          setSaveStatus("Save");
          toast.success("Run Saved");
        } catch (createErr) {
          console.error("Error creating export in PocketBase:", createErr);
          toast.error("error");
        }
      } else {
        console.error("Error checking for existing export:", error);
        toast.error("error");
      }
    }

    // Reset status after a short delay
    setTimeout(() => setSaveStatus("Save"), 3000);
  };

  const handleReorder = (newOrder) => setTasks(newOrder);

  const handlePrint = async () => {
    if (!isVehicleInfoComplete()) {
      toast.error(
        "Please enter driver, registration and date before printing."
      );
      return;
    }
    try {
      await navigator.clipboard.writeText(suggestedFileName);
      // Optional: brief visual feedback
      toast.success(`Copied filename — ready to paste!`, { duration: 2500 });
    } catch (err) {
      console.warn("Clipboard copy failed:", err);
      // Fallback: still open print even if copy fails
    }
    // Open print dialog right after (feels instant)
    window.print();
  };

  // const name = `${vehicleInfo.date.split("-").reverse().join("-")}-${
  //   vehicleInfo.driver
  // }-${vehicleInfo.reg}`;

  const suggestedFileName = `${vehicleInfo.date
    .split("-")
    .reverse()
    .join("-")}_${vehicleInfo.driver || "driver"}_${
    vehicleInfo.reg || "reg"
  }.pdf`.replace(/\s+/g, "-");

  return (
    <div className="flex flex-col h-full">
      {/* Exportable / Printable content */}
      <div className="flex md:flex-row flex-col flex-grow">
        <div className="w-full md:w-1/2 p-2">
          <div className="hidden print:block text-base text-gray-600 italic mb-4">
            Created with Hortiloader.com •{" "}
            {new Date()
              .toLocaleDateString("en-GB")
              .split("/")
              .reverse()
              .join("-")}{" "}
            / {vehicleInfo.code || "N/A"}
          </div>

          <DragAndDropList
            setCustomerName={setCustomerName}
            items={tasks}
            onReorder={handleReorder}
            hideEditButtons={false} // ← keep your original behavior
            export={handlePrint}
            setVehicleInfo={setVehicleInfo}
            vehicleInfo={vehicleInfo}
            saveToPocketBase={saveToPocketBase}
            saveStatus={saveStatus}
          />
        </div>

        <div className="w-full md:w-1/2 p-2">
          <Vehicle
            customerName={customerName}
            items={tasks}
            onReorder={handleReorder}
            setCustomerName={setCustomerName}
            readOnly={false} // ← keep editable on screen
            vehicleInfo={vehicleInfo}
            setVehicleInfo={setVehicleInfo}
          />
        </div>
      </div>

      {/* Controls - hidden during print */}
      {/* <div className="print:hidden mt-6 flex flex-wrap justify-center gap-4 p-4 bg-gray-100 border-t">
        <button
          onClick={saveToPocketBase}
          disabled={saveStatus !== "Save"}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {saveStatus}
        </button>

        <button
          onClick={handlePrint}
          className="px-10 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
        >
          Print / Save as PDF
        </button>
      </div> */}
    </div>
  );
}

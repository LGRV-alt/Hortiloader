/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import DragAndDropList from "../Components/DragAndDropList";
import Vehicle from "../Components/Vehicle";
import pb from "../Components/lib/pbConnect";

export default function TrolleyMapper({
  records,
  customerList,
  vehicleInfoFromExport,
  initialTasks,
}) {
  const [tasks, setTasks] = useState(
    initialTasks ?? records.filter((item) => customerList.includes(item.id))
  );

  const [customerName, setCustomerName] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [isExporting, setIsExporting] = useState(false); // 👈 control what's shown

  const [vehicleInfo, setVehicleInfo] = useState({
    driver: "",
    reg: "",
    code: "",
    date: "",
    vehicleType: "",
    trolleyNumber: 0,
    grid: [], // <- array of customer names
  });

  useEffect(() => {
    if (vehicleInfoFromExport) {
      setVehicleInfo(vehicleInfoFromExport);
    }
  }, [vehicleInfoFromExport]);

  const exportRef = useRef();

  // const saveToPocketBase = async () => {
  //   setSaveStatus("saving");

  //   try {
  //     await pb.collection("trolley_exports").create({
  //       name: `${vehicleInfo.date.split("-").reverse().join("-")}-${
  //         vehicleInfo.driver
  //       }-${vehicleInfo.reg}`,
  //       data: tasks,
  //       vehicleInfo: vehicleInfo,
  //       user: pb.authStore.model.id,
  //     });

  //     setSaveStatus("saved");

  //     // Optionally clear message after a few seconds
  //     setTimeout(() => setSaveStatus("idle"), 3000);
  //   } catch (err) {
  //     console.error("Error saving export to PocketBase:", err);
  //     setSaveStatus("error");

  //     setTimeout(() => setSaveStatus("idle"), 4000);
  //   }
  // };

  const saveToPocketBase = async () => {
    setSaveStatus("saving");

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
        user: pb.authStore.model.id,
      });

      setSaveStatus("updated");
    } catch (error) {
      if (error.status === 404) {
        // If not found, create a new record
        try {
          await pb.collection("trolley_exports").create({
            name,
            data: tasks,
            vehicleInfo,
            user: pb.authStore.model.id,
          });
          setSaveStatus("saved");
        } catch (createErr) {
          console.error("Error creating export in PocketBase:", createErr);
          setSaveStatus("error");
        }
      } else {
        console.error("Error checking for existing export:", error);
        setSaveStatus("error");
      }
    }

    // Reset status after a short delay
    setTimeout(() => setSaveStatus("idle"), 3000);
  };

  const handleReorder = (newOrder) => setTasks(newOrder);

  const exportToPDF = async () => {
    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 100));

    const name = `${vehicleInfo.date.split("-").reverse().join("-")}-${
      vehicleInfo.driver
    }-${vehicleInfo.reg}`;

    // Save/update in PocketBase before exporting PDF
    try {
      try {
        const existing = await pb
          .collection("trolley_exports")
          .getFirstListItem(`name="${name}"`);

        // Update existing record
        await pb.collection("trolley_exports").update(existing.id, {
          name,
          data: tasks,
          vehicleInfo,
          user: pb.authStore.model.id,
        });

        console.log("Export data updated in PocketBase");
      } catch (error) {
        if (error.status === 404) {
          // Record doesn't exist, create new
          await pb.collection("trolley_exports").create({
            name,
            data: tasks,
            vehicleInfo,
            user: pb.authStore.model.id,
          });

          console.log("Export data saved to PocketBase");
        } else {
          throw error;
        }
      }
    } catch (err) {
      console.error("Error saving/updating export to PocketBase:", err);
    }

    // PDF generation and download
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
    const scale =
      Math.min(pdfWidth / canvasWidthMm, pdfHeight / canvasHeightMm) * 0.95;

    const imgWidth = canvasWidthMm * scale;
    const imgHeight = canvasHeightMm * scale;
    const x = (pdfWidth - imgWidth) / 2;
    const y = 0;

    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
    pdf.save(
      `${vehicleInfo.date.split("-").reverse().join("-")}_${
        vehicleInfo.driver
      }.pdf`
    );

    setIsExporting(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Export button (not shown during export) */}

      {/* Exportable content */}
      <div ref={exportRef} className="flex flex-grow h-full">
        <div className="w-1/2 p-2">
          {isExporting && (
            <div className="mt-4 text-base text-gray-600 italic pb-4">
              Created with Hortiloader.com •{" "}
              {new Date().toLocaleDateString().split("-").reverse().join("-")} /{" "}
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
            saveToPocketBase={saveToPocketBase}
            saveStatus={saveStatus}
          />
        </div>

        <div className="w-1/2 p-2">
          <Vehicle
            customerName={customerName}
            items={tasks}
            onReorder={handleReorder}
            setCustomerName={setCustomerName}
            readOnly={isExporting} // 👈 optional: lock inputs or hide elements
            vehicleInfo={vehicleInfo}
            setVehicleInfo={setVehicleInfo}
          />
        </div>
      </div>
    </div>
  );
}

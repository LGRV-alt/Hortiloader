/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import DragAndDropList from "../Components/DragAndDropList";
import Vehicle from "../Components/Vehicle";
import pb from "../api/pbConnect";
import toast from "react-hot-toast";
import { useTaskStore } from "../hooks/useTaskStore";

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
  const [printing, setPrinting] = useState(false);

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
    const name = `${vehicleInfo.driver.toUpperCase()} ${vehicleInfo.reg.toUpperCase()} ${vehicleInfo.date
      .split("-")
      .reverse()
      .join("-")}`;

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
    setPrinting(true);
    try {
      await navigator.clipboard.writeText(suggestedFileName);
      // // Optional: brief visual feedback
      // toast.success(`Copied filename — ready to paste!`, { duration: 2500 });
    } catch (err) {
      console.warn("Clipboard copy failed:", err);
      // Fallback: still open print even if copy fails
    }
    // Open print dialog right after (feels instant)
    window.print();
    setPrinting(false);
    saveToPocketBase();
  };

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
          <DragAndDropList
            setCustomerName={setCustomerName}
            items={tasks}
            onReorder={handleReorder}
            print={handlePrint}
            setVehicleInfo={setVehicleInfo}
            vehicleInfo={vehicleInfo}
            saveToPocketBase={saveToPocketBase}
            saveStatus={saveStatus}
            printing={printing}
          />
          <div className="hidden print:block text-base text-gray-600 italic mb-4">
            Created with Hortiloader.com •{" "}
            {new Date()
              .toLocaleDateString("en-GB")
              .split("/")
              .reverse()
              .join("-")}{" "}
            / {vehicleInfo.code || "N/A"}
          </div>
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
            printing={printing}
          />
        </div>
      </div>
    </div>
  );
}

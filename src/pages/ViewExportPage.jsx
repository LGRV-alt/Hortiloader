import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TrolleyMapper from "./TrolleyMapper";
import pb from "../api/pbConnect";

export default function ViewExportPage() {
  const { id } = useParams();
  const [exportData, setExportData] = useState(null);

  useEffect(() => {
    const fetchExport = async () => {
      try {
        const record = await pb.collection("trolley_exports").getOne(id);
        setExportData(record);
      } catch (err) {
        console.error("Failed to fetch export:", err);
      }
    };

    fetchExport();
  }, [id]);

  if (!exportData) {
    return <p className="p-4">Loading export...</p>;
  }

  return (
    <TrolleyMapper
      initialTasks={exportData.data} // pass full saved object
      vehicleInfoFromExport={exportData.vehicleInfo}
    />
  );
}

/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function WeekdayPage({ records }) {
  const [extras, setExtras] = useState(false);
  const exportRef = useRef();
  const [isExporting, setIsExporting] = useState(false);

  const { year, day, week, number } = useParams();

  const arr = records.filter(
    (record) =>
      record.weekNumber == week &&
      record.year == year &&
      record.other === "none" &&
      record.day[0] === day.toLowerCase()
  );

  const exportToPDF = async () => {
    setIsExporting(true);
    await new Promise((res) => setTimeout(res, 100)); // allow DOM to update

    const name = `${day}-${number}-${year}`;

    const canvas = await html2canvas(exportRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: null,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

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
    const y = 0;

    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
    pdf.save(`${name}.pdf`);

    setIsExporting(false);
  };

  return (
    <div className="m-0 p-0">
      <div
        ref={exportRef}
        className="m-0 p-0 w-full h-full bg-white"
        style={{ margin: 0, padding: 0 }}
      >
        <div className="w-full md:h-36 h-16 flex justify-center items-center bg-slate-300 text-center  border-b-2 border-black">
          <h3 className="md:text-3xl text-xl font-bold">{`${day}-${number} ${year}`}</h3>
        </div>

        <div className="flex flex-col justify-center ">
          {arr.map((record) => (
            <div
              key={record.id}
              className="flex justify-between items-center border-b-2 p-3 pt-12 border-black  md:pl-16 "
            >
              <Link to={`/edit/${record.id}`}>
                <div className="flex hover:border-black hover:border-b-2 gap-1 md:gap-4">
                  <p
                    className={`font-normal md:text-4xl ${
                      record.customerType === "retail"
                        ? "text-blue-700"
                        : record.customerType === "other"
                        ? "text-red-500"
                        : record.customerType === "missed"
                        ? "text-fuchsia-600"
                        : ""
                    }`}
                  >
                    {record.title}
                  </p>
                  <p className="md:text-3xl text-xs  self-end">
                    {record.orderNumber || ""}
                  </p>
                  <p className="md:text-3xl text-xs  self-end">
                    {record.postcode.toUpperCase() || ""}
                  </p>
                </div>
              </Link>

              {extras && (
                <div className="md:text-2xl text-xs flex gap-1 md:gap-4 md:pr-8">
                  {[
                    "Green",
                    "Yellow",
                    "Shelves",
                    // "Pallets",
                    // "Cages",
                    // "Extras",
                  ].map((label) => (
                    <div key={label} className="flex gap-1">
                      <p className="pb-2">{label}</p>
                      <span className="self-end w-6 h-6 md:w-20 md:h-14 border-black border-2"></span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {isExporting && (
          <div className="mt-4 text-sm text-gray-500 italic text-center pb-2">
            Created with Hortiloader.com • {new Date().toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="pb-4 pt-2 w-full flex justify-center">
        <button
          className="w-1/6 mr-2 px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg shadow hover:bg-orange-700 transition"
          onClick={() => setExtras(!extras)}
        >
          Show Extras
        </button>
        <button
          onClick={exportToPDF}
          className="w-1/6 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
        >
          Print
        </button>
      </div>
    </div>
  );
}

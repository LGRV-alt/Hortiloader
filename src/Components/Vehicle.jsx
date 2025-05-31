// import { useState } from "react";

// export default function Vehicle({
//   customerName,
//   setCustomerName,
//   readOnly,
//   vehicleInfo,
//   setVehicleInfo,
// }) {

//   function generateGrid(number) {
//     let arr = [];
//     for (let i = 0; i < number; i++) {
//       arr.push("");
//     }
//     setGridItems(arr);
//   }

//   function handleTrolleyNumber(e) {
//     const num = Number(e.target.value);
//     const newGrid = Array(num).fill(""); // create empty trolley slots
//     setVehicleInfo((prev) => ({
//       ...prev,
//       trolleyNumber: num,
//       grid: newGrid,
//     }));
//   }

//   function handleVehicleSelection(e) {
//     setVehicleInfo((prev) => ({
//       ...prev,
//       vehicleType: e.target.value,
//       grid: [],
//       trolleyNumber: 0,
//     }));
//   }

//   function handleTrolleyName(e, index) {
//     const updatedGrid = [...vehicleInfo.grid];
//     updatedGrid[index] = customerName;
//     setVehicleInfo((prev) => ({
//       ...prev,
//       grid: updatedGrid,
//     }));

//     return (
//       <div
//         className={`grid h-full ${
//           readOnly ? "grid-rows-[1fr]" : "grid-rows-[0.5fr_5fr]"
//         }`}
//       >
//         {/* ------------------- Vehicle Selection ---------------------------- */}
//         {!readOnly && (
//           <div className="flex justify-between items-center p-1 ">
//             <div className="flex gap-1">
//               <div className="border-black border-r-2 pr-2">
//                 <button
//                   onClick={(e) => handleVehicleSelection(e)}
//                   className="w-auto p-1 rounded-2xl border-black border-2 hover:border-blue-500 "
//                   value="lorry"
//                 >
//                   Lorry
//                 </button>{" "}
//                 <button
//                   onClick={(e) => handleVehicleSelection(e)}
//                   className="w-auto p-1 rounded-2xl border-black border-2 hover:border-blue-500 "
//                   value="trailer"
//                 >
//                   Trailer
//                 </button>
//               </div>
//               <div className="pl-2 gap-1 flex">
//                 <button
//                   className="w-auto p-1  rounded-2xl border-black border-2 hover:border-blue-500 "
//                   onClick={() => setCustomerName("Blank")}
//                 >
//                   Blank Trolley
//                 </button>
//                 <button
//                   className="w-auto p-1 rounded-2xl border-black border-2 hover:border-blue-500 "
//                   onClick={() => setCustomerName("")}
//                 >
//                   Erase
//                 </button>
//                 <button
//                   className="w-auto p-1 rounded-2xl border-black border-2 hover:border-blue-500 "
//                   onClick={() => setGridItems([])}
//                 >
//                   Clear All
//                 </button>
//               </div>
//             </div>
//             {/* </div> */}
//             {/*-------------------- Trolley Number Selector ------------------------- */}
//             {/* <div className="border-2 p-4"> */}
//             {/* Trailer Numbers */}
//             {vehicle === "trailer" ? (
//               <ul className="flex gap-2 justify-center items-center">
//                 <button
//                   onClick={(e) => handleTrolleyNumber(e)}
//                   value={3}
//                   className="w-12 rounded-2xl border-black border-2 hover:border-blue-500 "
//                 >
//                   3T
//                 </button>
//                 <button
//                   onClick={(e) => handleTrolleyNumber(e)}
//                   value={6}
//                   className="w-12 rounded-2xl border-black border-2 hover:border-blue-500 "
//                 >
//                   6T
//                 </button>
//                 <button
//                   onClick={(e) => handleTrolleyNumber(e)}
//                   value={7}
//                   className="w-12 rounded-2xl border-black border-2 hover:border-blue-500 "
//                 >
//                   7T
//                 </button>
//               </ul>
//             ) : (
//               // Lorry Numbers
//               <ul className="flex gap-1 justify-center items-center">
//                 <button
//                   onClick={(e) => handleTrolleyNumber(e)}
//                   value={4}
//                   className="w-12 rounded-2xl border-black border-2 hover:border-blue-500 "
//                 >
//                   4T
//                 </button>
//                 <button
//                   onClick={(e) => handleTrolleyNumber(e)}
//                   value={8}
//                   className="w-12 rounded-2xl border-black border-2 hover:border-blue-500 "
//                 >
//                   8T
//                 </button>
//                 <button
//                   onClick={(e) => handleTrolleyNumber(e)}
//                   value={12}
//                   className="w-12 rounded-2xl border-black border-2 hover:border-blue-500 "
//                 >
//                   12T
//                 </button>
//                 <button
//                   onClick={(e) => handleTrolleyNumber(e)}
//                   value={16}
//                   className="w-12 rounded-2xl border-black border-2 hover:border-blue-500 "
//                 >
//                   16T
//                 </button>
//                 <button
//                   onClick={(e) => handleTrolleyNumber(e)}
//                   value={20}
//                   className="w-12 rounded-2xl border-black border-2 hover:border-blue-500 "
//                 >
//                   20T
//                 </button>
//                 <button
//                   onClick={(e) => handleTrolleyNumber(e)}
//                   value={24}
//                   className="w-12 rounded-2xl border-black border-2 hover:border-blue-500 "
//                 >
//                   24T
//                 </button>
//               </ul>
//             )}
//           </div>
//         )}

//         {/* --------------------Vehicle Map Section ---------------------------------- */}
//         <div className="p-7">
//           {/* --------------------Trailer--------------------------------------------- */}
//           {vehicle === "trailer" ? (
//             <div className="h-full flex flex-col items-center p-2">
//               <div
//                 onClick={(e) => handleTrolleyName(e)}
//                 className=" border-black border-4 w-2/3 h-12 flex justify-center items-center hover:bg-white hover:cursor-pointer"
//               ></div>
//               <div
//                 onClick={(e) => handleTrolleyName(e)}
//                 className="border-x-4 border-black w-1/4 h-16 flex justify-center items-center hover:bg-white hover:cursor-pointer"
//               ></div>
//               <div className=" order-2 border-2 border-black w-2/3 h-full grid grid-cols-3 grid-rows-3">
//                 {grid.map((item, index) => (
//                   <p
//                     key={index}
//                     onClick={(e) => handleTrolleyName(e, index)}
//                     className="border-2 text-center border-black flex justify-center items-center hover:bg-white hover:cursor-pointer"
//                   >
//                     {item}
//                   </p>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             // --------------------Lorry---------------------------------------------
//             <div
//               className=" border-4 border-black
//            h-full grid grid-cols-4 grid-rows-6"
//             >
//               {" "}
//               {grid.map((item, index) => (
//                 <p
//                   onClick={(e) => handleTrolleyName(e, index)}
//                   className="h-full w-full p-2 text-center border-2 border-black flex justify-center items-center hover:bg-white hover:cursor-pointer"
//                   key={index}
//                 >
//                   {item}
//                 </p>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }
// }

import { useState } from "react";

export default function Vehicle({
  customerName,
  setCustomerName,
  readOnly,
  vehicleInfo,
  setVehicleInfo,
}) {
  const grid = vehicleInfo.grid || [];
  const vehicle = vehicleInfo.vehicleType;

  // Handle trolley count selection
  function handleTrolleyNumber(e) {
    const num = Number(e.target.value);
    const newGrid = Array(num).fill(""); // create empty trolley slots
    setVehicleInfo((prev) => ({
      ...prev,
      trolleyNumber: num,
      grid: newGrid,
    }));
  }

  // Handle lorry/trailer selection
  function handleVehicleSelection(e) {
    setVehicleInfo((prev) => ({
      ...prev,
      vehicleType: e.target.value,
      grid: [],
      trolleyNumber: 0,
    }));
  }

  // Assign customer name to a trolley slot
  function handleTrolleyName(_, index) {
    const updatedGrid = [...grid];
    updatedGrid[index] = customerName;
    setVehicleInfo((prev) => ({
      ...prev,
      grid: updatedGrid,
    }));
  }

  // Clear the entire grid
  function handleClearGrid() {
    setVehicleInfo((prev) => ({
      ...prev,
      grid: Array(prev.trolleyNumber).fill(""),
    }));
  }

  return (
    <div
      className={`grid h-full ${
        readOnly ? "grid-rows-[1fr]" : "grid-rows-[0.5fr_5fr]"
      }`}
    >
      {/* --- Vehicle Setup Controls --- */}
      {!readOnly && (
        <div className="flex justify-between items-center p-1">
          <div className="flex gap-1">
            <div className="border-black border-r-2 pr-2 gap-1 flex">
              <button
                onClick={handleVehicleSelection}
                className="w-auto p-1 rounded-2xl border-black border-2 hover:border-blue-500"
                value="lorry"
              >
                Lorry
              </button>
              <button
                onClick={handleVehicleSelection}
                className="w-auto p-1 rounded-2xl border-black border-2 hover:border-blue-500"
                value="trailer"
              >
                Trailer
              </button>
            </div>

            <div className="pl-2 gap-1 flex">
              <button
                className="w-auto p-1 rounded-2xl border-black border-2 hover:border-blue-500"
                onClick={() => setCustomerName("Blank")}
              >
                Blank Trolley
              </button>
              <button
                className="w-auto p-1 rounded-2xl border-black border-2 hover:border-blue-500"
                onClick={() => setCustomerName("")}
              >
                Erase
              </button>
              <button
                className="w-auto p-1 rounded-2xl border-black border-2 hover:border-blue-500"
                onClick={handleClearGrid}
              >
                Clear All
              </button>
            </div>
          </div>

          {/* --- Trolley Count Buttons --- */}
          {vehicle === "trailer" ? (
            <ul className="flex gap-2 justify-center items-center">
              {[3, 6, 7].map((val) => (
                <button
                  key={val}
                  onClick={handleTrolleyNumber}
                  value={val}
                  className="w-12 rounded-2xl border-black border-2 hover:border-blue-500"
                >
                  {val}T
                </button>
              ))}
            </ul>
          ) : (
            <ul className="flex gap-1 justify-center items-center">
              {[4, 8, 12, 16, 20, 24].map((val) => (
                <button
                  key={val}
                  onClick={handleTrolleyNumber}
                  value={val}
                  className="w-12 rounded-2xl border-black border-2 hover:border-blue-500"
                >
                  {val}T
                </button>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* --- Vehicle Layout --- */}
      <div className="p-7">
        {vehicle === "trailer" ? (
          <div className="h-full flex flex-col items-center p-2">
            <div
              onClick={(e) => handleTrolleyName(e, 0)}
              className="border-black border-4 w-2/3 h-12 flex justify-center items-center hover:bg-white hover:cursor-pointer"
            >
              {grid[0]}
            </div>
            <div
              onClick={(e) => handleTrolleyName(e, 1)}
              className="border-x-4 border-black w-1/4 h-16 flex justify-center items-center hover:bg-white hover:cursor-pointer"
            >
              {grid[1]}
            </div>
            <div className="order-2 border-2 border-black w-2/3 h-full grid grid-cols-3 grid-rows-3">
              {grid.slice(2).map((item, index) => (
                <p
                  key={index + 2}
                  onClick={(e) => handleTrolleyName(e, index + 2)}
                  className="border-2 text-center border-black flex justify-center items-center hover:bg-white hover:cursor-pointer"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="border-4 border-black h-full grid grid-cols-4 grid-rows-6">
            {grid.map((item, index) => (
              <p
                key={index}
                onClick={(e) => handleTrolleyName(e, index)}
                className="h-full w-full p-2 text-center border-2 border-black flex justify-center items-center hover:bg-white hover:cursor-pointer"
              >
                {item}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

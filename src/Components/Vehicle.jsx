import { useState } from "react";

export default function Vehicle({ customerName }) {
  const [trolleyNumber, setTrolleyNumber] = useState(0);
  const [vehicle, setVehicle] = useState("");
  const [grid, setGridItems] = useState([]);
  console.log(customerName);
  // console.log("Trolley Number " + trolleyNumber);
  // console.log(vehicle);

  function handleTrolleyNumber(e) {
    setTrolleyNumber(e.target.value);
    generateGrid(e.target.value);
  }

  function handleVehicleSelection(e) {
    setVehicle(e.target.value);
  }

  function generateGrid(number) {
    let arr = [];
    for (let i = 0; i < number; i++) {
      arr.push("");
    }
    setGridItems(arr);
  }

  function handleTrolleyName(e) {
    e.target.innerHTML = customerName;
  }
  return (
    <div className="bg-red-500 grid grid-rows-[0.5fr_0.5fr_5fr] h-full">
      {/* ------------------- Vehicle Selection ---------------------------- */}
      <div className="flex gap-5 p-2 justify-center items-center">
        <button
          onClick={(e) => handleVehicleSelection(e)}
          className="w-20 rounded-2xl border-black border-2 hover:border-blue-500 "
          value="lorry"
        >
          Lorry
        </button>{" "}
        <button
          onClick={(e) => handleVehicleSelection(e)}
          className="w-20 rounded-2xl border-black border-2 hover:border-blue-500 "
          value="trailer"
        >
          Trailer
        </button>
      </div>
      {/*-------------------- Trolley Number Selector ------------------------- */}
      <div className="border-2 p-4">
        {/* Trailer Numbers */}
        {vehicle === "trailer" ? (
          <ul className="flex gap-2 justify-center items-center">
            <button
              onClick={(e) => handleTrolleyNumber(e)}
              value={3}
              className="w-12 rounded-2xl border-black border-2 hover:border-blue-500 "
            >
              3T
            </button>
            <button
              onClick={(e) => handleTrolleyNumber(e)}
              value={6}
              className="w-12 rounded-2xl border-black border-2 hover:border-blue-500 "
            >
              6T
            </button>
            <button
              onClick={(e) => handleTrolleyNumber(e)}
              value={7}
              className="w-12 rounded-2xl border-black border-2 hover:border-blue-500 "
            >
              7T
            </button>
          </ul>
        ) : (
          // Lorry Numbers
          <ul className="flex gap-2 justify-center items-center">
            <button
              onClick={(e) => handleTrolleyNumber(e)}
              value={4}
              className="w-12 rounded-2xl border-black border-2 hover:border-blue-500 "
            >
              4T
            </button>
            <button
              onClick={(e) => handleTrolleyNumber(e)}
              value={8}
              className="w-12 rounded-2xl border-black border-2 hover:border-blue-500 "
            >
              8T
            </button>
            <button
              onClick={(e) => handleTrolleyNumber(e)}
              value={12}
              className="w-12 rounded-2xl border-black border-2 hover:border-blue-500 "
            >
              12T
            </button>
            <button
              onClick={(e) => handleTrolleyNumber(e)}
              value={16}
              className="w-12 rounded-2xl border-black border-2 hover:border-blue-500 "
            >
              16T
            </button>
            <button
              onClick={(e) => handleTrolleyNumber(e)}
              value={20}
              className="w-12 rounded-2xl border-black border-2 hover:border-blue-500 "
            >
              20T
            </button>
            <button
              onClick={(e) => handleTrolleyNumber(e)}
              value={24}
              className="w-12 rounded-2xl border-black border-2 hover:border-blue-500 "
            >
              24T
            </button>
          </ul>
        )}
      </div>
      {/* --------------------Vehicle Map Section ---------------------------------- */}
      <div className="bg-blue-500">
        {/* --------------------Trailer--------------------------------------------- */}
        {vehicle === "trailer" ? (
          <div className="bg-orange-500 h-full flex flex-col items-center p-2">
            <div className="bg-green-500 border-black border-2 w-2/3 h-12">
              Boot
            </div>
            <div className="bg-yellow-500 border-2 border-black w-1/4 h-16">
              Triangle
            </div>
            <div className=" order-2 border-2 border-black w-2/3 h-full grid grid-cols-3 grid-rows-3">
              {grid.map((item, index) => (
                <p
                  onClick={(e) => handleTrolleyName(e)}
                  className="border-2 border-black"
                  key={index}
                ></p>
              ))}
            </div>
          </div>
        ) : (
          // --------------------Lorry---------------------------------------------
          <div>Im a lorry</div>
        )}
      </div>
    </div>
  );
}

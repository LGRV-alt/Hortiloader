export default function Vehicle({
  customerName,
  setCustomerName,
  readOnly,
  vehicleInfo,
  setVehicleInfo,
  printing,
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
        printing ? "grid-rows-[1fr]" : "grid-rows-[1fr_6fr]"
      }`}
    >
      {/* --- Vehicle Setup Controls --- */}
      {!readOnly && (
        <div className="print:hidden flex flex-col gap-2 md:gap-0 md:flex-row md:justify-between md:items-center p-1">
          <div className="print:hidden flex justify-center items-center gap-1">
            <div className="border-black md:border-r-2 md:pr-2 gap-1 flex ">
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
            <ul className="print:hidden flex gap-2 justify-center items-center">
              <button
                onClick={handleTrolleyNumber}
                value={5}
                className="w-12 rounded-2xl border-black border-2 hover:border-blue-500"
              >
                {3}T
              </button>
              <button
                onClick={handleTrolleyNumber}
                value={8}
                className="w-12 rounded-2xl border-black border-2 hover:border-blue-500"
              >
                {6}T
              </button>
              <button
                onClick={handleTrolleyNumber}
                value={9}
                className="w-12 rounded-2xl border-black border-2 hover:border-blue-500"
              >
                {7}T
              </button>
            </ul>
          ) : (
            <ul className="print:hidden flex gap-1 justify-center items-center">
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
      <div className="">
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
          <div className="md:border-4 border-2 border-black h-full grid grid-cols-4 grid-rows-6 md:text-base text-xs">
            {grid.map((item, index) => (
              <p
                key={index}
                onClick={(e) => handleTrolleyName(e, index)}
                className="h-full w-full p-2 text-center border-[1px] md:border-2 border-black flex justify-center items-center hover:bg-white hover:cursor-pointer"
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

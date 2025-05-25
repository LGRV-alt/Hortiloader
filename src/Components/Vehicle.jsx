import React, { useState, useEffect } from "react";

export default function Vehicle({ title }) {
  const [trolleyNumber, setTrolleyNumber] = useState(0);
  console.log(trolleyNumber);

  function handleTrolleyNumber(e) {
    setTrolleyNumber(e.target.value);
  }

  return (
    <div className="h-full">
      <div className="border-2 p-4">
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
      </div>
    </div>
  );
}

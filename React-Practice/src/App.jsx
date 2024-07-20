import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="grid-cols-2  grid w-screen">
        <h2 className="text-2xl text-black  bg-red-500 flex justify-center items-center">
          Hello There
        </h2>
        <h2 className="text-2xl text-black  bg-red-500 flex justify-center items-center">
          Hello There
        </h2>
      </div>
    </>
  );
}

export default App;

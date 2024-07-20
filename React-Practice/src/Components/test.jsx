import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <h2 className="text-2xl text-black w-screen h-4">Hello There</h2>
      </div>
    </>
  );
}

export default App;

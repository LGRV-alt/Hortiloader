import { useState } from "react";
import Header from "./Components/Header";
import Body from "./Components/Body";
import Footer from "./Components/Footer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="grid-cols-1 grid-rows-[5rem,4fr,0.5fr] grid w-screen h-dvh overflow-x-hidden">
        <Header></Header>
        <Body></Body>
        <Footer></Footer>
      </div>
    </>
  );
}

export default App;

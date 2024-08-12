import Header from "./Components/Header";
import Body from "./Components/Body";
import Contact from "./templates/Contact";
import { Routes, Route } from "react-router-dom";
import PocketBase from "pocketbase";
import { useEffect, useState } from "react";
import Login from "./Login";
import { isUserValid } from "./Components/lib/pocketbase";
import About from "./templates/About";
import Navbar from "./Components/Navbar";
import CreateCustomer from "./Components/CreateCustomer";

export default function App() {
  const [rec, setRecords] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const pb = new PocketBase("https://hortiloader.pockethost.io");
      const records = await pb.collection("tasks").getFullList({});
      setRecords(records);
    }
    fetchData();
  }, []);
  console.log(rec);

  return (
    <>
      {isUserValid ? (
        <div className="grid-cols-[1fr_10fr] grid-rows-[60px_10fr] grid w-screen h-dvh overflow-x-hidden ">
          <div className="col-start-1 col-end-6 row-start-1 row-end-2">
            <Header></Header>
          </div>
          <div className="col-start-1 col-end-4 row-start-2 row-end-3">
            <Routes>
              <Route path="/" element={<Body records={rec}></Body>} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<CreateCustomer />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div className="grid-cols-1 grid w-screen h-dvh overflow-x-hidden ">
          {/* <Header></Header> */}
          <Login></Login>
        </div>
      )}
    </>
  );
}

// export default App;

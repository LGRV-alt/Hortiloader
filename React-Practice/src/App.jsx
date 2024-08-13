import Header from "./Components/Header";
import Body from "./Components/Body";

import { Routes, Route } from "react-router-dom";
import PocketBase from "pocketbase";
import { useEffect, useState } from "react";
import Login from "./Login";
import { getDateWeek, isUserValid } from "./Components/lib/pocketbase";

import Edit from "./templates/Edit";
import HoldingPage from "./templates/HoldingPage";
import Collect from "./templates/Collect";

export default function App() {
  const currentWeek = getDateWeek();

  const [rec, setRecords] = useState([]);
  const [chosenWeek, setChosenWeek] = useState(currentWeek);
  useEffect(() => {
    async function fetchData() {
      const pb = new PocketBase("https://hortiloader.pockethost.io");
      const records = await pb.collection("tasks").getFullList({});
      setRecords(records);
    }
    fetchData();
  }, []);
  console.log(rec, chosenWeek);

  return (
    <>
      {isUserValid ? (
        <div className="grid-cols-[1fr_10fr] grid-rows-[60px_10fr] grid w-screen h-dvh overflow-x-hidden ">
          <div className="col-start-1 col-end-6 row-start-1 row-end-2">
            <Header setChosenWeek={setChosenWeek}></Header>
          </div>
          <div className="col-start-1 col-end-4 row-start-2 row-end-3">
            <Routes>
              <Route
                path="/"
                element={<Body records={rec} chosenWeek={chosenWeek}></Body>}
              />

              <Route
                path="/holdingPage"
                element={<HoldingPage records={rec} />}
              />

              <Route
                path="/collect"
                element={<Collect records={rec} chosenWeek={chosenWeek} />}
              />
              <Route path="/edit:id" element={<Edit></Edit>} />
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

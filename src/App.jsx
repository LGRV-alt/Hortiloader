import Header from "./Components/Header";
import Body from "./Components/Body";

import { Routes, Route } from "react-router-dom";
import PocketBase from "pocketbase";
import { useEffect, useState } from "react";
import Login from "./Login";
import { isUserValid } from "./Components/lib/pocketbase";

import Edit from "./templates/Edit";
import HoldingPage from "./templates/HoldingPage";
import Collect from "./templates/Collect";
import SearchPage from "./templates/SearchPage";
import CreateCustomer from "./Components/CreateCustomer";

export default function App() {
  const [refresh, setRefresh] = useState(1);
  const [rec, setRecords] = useState([]);
  const [chosenWeek, setChosenWeek] = useState(getCurrentWeek(new Date()));
  const [chosenYear, setChosenYear] = useState(2025);

  function compare(a, b) {
    if (a.created < b.created) {
      return -1;
    }
    if (a.created > b.created) {
      return 1;
    }
    return 0;
  }

  useEffect(() => {
    const pb = new PocketBase("https://hortiloader.pockethost.io");
    pb.collection("tasks").subscribe(
      "*",
      function (e) {
        fetchData();
        // console.log(e.action);
        // console.log(e.record);
      },
      {
        /* other options like expand, custom headers, etc. */
      }
    );

    async function fetchData() {
      const pb = new PocketBase("https://hortiloader.pockethost.io");
      const records = await pb.collection("tasks").getFullList({});

      setRecords(records);
    }
    fetchData();
  }, []);

  // Sort the array to newest created
  rec.sort(compare);

  function getCurrentWeek(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    // Return array of year and week number
    return weekNo;
    // return [d.getUTCFullYear(), weekNo];
  }

  return (
    <>
      {isUserValid ? (
        <div className="grid-cols-[1fr_10fr] grid-rows-[60px_10fr] grid w-screen h-dvh overflow-x-hidden ">
          <div className="col-start-1 col-end-6 row-start-1 row-end-2 ">
            <Header
              setChosenWeek={setChosenWeek}
              setChosenYear={setChosenYear}
              setRefresh={setRefresh}
            ></Header>
          </div>

          <div className="col-start-1 col-end-4 row-start-2 row-end-3">
            <Routes>
              <Route
                path="/"
                element={
                  <Body
                    records={rec}
                    chosenWeek={chosenWeek}
                    chosenYear={chosenYear}
                    refresh={refresh}
                    setRefresh={setRefresh}
                  ></Body>
                }
              />

              <Route
                path="/holdingPage"
                element={<HoldingPage records={rec} />}
              />
              <Route path="/search" element={<SearchPage records={rec} />} />

              <Route
                path="/collect"
                element={
                  <Collect
                    records={rec}
                    chosenWeek={chosenWeek}
                    chosenYear={chosenYear}
                  />
                }
              />
              <Route
                path="/edit/:id"
                element={<Edit setRefresh={setRefresh} records={rec} />}
              />
              <Route
                path="/createCustomer"
                element={
                  <CreateCustomer setRefresh={setRefresh}></CreateCustomer>
                }
              />
            </Routes>
          </div>
        </div>
      ) : (
        <div className="grid-cols-1 grid w-screen h-dvh overflow-x-hidden ">
          <Login></Login>
        </div>
      )}
    </>
  );
}

// export default App;

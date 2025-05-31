import Header from "./Components/Header";
import Body from "./Components/Body";

import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./Login";
import { isUserValid } from "./Components/lib/pocketbase";

import Edit from "./templates/Edit";
import HoldingPage from "./templates/HoldingPage";
import Collect from "./templates/Collect";
import SearchPage from "./templates/SearchPage";
import CreateCustomer from "./Components/CreateCustomer";
import WeekdayPage from "./templates/Weekday";
import TrolleyMapper from "./templates/TrolleyMapper";
import useTasks from "./hooks/useTasks";
import useAutoRefreshOnIdle from "./hooks/useAutoRefreshOnIdle";
import useAuth from "./hooks/useAuth";
import TrolleyExportsPage from "./templates/TrolleyExportsPage";

export default function App() {
  // useAutoRefreshOnIdle();
  const [chosenWeek, setChosenWeek] = useState(getCurrentWeek(new Date()));
  const [chosenYear, setChosenYear] = useState(2025);
  const [edit, setEdit] = useState(false);
  const [customerList, setCustomerList] = useState([]);

  const isAuthenticated = useAuth();

  console.log(customerList);

  // const rec = useTasks();
  // const rec = usePocketbaseRealtimeTasks();
  const { tasks: rec, refetch } = useTasks();

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
      {isAuthenticated ? (
        <div className="overflow-y-scroll grid-cols-[1fr_10fr] grid-rows-[60px_10fr] grid w-screen h-dvh overflow-x-hidden ">
          <div className="col-start-1 col-end-6 row-start-1 row-end-2 ">
            <Header
              setChosenWeek={setChosenWeek}
              setChosenYear={setChosenYear}
              setEdit={setEdit}
              edit={edit}
              setCustomerList={setCustomerList}
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
                    edit={edit}
                    setCustomerList={setCustomerList}
                    customerList={customerList}
                  ></Body>
                }
              />

              <Route
                path="/holdingPage"
                element={<HoldingPage records={rec} />}
              />

              <Route path="/exports" element={<TrolleyExportsPage />} />

              <Route
                path="/trolley-mapper"
                element={
                  <TrolleyMapper records={rec} customerList={customerList} />
                }
              />
              <Route
                path="/weekday/:year/:week/:day/:number"
                element={<WeekdayPage records={rec} />}
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
              <Route path="/edit/:id" element={<Edit records={rec} />} />
              <Route
                path="/createCustomer"
                element={<CreateCustomer></CreateCustomer>}
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

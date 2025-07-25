import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { FaBars, FaTimes } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import LogoTree from "../svg/LogoTree";
import { getDateWeek, signout } from "../../api/pocketbase";
import { useTaskStore } from "../../hooks/useTaskStore";
import { IoIosRefresh } from "react-icons/io";
import toast from "react-hot-toast";
import pb from "../../api/pbConnect";

export default function Header({
  setChosenWeek,
  setChosenYear,
  setEdit,
  edit,
  setCustomerList,
}) {
  const [week, setWeek] = useState(getDateWeek(new Date()));
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthenticated = useAuth();
  const { lastFetched, fetchTasks } = useTaskStore();
  const [refreshing, setRefreshing] = useState(false);

  const user = pb.authStore.record;

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchTasks();
      toast.success("Board Synced");
    } catch (err) {
      console.error("Manual refresh failed:", err);
      toast.error("Manual refresh failed");
    } finally {
      setRefreshing(false);
    }
  };

  const handleWeekChange = (num) => {
    const clamped = Math.min(Math.max(num, 1), 52);
    setWeek(clamped);
    setChosenWeek(clamped);
  };

  const handleYearChange = (e) => {
    setChosenYear(Number(e.target.value));
  };

  function handleMapClick() {
    setEdit((prev) => !prev);
    setMenuOpen(false);
  }

  return (
    <header className="border-b-2 border-black bg-main text-white px-4 py-1 flex justify-between items-center relative h-full">
      {/* Left: Logo and Title */}
      <div
        onClick={() => setMenuOpen(false)}
        className="flex items-center gap-2"
      >
        <Link to="/">
          <LogoTree height="40px" width="40px" />
        </Link>
        <Link to="/">
          <h1 className="text-4xl font-display hidden lg:flex pr-4">
            HortiLoader
          </h1>
        </Link>
        {/* Year Selection and Current Week */}
        <div className=" flex-col hidden md:flex">
          <div>
            <span className="pr-1">Year</span>
            <select
              onChange={handleYearChange}
              className="bg-transparent appearance-none focus:outline-none focus:bg-white focus:text-black"
            >
              <option value={2025}>2025</option>
              <option value={0}>2024</option>
            </select>
          </div>
          <p className=" mr-3">Current Week - {getDateWeek(new Date())}</p>
        </div>
      </div>

      {/* Center: Week/Year controls */}
      {edit ? (
        ""
      ) : (
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col justify-center items-center ">
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <span>
                Sync -{" "}
                {lastFetched
                  ? new Date(lastFetched).toLocaleTimeString()
                  : "Never"}
              </span>
              <button
                onClick={handleManualRefresh}
                disabled={refreshing}
                className="hover:text-blue-500 text-base"
                // className="bg-secondary-colour text-white px-2 py-1 rounded hover:bg-orange-400 disabled:opacity-50"
              >
                <IoIosRefresh />
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button
                className="text-2xl hover:text-blue-500"
                onClick={() => handleWeekChange(week - 1)}
              >
                <GrFormPrevious />
              </button>
              <span>Week</span>
              <select
                value={week}
                onChange={(e) => handleWeekChange(Number(e.target.value))}
                className="bg-transparent appearance-none focus:outline-none focus:bg-white focus:text-black"
              >
                {Array.from({ length: 52 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
              <button
                className="text-2xl hover:text-blue-500"
                onClick={() => handleWeekChange(week + 1)}
              >
                <GrFormNext />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {isAuthenticated && (
          <>
            {edit ? (
              <div className="flex  gap-2">
                <Link
                  className=""
                  onClick={() => setEdit(!edit)}
                  to="/trolley-mapper"
                >
                  <button className="w-24 py-1 px-2 rounded-md hover:bg-regal-blue hover:text-green-600 hover:outline transition-all duration-300 bg-green-600  text-white">
                    Create Run
                  </button>
                </Link>
                <button
                  onClick={() => setCustomerList([])}
                  className="w-24 py-1 px-2 rounded-md hover:bg-regal-blue hover:text-orange-600 hover:outline transition-all duration-200 bg-orange-600  text-white"
                >
                  Clear
                </button>
                <button
                  onClick={() => setEdit((prev) => !prev)}
                  className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                >
                  X
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                {user.role !== "viewer" && (
                  <>
                    <button
                      onClick={() => setEdit((prev) => !prev)}
                      className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 hidden md:flex"
                    >
                      Map
                    </button>

                    <Link to="/createCustomer">
                      <button
                        onClick={() => setMenuOpen(false)}
                        className="bg-green-600 px-3 py-1 rounded hover:bg-green-700 hidden md:flex"
                      >
                        Add Order
                      </button>
                    </Link>
                  </>
                )}
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="ml-2 text-white"
                >
                  {menuOpen ? (
                    <FaTimes fontSize="1.5rem" />
                  ) : (
                    <FaBars fontSize="1.5rem" />
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Nav Menu (absolute) */}
      {menuOpen && (
        <div className="text-center absolute top-full right-0 bg-white border-2 border-black  text-black shadow-md z-50 flex flex-col gap-4 px-6 py-4 w-full md:w-1/6">
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="hover:text-blue-300"
          >
            Home
          </NavLink>
          <NavLink
            to="/collect"
            onClick={() => setMenuOpen(false)}
            className="hover:text-blue-300"
          >
            Collects
          </NavLink>
          <NavLink
            to="/holdingPage"
            onClick={() => setMenuOpen(false)}
            className="hover:text-blue-300"
          >
            Holding
          </NavLink>
          <NavLink
            to="/runs"
            onClick={() => setMenuOpen(false)}
            className="hover:text-blue-300"
          >
            Runs
          </NavLink>
          <NavLink
            to="/trolley-tracker"
            onClick={() => setMenuOpen(false)}
            className="hover:text-blue-300"
          >
            Trolley Tracker
          </NavLink>
          <NavLink
            className={"hover:text-blue-500 flex justify-center items-center"}
            onClick={() => setMenuOpen(false)}
            to="/search"
          >
            Search
          </NavLink>
          <NavLink
            to="/settings"
            onClick={() => setMenuOpen(false)}
            className="hover:text-blue-300"
          >
            Settings
          </NavLink>
          {user.role === "admin" && (
            <NavLink
              to="/logs"
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-300"
            >
              Admin Logs
            </NavLink>
          )}

          <button
            onClick={() => handleMapClick()}
            className="bg-blue-600 px-2 justify-center py-1 rounded hover:bg-blue-700 flex md:hidden text-white"
          >
            Map
          </button>

          <Link to="/createCustomer">
            <button
              onClick={() => setMenuOpen(false)}
              className="bg-green-600 justify-center px-2 w-full py-1 rounded hover:bg-green-700 flex md:hidden text-white"
            >
              Add Order
            </button>
          </Link>
          <button
            onClick={signout}
            className="bg-red-600 px-2 py-1 rounded hover:bg-red-700 text-white"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

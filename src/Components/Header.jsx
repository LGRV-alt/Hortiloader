/* eslint-disable react/prop-types */
import { useState } from "react";
import { getDateWeek, isUserValid, signout } from "./lib/pocketbase";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Hamburger";
import LogoTree from "./LogoTree";
import CloseIcon from "./CloseIcon";
import { CiLogout } from "react-icons/ci";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { FaSearch } from "react-icons/fa";
import Edit from "../templates/Edit";
function Header({
  setChosenWeek,
  setChosenYear,
  setRefresh,
  setEdit,
  edit,
  setCustomerList,
}) {
  const [toggleNav, setToggleNav] = useState(false);

  const [week, setWeek] = useState(getDateWeek(new Date()));

  const weeks = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
  ];

  let weekNumbers = weeks.map((item) => {
    return (
      <option key={item} value={item}>
        {item}
      </option>
    );
  });

  function handleState(e) {
    setChosenWeek(e.target.value);
    setWeek(e.target.value);
    setRefresh(Math.random());
  }

  function handleWeekChange(num) {
    if (num > 52 || num < 1) {
      setChosenWeek(1);
      setWeek(1);
    } else {
      setChosenWeek(num);
      setWeek(num);
    }

    // setRefresh(Math.random());
  }

  function handleYear(e) {
    setChosenYear(Number(e.target.value));
    setRefresh(Math.random());
  }

  return (
    <div
      className={
        "  md:flex-row p-2 md:flex md:justify-between h-full md:items-center bg-regal-blue md:pl-10  "
      }
    >
      <div className="flex items-center justify-center md:flex-row  md:justify-center md:items-center">
        <div className="flex items-center justify-center mr-auto ">
          <LogoTree height={"45px"} width={"45px"}></LogoTree>
        </div>

        <Link to="/">
          <h2 className="font-display text-4xl text-white  md:mr-5 ml-1   ">
            HortiLoader
          </h2>
        </Link>

        <div className="hidden md:flex  md:flex-col mr-2">
          <div className="flex text-sm">
            <p className="text-white text-sm md:text-base">Year - </p>
            <select
              onChange={(e) => handleYear(e)}
              name=""
              id=""
              className="ml-1 appearance-none w-auto bg-transparent text-white focus:text-black focus:bg-white "
            >
              <option value={2025}>2025</option>
              <option value={0}>2024</option>
            </select>
          </div>
          <p className="hidden md:flex text-white text-sm  mr-3">
            Current Week - {getDateWeek(new Date())}
          </p>
        </div>

        <div
          onClick={() => setToggleNav(!toggleNav)}
          className="h-full  w-7 mr-3 flex justify-center items-center md:hidden ml-auto"
        >
          {toggleNav ? (
            <CloseIcon></CloseIcon>
          ) : (
            <Logo fillColor={"white"}></Logo>
          )}
        </div>
      </div>
      <div className="md:flex md:flex-row md:items-center">
        <div className="hidden md:flex md:justify-center items-center">
          <button
            className=" items-center text-2xl text-white cursor-pointer hover:text-red-500 "
            onClick={() => handleWeekChange(week - 1)}
          >
            <GrFormPrevious />
          </button>
          <p className="text-white text-sm md:text-base">Week-</p>
          <select
            onChange={(e) => handleState(e)}
            name=""
            id=""
            className="appearance-none text-center w-auto ml-1 bg-transparent text-white focus:text-black focus:bg-white "
            value={week}
          >
            {weekNumbers}
          </select>
        </div>
        <button
          onClick={() => handleWeekChange(week + 1)}
          className="items-center w-6 text-2xl text-white cursor-pointer hover:text-red-500 "
        >
          <GrFormNext />
        </button>
      </div>

      {!isUserValid ? (
        <p></p>
      ) : (
        <>
          <div
            className={`${
              toggleNav ? "flex" : "hidden"
            } right-0 top-[60px] w-full pr-10 md:pr-0 h-full gap-5 md:justify-center md:items-center text-white  absolute md:static bg-opacity-90 bg-black  md:w-auto md:bg-transparent md:flex  `}
          >
            <div className="flex-col w-full ml-10 mt-10 md:mt-0 md:ml-0 md:flex-row flex gap-5 md:justify-center md:items-center">
              <div className="md:hidden flex items-center">
                <p className="text-white text-sm md:text-base mr-2">Year</p>
                <select
                  onChange={(e) => handleYear(e)}
                  name=""
                  id=""
                  className=" w-16 bg-transparent focus:text-black focus:bg-white  border-white border-2"
                >
                  <option value={2025}>2025</option>
                  <option value={0}>2024</option>
                </select>
              </div>
              <h2 className="md:hidden text-white text-sm md:font-medium mr-3">
                Current Week - {getDateWeek(new Date())}
              </h2>

              <div className="md:hidden flex items-center">
                <p className="text-white text-sm md:text-base mr-2">
                  Selected Week
                </p>
                <select
                  className=" w-12 bg-transparent focus:text-black focus:bg-white  border-white border-2"
                  onChange={(e) => handleState(e)}
                  name=""
                  id=""
                >
                  <option value=""></option>

                  {weekNumbers}
                </select>
              </div>
              {edit ? (
                // ---------------------When in order picking state------------------------------------
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
                </div>
              ) : (
                // --------------------Normal state------------------------------------
                <div className="flex flex-col md:flex-row md:items-center  gap-2">
                  <NavLink
                    // className={({ isActive }) =>
                    //   isActive
                    //     ? "text-secondary-colour font-bold  "
                    //     : "text-white font-normal"
                    // }
                    className={"hover:text-blue-500"}
                    onClick={() => setToggleNav(!toggleNav)}
                    to="/search"
                  >
                    <FaSearch />
                  </NavLink>
                  <NavLink
                    // className={({ isActive }) =>
                    //   isActive
                    //     ? "text-secondary-colour font-bold  "
                    //     : "text-white font-normal "
                    // }
                    className={"hover:text-blue-500"}
                    onClick={() => setToggleNav(!toggleNav)}
                    to="/"
                  >
                    Home
                  </NavLink>
                  <NavLink
                    // className={({ isActive }) =>
                    //   isActive
                    //     ? "text-secondary-colour font-bold  "
                    //     : "text-white font-normal"
                    // }
                    className={"hover:text-blue-500"}
                    onClick={() => setToggleNav(!toggleNav)}
                    to="/collect"
                  >
                    Collects
                  </NavLink>

                  <NavLink
                    // className={({ isActive }) =>
                    //   isActive
                    //     ? "text-secondary-colour font-bold md:w-full "
                    //     : "text-white font-normal md:w-full"
                    // }
                    className={"hover:text-blue-500"}
                    onClick={() => setToggleNav(!toggleNav)}
                    to="/holdingPage"
                  >
                    Holding
                  </NavLink>
                </div>
              )}

              <div className="w-full flex flex-col md:flex-row md:gap-2 gap-5 justify-center items-center ">
                <button
                  className=" w-1/3 md:w-1/2  py-1 px-2 rounded-md hover:bg-regal-blue hover:text-blue-300 hover:outline transition-all duration-300 bg-blue-600  text-white"
                  onClick={() => setEdit(!edit)}
                >
                  {toggleNav ? "Map" : "Map"}
                </button>
                <Link
                  className="w-full"
                  onClick={() => setToggleNav(!toggleNav)}
                  to="/createCustomer"
                >
                  <button className=" w-full md:w-32 py-1 px-2 rounded-md hover:bg-regal-blue hover:text-green-600 hover:outline transition-all duration-300 bg-green-600  text-white">
                    Add Order
                  </button>
                </Link>

                <button
                  className=" w-10 md:w-1/2 md:mr-4 py-1 px-2 rounded-md hover:bg-regal-blue hover:text-red-600 hover:outline transition-all duration-300 bg-red-600  text-white"
                  onClick={signout}
                >
                  <CiLogout fontSize="1.5rem" />
                </button>
              </div>

              <div
                className="h-full w-full"
                onClick={() => setToggleNav(!toggleNav)}
              ></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Header;

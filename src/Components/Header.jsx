/* eslint-disable react/prop-types */
import { useState } from "react";
import { getDateWeek, isUserValid, signout } from "./lib/pocketbase";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Hamburger";
import LogoTree from "./LogoTree";
import CloseIcon from "./CloseIcon";

function Header({ setChosenWeek, setChosenYear, setRefresh }) {
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

        <div className="hidden md:flex md:justify-center items-center mr-2">
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

        <div>
          <h2 className="hidden md:flex text-white text-sm md:font-medium mr-3">
            Current Week - {getDateWeek(new Date())}
          </h2>
          <div className="hidden md:flex md:justify-center items-center">
            <p className="text-white text-sm md:text-base">Selected Week - </p>
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

      {!isUserValid ? (
        <p></p>
      ) : (
        <>
          <div
            className={`${
              toggleNav ? "flex" : "hidden"
            } right-0 w-full pr-10 md:pr-0 h-full gap-5 md:justify-center md:items-center text-white  absolute md:static bg-opacity-90 bg-black  md:w-auto md:bg-transparent md:flex  `}
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

              <NavLink
                // className="hover:text-secondary-colour  transition-all"
                className={({ isActive }) =>
                  isActive
                    ? "text-secondary-colour font-bold  "
                    : "text-white font-normal "
                }
                onClick={() => setToggleNav(!toggleNav)}
                to="/"
              >
                Whiteboard
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "text-secondary-colour font-bold  "
                    : "text-white font-normal"
                }
                // className="hover:text-secondary-colour  transition-all"
                onClick={() => setToggleNav(!toggleNav)}
                to="/collect"
              >
                Collects
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "text-secondary-colour font-bold  "
                    : "text-white font-normal"
                }
                // className="hover:text-secondary-colour  transition-all"
                onClick={() => setToggleNav(!toggleNav)}
                to="/search"
              >
                Search
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "text-secondary-colour font-bold md:w-full "
                    : "text-white font-normal md:w-full"
                }
                // className="hover:text-secondary-colour md:w-full transition-all"
                onClick={() => setToggleNav(!toggleNav)}
                to="/holdingPage"
              >
                Holding
              </NavLink>
              <div className="w-full flex flex-col md:flex-row md:gap-2 gap-5 justify-center items-center ">
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
                  className=" w-1/3 md:w-1/2 md:mr-4 py-1 px-2 rounded-md hover:bg-regal-blue hover:text-red-600 hover:outline transition-all duration-300 bg-red-600  text-white"
                  onClick={signout}
                >
                  Signout
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

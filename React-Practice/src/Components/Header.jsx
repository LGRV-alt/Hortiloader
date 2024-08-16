/* eslint-disable react/prop-types */
import { useState } from "react";
import { getDateWeek, isUserValid, signout } from "./lib/pocketbase";
import { Link } from "react-router-dom";

function Header({ setChosenWeek, setRefresh }) {
  const [toggleNav, setToggleNav] = useState(false);

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

    setRefresh(Math.random());
  }
  return (
    <div
      className={
        "  md:flex-row md:flex md:justify-between h-full md:items-center bg-regal-blue md:pl-10  "
      }
    >
      <div className=" px-2 pt-2 flex justify-between md:flex-row  md:justify-center md:items-center">
        <Link to="/">
          <h2 className="mr-2 text-2xl text-white font-semibold md:mr-5">
            HortiLoader
          </h2>
        </Link>

        <h2 className="hidden md:flex text-white text-sm md:font-medium mr-3">
          Current Week - {getDateWeek()}
        </h2>

        <div className="hidden md:flex md:justify-center items-center">
          <p className="text-white text-sm md:text-base mr-2">Selected Week</p>
          <select onChange={(e) => handleState(e)} name="" id="">
            <option value=""></option>

            {weekNumbers}
          </select>
        </div>
        {/* <input
            className="bg-transparent border-white border-2 text-center  text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            type="number"
            min={1}
            max={52}
            onChange={(e) => handleState(e)}
          />
        </div> */}
        <button
          className="mb-2 md:hidden text-sm w-28 h-8  rounded-md bg-green-500 hover:bg-green-600 text-white"
          onClick={() => setToggleNav(!toggleNav)}
        >
          {toggleNav ? "Close" : "Open"}
        </button>
      </div>

      {!isUserValid ? (
        <p></p>
      ) : (
        <>
          <div
            className={`${
              toggleNav ? "flex" : "hidden"
            } w-full pr-10 h-full gap-5 md:justify-center md:items-center text-white  absolute md:static bg-opacity-90 bg-black  md:w-auto md:bg-transparent md:flex  `}
          >
            <div className="flex-col w-full ml-10 mt-10 md:mt-0 md:ml-0 md:flex-row flex gap-5 md:items-center">
              <h2 className="md:hidden text-white text-sm md:font-medium mr-3">
                Current Week - {getDateWeek()}
              </h2>

              <div className="md:hidden flex items-center">
                <p className="text-white text-sm md:text-base mr-2">
                  Selected Week
                </p>
                <select
                  className="text-black"
                  onChange={(e) => handleState(e)}
                  name=""
                  id=""
                >
                  <option value=""></option>

                  {weekNumbers}
                </select>
              </div>

              <Link onClick={() => setToggleNav(!toggleNav)} to="/">
                Whiteboard
              </Link>
              <Link onClick={() => setToggleNav(!toggleNav)} to="/collect">
                Collects
              </Link>
              <Link onClick={() => setToggleNav(!toggleNav)} to="/holdingPage">
                Holding Page
              </Link>
              <Link
                onClick={() => setToggleNav(!toggleNav)}
                to="/createCustomer"
              >
                Create Customer
              </Link>

              <button
                className="mr-4 py-2 px-4 rounded-md bg-green-500 hover:bg-green-600 text-white"
                onClick={signout}
              >
                Signout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Header;

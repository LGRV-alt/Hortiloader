/* eslint-disable react/prop-types */
import { useState } from "react";
import { getDateWeek, isUserValid, signout } from "./lib/pocketbase";
import { Link } from "react-router-dom";

function Header({ setChosenWeek }) {
  const [toggleNav, setToggleNav] = useState(false);
  return (
    <div
      className={
        "pl-2 grid grid-cols-2 grid-rows-1  md:flex-row md:flex md:justify-between h-full md:items-center bg-regal-blue md:pl-10  "
      }
    >
      <div className="flex flex-col md:flex-row  md:justify-center md:items-center">
        <Link to="/">
          <h2 className="mr-2 md:text-2xl text-white font-semibold md:mr-5">
            HortiLoader
          </h2>
        </Link>

        <h2 className=" text-white text-sm md:font-medium mr-3">
          Current Week - {getDateWeek()}
        </h2>

        <div className="flex md:justify-center items-center">
          <p className="text-white text-sm md:text-base mr-2">Selected Week</p>
          <input
            className="bg-transparent border-white border-2 text-center  text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            type="number"
            min={1}
            max={52}
            onChange={(e) => setChosenWeek(e.target.value)}
          />
        </div>
      </div>

      {!isUserValid ? (
        <p></p>
      ) : (
        <>
          <div
            className={`${
              toggleNav ? "flex" : "hidden"
            } w-full pr-10 h-full gap-5 md:justify-center md:items-center text-white  absolute md:static bg-black  md:w-auto md:bg-transparent md:flex  `}
          >
            <div className="flex-col w-full ml-10 mt-10 md:mt-0 md:ml-0 md:flex-row flex gap-5 md:items-center">
              <button
                className="md:hidden justify-end items-end flex"
                onClick={() => setToggleNav(!toggleNav)}
              >
                Close
              </button>
              <Link to="/">Whiteboard</Link>
              <Link to="/collect">Collects</Link>
              <Link to="/holdingPage">Holding Page</Link>

              <button
                className="mr-4 py-2 px-4 rounded-md bg-green-500 hover:bg-green-600 text-white"
                onClick={signout}
              >
                Signout
              </button>
            </div>
          </div>
          <button
            className="md:hidden   w-1/2 h-1/2 text-sm  rounded-md bg-green-500 hover:bg-green-600 text-white"
            onClick={() => setToggleNav(!toggleNav)}
          >
            Open Nav
          </button>
        </>
      )}
    </div>
  );
}

export default Header;

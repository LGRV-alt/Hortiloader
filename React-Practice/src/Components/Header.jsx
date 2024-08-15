/* eslint-disable react/prop-types */
import { useState } from "react";
import { getDateWeek, isUserValid, signout } from "./lib/pocketbase";
import { Link } from "react-router-dom";

function Header({ setChosenWeek }) {
  const [toggleNav, setToggleNav] = useState(true);
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
        <div
          className={` ${
            toggleNav ? "flex" : "hidden"
          } absolute md:static   bg-black  md:w-auto md:bg-transparent md:flex  `}
        >
          <div className="gap-5 justify-center items-center text-white flex">
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
      )}
    </div>
  );
}

export default Header;

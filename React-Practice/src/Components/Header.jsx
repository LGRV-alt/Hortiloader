/* eslint-disable react/prop-types */
import { getDateWeek, isUserValid, signout } from "./lib/pocketbase";
import { Link } from "react-router-dom";

function Header({ setChosenWeek }) {
  return (
    <>
      <div
        className={
          " flex justify-between h-full items-center bg-regal-blue pl-10  "
        }
      >
        <div className="flex justify-center items-center">
          <h2 className="text-2xl text-white font-semibold mr-5">
            HortiLoader
          </h2>

          <h2 className=" text-white font-medium mr-3">
            Current Week - {getDateWeek()}
          </h2>
        </div>
        <div className="flex justify-center items-center">
          <p className="text-white mr-2">Selected Week</p>
          <input
            className="bg-transparent border-white border-2 text-center  text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            type="number"
            min={1}
            max={52}
            onChange={(e) => setChosenWeek(e.target.value)}
          />
        </div>

        {!isUserValid ? (
          <p></p>
        ) : (
          <div className="flex gap-5 justify-center items-center text-white">
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
        )}
      </div>
    </>
  );
}

export default Header;

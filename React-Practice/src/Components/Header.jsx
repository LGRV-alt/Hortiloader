import { getDateWeek, isUserValid, signout } from "./lib/pocketbase";
import { Link } from "react-router-dom";

function Header() {
  isUserValid;
  return (
    <>
      <div
        className={
          " flex justify-between h-full items-center bg-regal-blue pl-10  "
        }
      >
        <h2 className="text-2xl text-white font-semibold mr-5">HortiLoader</h2>
        <h2 className=" text-white font-medium">
          Current Week - {getDateWeek()}
        </h2>

        {!isUserValid ? (
          <p></p>
        ) : (
          <div className="flex gap-5 justify-center items-center text-white">
            <Link to="/">Whiteboard</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Collects</Link>

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

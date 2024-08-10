import { isUserValid, signout } from "./lib/pocketbase";

function Header() {
  isUserValid;
  return (
    <>
      <div
        className={
          " flex justify-between items-center  pl-10 border-b-2 border-black mt-2"
        }
      >
        <h2 className="text-2xl">Hortiloader</h2>
        {!isUserValid ? (
          <p></p>
        ) : (
          <button
            className="border border-green-500 text-green-500 py-2 px-4 rounded-md ml-4 hover:bg-green-500 hover:text-white"
            onClick={signout}
          >
            Signout
          </button>
        )}
      </div>
    </>
  );
}

export default Header;

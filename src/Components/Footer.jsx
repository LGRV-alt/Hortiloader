import { getDateWeek } from "./lib/pocketbase";

function Footer() {
  return (
    <>
      <h2 className="text-2xl text-white bg-regal-blue flex  flex-col">
        <p className="text-sm">Current Week - {getDateWeek()}</p>
        <p>Im a sidebar</p>
      </h2>
    </>
  );
}

export default Footer;

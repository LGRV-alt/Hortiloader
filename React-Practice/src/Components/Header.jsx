function Header() {
  function getDateWeek(date) {
    const currentDate = typeof date === "object" ? date : new Date();
    const januaryFirst = new Date(currentDate.getFullYear(), 0, 1);
    const daysToNextMonday =
      januaryFirst.getDay() === 1 ? 0 : (7 - januaryFirst.getDay()) % 7;
    const nextMonday = new Date(
      currentDate.getFullYear(),
      0,
      januaryFirst.getDate() + daysToNextMonday
    );

    return currentDate < nextMonday
      ? 52
      : currentDate > nextMonday
      ? Math.ceil((currentDate - nextMonday) / (24 * 3600 * 1000) / 7)
      : 1;
  }

  const currentDate = new Date();
  const weekNumber = getDateWeek();

  console.log("Week number of " + currentDate + " is : " + weekNumber);
  return (
    <>
      <div
        className={
          " flex justify-between items-center  pl-10 border-b-2 border-black mt-2"
        }
      >
        <h2 className="text-2xl">Hortiloader</h2>
        <p className="pr-6 ">Current Week - {weekNumber}</p>
      </div>
    </>
  );
}

export default Header;

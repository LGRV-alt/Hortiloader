/* eslint-disable react/prop-types */

import DayColumn from "./DayColumn";

export default function Body({
  records,
  chosenWeek,
  chosenYear,
  refresh,
  setRefresh,
}) {
  refresh;
  const filterUsersByDay = (day) => {
    // eslint-disable-next-line react/prop-types
    return records.filter(
      (record) =>
        (record.day == day) &
        (record.weekNumber == chosenWeek) &
        (record.other == "none") &
        (record.year === chosenYear)
    );
  };

  // Working on this

  const daysOfWeek = {
    1: [1, 2, 3, 4, 5, 6, 7],
    2: [8, 9, 10, 11, 12, 13, 14],
    3: [15, 16, 17, 18, 19, 20, 21],
    4: [22, 23, 24, 25, 26, 27, 28],
    5: [29, 30, 31, 1, 2, 3, 4],
    6: [5, 6, 7, 8, 9, 10, 11],
    7: [12, 13, 14, 15, 16, 17, 18],
    8: [19, 20, 21, 22, 23, 24, 25],
    9: [26, 27, 28, 29, 1, 2, 3],
    10: [4, 5, 6, 7, 8, 9, 10],
    11: [11, 12, 13, 14, 15, 16, 17],
    12: [18, 19, 20, 21, 22, 23, 24],
    13: [25, 26, 27, 28, 29, 30, 31],
    14: [1, 2, 3, 4, 5, 6, 7],
    15: [8, 9, 10, 11, 12, 13, 14],
    16: [15, 16, 17, 18, 19, 20, 21],
    17: [22, 23, 24, 25, 26, 27, 28],
    18: [29, 30, 1, 2, 3, 4, 5],
    19: [6, 7, 8, 9, 10, 11, 12],
    20: [13, 14, 15, 16, 17, 18, 19],
    21: [20, 21, 22, 23, 24, 25, 26],
    22: [27, 28, 29, 30, 31, 1, 2],
    23: [3, 4, 5, 6, 7, 8, 9],
    24: [10, 11, 12, 13, 14, 15, 16],
    25: [17, 18, 19, 20, 21, 22, 23],
    26: [24, 25, 26, 27, 28, 29, 30],
    27: [1, 2, 3, 4, 5, 6, 7],
    28: [8, 9, 10, 11, 12, 13, 14],
    29: [15, 16, 17, 18, 19, 20, 21],
    30: [22, 23, 24, 25, 26, 27, 28],
    31: [29, 30, 31, 1, 2, 3, 4],
    32: [5, 6, 7, 8, 9, 10, 11],
    33: [12, 13, 14, 15, 16, 17, 18],
    34: [19, 20, 21, 22, 23, 24, 25],
    35: [26, 27, 28, 29, 30, 31, 1],
    36: [2, 3, 4, 5, 6, 7, 8],
    37: [9, 10, 11, 12, 13, 14, 15],
    38: [16, 17, 18, 19, 20, 21, 22],
    39: [23, 24, 25, 26, 27, 28, 29],
    40: [30, 1, 2, 3, 4, 5, 6],
    41: [7, 8, 9, 10, 11, 12, 13],
    42: [14, 15, 16, 17, 18, 19, 20],
    43: [21, 22, 23, 24, 25, 26, 27],
    44: [28, 29, 30, 31, 1, 2, 3],
    45: [4, 5, 6, 7, 8, 9, 10],
    46: [11, 12, 13, 14, 15, 16, 17],
    47: [18, 19, 20, 21, 22, 23, 24],
    48: [25, 26, 27, 28, 29, 30, 1],
    49: [2, 3, 4, 5, 6, 7, 8],
    50: [9, 10, 11, 12, 13, 14, 15],
    51: [16, 17, 18, 19, 20, 21, 22],
    52: [23, 24, 25, 26, 27, 28, 29],
  };

  const monday = filterUsersByDay("monday");
  const tuesday = filterUsersByDay("tuesday");
  const wednesday = filterUsersByDay("wednesday");
  const thursday = filterUsersByDay("thursday");
  const friday = filterUsersByDay("friday");
  const saturday = filterUsersByDay("saturday");
  const sunday = filterUsersByDay("sunday");

  return (
    <div className=" flex flex-col h-full">
      <div className="hidden md:block">
        {/* <CreateCustomer></CreateCustomer> */}
      </div>
      <div className="grid grid0=-row-7 grid-cols-1 grid-rows-1 md:grid-cols-6 md:grid-rows-2 md:outline h-full">
        <div className=" mb-10 md:mb-0 md:border-r-2 row-span-2 border-black">
          <DayColumn
            arr={monday}
            day={"Monday"}
            route={"Glasgow Wholesale"}
            numberOfDay={daysOfWeek[chosenWeek][0]}
            refresh={refresh}
            setRefresh={setRefresh}
          ></DayColumn>
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 row-span-2 border-black">
          <DayColumn
            arr={tuesday}
            day={"Tuesday"}
            route={"Edinburgh + Lanark"}
            numberOfDay={daysOfWeek[chosenWeek][1]}
            refresh={refresh}
            setRefresh={setRefresh}
          ></DayColumn>
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 row-span-2 border-black">
          <DayColumn
            arr={wednesday}
            day={"Wednesday"}
            route={"Dumfries/South"}
            numberOfDay={daysOfWeek[chosenWeek][2]}
            refresh={refresh}
            setRefresh={setRefresh}
          ></DayColumn>
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 row-span-2 border-black">
          <DayColumn
            arr={thursday}
            day={"Thursday"}
            route={"North"}
            numberOfDay={daysOfWeek[chosenWeek][3]}
            refresh={refresh}
            setRefresh={setRefresh}
          ></DayColumn>
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 row-span-2 border-black">
          <DayColumn
            arr={friday}
            day={"Friday"}
            route={"Ayrshire + Glasgow Retails"}
            numberOfDay={daysOfWeek[chosenWeek][4]}
            refresh={refresh}
            setRefresh={setRefresh}
          ></DayColumn>
        </div>
        <div className="mb-10 md:mb-0 md:border-r-2 md:row-start-1 md:row-end-2 md:col-start-6 border-black">
          <DayColumn
            arr={saturday}
            day={"Saturday"}
            route={"Misc"}
            numberOfDay={daysOfWeek[chosenWeek][5]}
            refresh={refresh}
            setRefresh={setRefresh}
          ></DayColumn>
        </div>
        <div className="mb-10 md:border-t-2 md:mb-0 md:border-r-2 md:row-start-2 md:row-end-3 md:col-start-6 border-black">
          <DayColumn
            arr={sunday}
            day={"Sunday"}
            route={"Misc"}
            numberOfDay={daysOfWeek[chosenWeek][6]}
            refresh={refresh}
            setRefresh={setRefresh}
          ></DayColumn>
        </div>
      </div>
    </div>
  );
}

// export default Body;

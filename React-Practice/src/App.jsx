import Header from "./Components/Header";
import Body from "./Components/Body";

import PocketBase from "pocketbase";
import { useEffect, useState } from "react";
import Login from "./Login";
import { isUserValid } from "./Components/lib/pocketbase";

export default function App() {
  console.log(isUserValid);
  const [rec, setRecords] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const pb = new PocketBase("https://hortiloader.pockethost.io");
      const records = await pb.collection("tasks").getFullList({});
      setRecords(records);
    }
    fetchData();
  }, []);
  console.log(rec);

  return (
    <>
      <div className="grid-cols-1 grid-rows-[1fr_10fr] grid w-screen h-dvh overflow-x-hidden ">
        <Header></Header>
        {isUserValid ? <Body records={rec}></Body> : <Login></Login>}
      </div>
    </>
  );
}

// export default App;

import Header from "./Components/Header";
import Body from "./Components/Body";
import Footer from "./Components/Footer";
import PocketBase from "pocketbase";
import { useEffect, useState } from "react";
import Login from "./Login";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

export default function App() {
  const [rec, setRecords] = useState([]);
  const queryClient = new QueryClient();
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
      <QueryClientProvider client={queryClient}>
        <div className="grid-cols-1 grid-rows-[1fr,10fr,0.5fr] grid w-screen h-dvh overflow-x-hidden">
          <Header></Header>
          {/* <Body records={rec}></Body> */}
          <Login></Login>
          <Footer></Footer>
        </div>
      </QueryClientProvider>
    </>
  );
}

// export default App;

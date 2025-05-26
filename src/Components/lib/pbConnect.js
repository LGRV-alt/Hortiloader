// src/Components/lib/pbConnect.js
import PocketBase from "pocketbase";

const pb = new PocketBase("https://hortiloader.pockethost.io");

// debug: in Chrome/Firefox console you should see exactly this:
console.log("📡 PocketBase baseUrl:", pb.baseUrl);
// expect: "https://hortiloader.pockethost.io"
// and GET https://hortiloader.pockethost.io/api/realtime returns 200

export default pb;

// /Components/lib/pocketbase.js
import PocketBase from "pocketbase";

const pb = new PocketBase("https://hortiloader.pockethost.io");
pb.autoCancellation(false);

export default pb;

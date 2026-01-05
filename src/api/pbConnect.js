import PocketBase from "pocketbase";

// Prod
// const pb = new PocketBase("https://horti.pockethost.io");

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

pb.autoRefreshThreshold = 30 * 60;

// Local
// const pb = new PocketBase("http://127.0.0.1:8090");

export default pb;

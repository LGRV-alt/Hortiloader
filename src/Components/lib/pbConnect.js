import PocketBase from "pocketbase";

// Prod
const pb = new PocketBase("https://horti.pockethost.io");

// Local
// const pb = new PocketBase("http://127.0.0.1:8090");

export default pb;

// import PocketBase from "pocketbase";

// if (!globalThis.__PB_INSTANCE) {
//   globalThis.__PB_INSTANCE = new PocketBase(import.meta.env.VITE_PB_URL);
// }
// export default globalThis.__PB_INSTANCE;

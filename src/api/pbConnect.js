import PocketBase from "pocketbase";

// Prod
const pb = new PocketBase("https://horti.pockethost.io");

// Local
// const pb = new PocketBase("http://127.0.0.1:8090");

export default pb;

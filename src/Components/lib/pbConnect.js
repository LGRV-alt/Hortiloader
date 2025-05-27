// import PocketBase from "pocketbase";

// const pb = new PocketBase("https://horti.pockethost.io");

// export default pb;

import PocketBase from "pocketbase";

const pb = globalThis.pb ?? new PocketBase("https://horti.pockethost.io");
if (process.env.NODE_ENV !== "production") globalThis.pb = pb;

export default pb;

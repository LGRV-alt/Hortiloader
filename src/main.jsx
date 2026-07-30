import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { HashRouter } from "react-router-dom";

// Applied once here, before React even renders, so the stored theme takes
// effect regardless of whether any DarkModeToggle instance happens to be
// mounted (it previously depended entirely on that component's useEffect).
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  // <HashRouter>
  //   <React.StrictMode>
  //     <App />
  //   </React.StrictMode>
  // </HashRouter>
  <HashRouter>
    <App />
  </HashRouter>
);

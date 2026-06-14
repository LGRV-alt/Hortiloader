import { useEffect, useState } from "react";
import { MdDarkMode } from "react-icons/md";
import { FiSun } from "react-icons/fi";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button onClick={() => setDark(!dark)}>
      {dark ? (
        <FiSun fontSize="1.5rem" color="yellow" />
      ) : (
        <MdDarkMode fontSize="1.5rem " color="white" />
      )}
    </button>
  );
}

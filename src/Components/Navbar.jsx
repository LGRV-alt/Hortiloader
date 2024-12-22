import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="bg-slate-300 h-full flex justify-center pt-20">
      <ul>
        <li>
          <Link to="/">Whiteboard</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Collects</Link>
        </li>
      </ul>
    </div>
  );
}

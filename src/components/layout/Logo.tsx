
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="h-8 w-8">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="h-8 w-8 text-cyan-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm5 0l3 3m0 0l3-3m-3 3V6m0 0l3 3m-3-3l-3 3"
          />
        </svg>
      </div>
      <span className="hidden sm:inline-block text-xl font-bold text-white">
        Neural Call
      </span>
    </Link>
  );
}

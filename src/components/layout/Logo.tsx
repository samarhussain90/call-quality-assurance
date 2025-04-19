import { Link } from "react-router-dom";
import { Brain } from "lucide-react";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-800/50 transition-colors">
      <div className="relative flex items-center justify-center h-8 w-8">
        <Brain className="h-7 w-7 text-cyan-500" />
        <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-pulse" />
      </div>
      <span className="hidden sm:inline-block text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
        Neural Call
      </span>
    </Link>
  );
}

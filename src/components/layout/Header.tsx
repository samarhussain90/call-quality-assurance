import { Link } from "react-router-dom";
import { BarChart3, FolderOpen, Settings, User } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/75">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <Logo />
          
          <nav className="flex items-center space-x-1">
            <Link 
              to="/campaigns"
              className="flex items-center space-x-2 rounded-md px-3 py-2 text-gray-200 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <FolderOpen size={20} />
              <span>Campaigns</span>
            </Link>
            <Link
              to="/reports"
              className="flex items-center space-x-2 rounded-md px-3 py-2 text-gray-200 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <BarChart3 size={20} />
              <span>Reports</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center space-x-2 rounded-md px-3 py-2 text-gray-200 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-200 hover:bg-gray-800 hover:text-white"
          >
            <User size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
}

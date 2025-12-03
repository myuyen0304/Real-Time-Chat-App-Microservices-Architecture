import { Menu } from "lucide-react";
import React from "react";

interface ChatHeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const ChatHeader = ({ setSidebarOpen }: ChatHeaderProps) => {
  return (
    <div className="sm:hidden fixed top-4 right-4 z-30">
      <button
        onClick={() => setSidebarOpen(true)}
        className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
      >
        <Menu className="w-5 h-5 text-gray-200" />
      </button>
    </div>
  );
};

export default ChatHeader;

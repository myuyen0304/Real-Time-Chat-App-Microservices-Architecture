import { User } from "@/context/AppContext";
import { Menu, UserCircle } from "lucide-react";
import React from "react";

interface ChatHeaderProps {
  user: User | null;
  setSidebarOpen: (open: boolean) => void;
  isTyping: boolean;
}

const ChatHeader = ({ user, setSidebarOpen, isTyping }: ChatHeaderProps) => {
  return (
    <>
      <div className="sm:hidden fixed top-4 right-4 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-200" />
        </button>
      </div>
      {/* Chat header */}
      <div className="mb-6 bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
                  <UserCircle className="w-8 h-8 text-gray-300" />
                </div>
                {/* online user setup */}
              </div>
              {/* user info */}
              <div className="flex-1 flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-white truncate">
                  {user.name}
                </h2>
                {isTyping && (
                  <p className="text-sm text-gray-400">Đang gõ...</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
                <UserCircle className="w-8 h-8 text-gray-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-400">
                  Select a conversation
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Choose a chat from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatHeader;

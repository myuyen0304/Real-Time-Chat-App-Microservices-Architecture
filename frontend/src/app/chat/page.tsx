"use client";

import ChatSidebar from "@/components/ChatSidebar";
import Loading from "@/components/Loading";
import { useAppData, User } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export interface Message{
  _id: string;
  chatId: string;
  sender: string;
  text?: string;
  image?:{
    url: string;
    publiId: string;
  };
  messageType: "text" | "image";
  seen: boolean;
  seenAt?: string;
  createdAt: string;

}
const ChatApp = () => {
  const { loading, isAuth, logoutUser, chats, user: loggedInUser, users, fetchChats, setChats} = useAppData();

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [siderbarOpen, setSiderbarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAllUser, setShowAllUser] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeOut, setTypingTimeOut] = useState<NodeJS.Timeout | null>(null);


  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuth) {
      router.replace("/login"); // Dùng replace thay vì push để không lưu vào history
    }
  }, [isAuth, router, loading]);

  const handleLogout = () => logoutUser();
  // Không render gì nếu chưa auth
  if (loading || !isAuth) {
    return <Loading />;
  }

  return <div className="min-h-screen flex bg-gray-900 text-white required: overflow-hidden ">
    <ChatSidebar 
    sidebarOpen={siderbarOpen} 
    setSidebarOpen={setSiderbarOpen} 
    showAllUsers={showAllUser} 
    setShowAllUsers={setShowAllUser} 
    users={users} 
    loggedInUser={loggedInUser} 
    chats={chats} 
    selectedUser={selectedUser} 
    setSelectedUser={setSelectedUser} 
    handleLogout={handleLogout}/>

    </div>;
};

export default ChatApp;

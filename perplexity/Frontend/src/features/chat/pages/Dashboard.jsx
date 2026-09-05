import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useChat } from "../hooks/useChat";
import { setUser } from "../../auth/auth.slice";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const searchInputRef = useRef(null);
  const profileMenuRef = useRef(null);
  const attachMenuRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const {
    chats,
    activeChatId,
    messages,
    isChatsLoading,
    isMessagesLoading,
    isSending,
    handleSendMessage,
    handleSelectChat,
    handleCreateNewChat,
    handleDeleteChat,
  } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  // Handle window resize for smart responsive sidebar default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target)) {
        setIsAttachMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newFile = {
            id: Math.random().toString(36).substring(7),
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            base64: reader.result,
            preview: file.type.startsWith("image/") ? reader.result : null,
          };
          setAttachedFiles((prev) => [...prev, newFile]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeAttachedFile = (id) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() && attachedFiles.length === 0) return;
    
    const imagePayload = attachedFiles.length > 0 ? attachedFiles[0].base64 : null;
    const userText = inputText.trim();

    setInputText("");
    setAttachedFiles([]);

    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }

    handleSendMessage(userText, imagePayload);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenSearch = () => {
    setIsSidebarOpen(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    dispatch(setUser(null));
  };

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Filter recent chats based on search query
  const filteredChats = chats.filter((c) =>
    (c.title || "Untitled Chat").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main
      className={`relative h-full w-full flex font-handwritten overflow-hidden transition-colors duration-300 ${
        isDarkMode
          ? "bg-[#000000] text-zinc-100"
          : "bg-[#f8fafc] text-zinc-900 light-theme"
      }`}
    >
      {/* Mobile Semi-transparent Overlay Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden transition-opacity duration-300"
        />
      )}

      {/* 1. Left Sidebar */}
      <aside
        className={`fixed md:relative z-40 inset-y-0 left-0 flex flex-col justify-between shrink-0 h-full overflow-hidden transition-all duration-300 ease-in-out ${
          isDarkMode
            ? "bg-[#000000] border-r border-zinc-800/80"
            : "bg-[#ffffff] border-r border-zinc-200/80 shadow-lg md:shadow-sm"
        } ${
          isSidebarOpen
            ? "translate-x-0 w-72 md:w-64 lg:w-72"
            : "-translate-x-full md:translate-x-0 md:w-16"
        }`}
      >
        {/* Sidebar Header / Top Controls */}
        <div
          className={`p-3 pb-2 shrink-0 flex flex-col ${
            isSidebarOpen ? "" : "items-center"
          }`}
        >
          {isSidebarOpen ? (
            <>
              {/* Expanded Header Row */}
              <div className="flex items-center justify-between mb-3 px-2.5">
                <h1
                  className={`text-lg font-bold tracking-tight ${
                    isDarkMode ? "text-white" : "text-zinc-900"
                  }`}
                >
                  Perplexity
                </h1>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  title="Close sidebar"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isDarkMode
                      ? "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      strokeWidth={2}
                    />
                    <path d="M9 3v18" strokeWidth={2} />
                  </svg>
                </button>
              </div>

              {/* Expanded New Chat Button */}
              <button
                onClick={() => {
                  handleCreateNewChat();
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={`w-full font-medium py-2.5 px-2.5 rounded-xl transition-all duration-200 flex items-center gap-2.5 text-xs cursor-pointer border-0 shadow-none ${
                  isDarkMode
                    ? "hover:bg-zinc-800/50 text-zinc-200"
                    : "hover:bg-zinc-100 text-zinc-800"
                }`}
              >
                <svg
                  className={`w-4 h-4 shrink-0 ${
                    isDarkMode ? "text-zinc-400" : "text-zinc-600"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span>New chat</span>
              </button>

              {/* Search Bar Input (Expanded Sidebar) */}
              <div className="mt-2 px-0.5">
                <div className="relative flex items-center">
                  <svg
                    className={`w-3.5 h-3.5 absolute left-2.5 pointer-events-none ${
                      isDarkMode ? "text-zinc-500" : "text-zinc-400"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chats..."
                    className={`w-full text-xs pl-8 pr-7 py-2 rounded-xl border-0 focus:outline-none transition-all ${
                      isDarkMode
                        ? "bg-[#18181b] text-zinc-200 placeholder-zinc-500 focus:ring-1 focus:ring-zinc-700"
                        : "bg-[#f1f5f9] text-zinc-900 placeholder-zinc-400 focus:ring-1 focus:ring-zinc-300"
                    }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className={`absolute right-2 p-0.5 cursor-pointer ${
                        isDarkMode
                          ? "text-zinc-500 hover:text-zinc-300"
                          : "text-zinc-400 hover:text-zinc-600"
                      }`}
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Collapsed Top: Logo Icon */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                title="Expand sidebar"
                className={`group relative p-2.5 mb-1 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                  isDarkMode ? "text-white hover:bg-zinc-800/60" : "text-zinc-900 hover:bg-zinc-100"
                }`}
              >
                <svg
                  className="w-6 h-6 group-hover:hidden transition-all"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <svg
                  className="w-5 h-5 hidden group-hover:block transition-all"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    strokeWidth={2}
                  />
                  <path d="M9 3v18" strokeWidth={2} />
                </svg>
              </button>

              {/* Collapsed New Chat Pencil Icon Button (Borderless) */}
              <button
                onClick={handleCreateNewChat}
                title="New chat"
                className={`p-2.5 rounded-xl transition-all cursor-pointer mb-1 flex items-center justify-center ${
                  isDarkMode
                    ? "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
                    : "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>

              {/* Collapsed Search Icon Button (Borderless) */}
              <button
                onClick={handleOpenSearch}
                title="Search chats"
                className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                  isDarkMode
                    ? "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
                    : "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Chat Titles List */}
        {isSidebarOpen ? (
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            <div
              className={`px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Recent Conversations
            </div>

            {isChatsLoading ? (
              <div
                className={`p-4 text-center text-xs ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Loading history...
              </div>
            ) : filteredChats.length === 0 ? (
              <div
                className={`p-4 text-center text-xs italic ${
                  isDarkMode ? "text-zinc-600" : "text-zinc-400"
                }`}
              >
                {searchQuery ? "No matching chats found" : "No chats found."}
              </div>
            ) : (
              filteredChats.map((c) => {
                const isActive = activeChatId === c._id;
                return (
                  <div
                    key={c._id}
                    onClick={() => {
                      handleSelectChat(c._id);
                      if (window.innerWidth < 768) setIsSidebarOpen(false);
                    }}
                    className={`group relative w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all duration-200 ${
                      isActive
                        ? isDarkMode
                          ? "bg-blue-600/10 border border-blue-500/40 text-white"
                          : "bg-blue-50 border border-blue-200 text-blue-700"
                        : isDarkMode
                        ? "bg-transparent border-0 text-zinc-400 hover:bg-zinc-800/40 hover:text-white"
                        : "bg-transparent border-0 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate pr-6">
                      <svg
                        className={`w-4 h-4 shrink-0 ${
                          isActive
                            ? "text-blue-500"
                            : isDarkMode
                            ? "text-zinc-500"
                            : "text-zinc-400"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                      <span className="truncate">
                        {c.title || "Untitled Chat"}
                      </span>
                    </div>

                    {/* Delete Icon */}
                    <button
                      onClick={(e) => handleDeleteChat(c._id, e)}
                      title="Delete Chat"
                      className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-500 rounded transition-all duration-200 cursor-pointer"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* Sidebar Footer: User Profile with Popover Menu */}
        <div ref={profileMenuRef} className="relative p-3.5 shrink-0 flex justify-center">
          {/* Profile Dropdown Popover Menu */}
          {isProfileMenuOpen && (
            <div
              className={`absolute bottom-16 left-3.5 z-50 w-52 rounded-2xl p-1.5 border shadow-2xl animate-fadeIn ${
                isDarkMode
                  ? "bg-[#18181b] border-zinc-800 text-zinc-300"
                  : "bg-white border-zinc-200 text-zinc-700 shadow-xl"
              }`}
            >
              {/* Toggle Theme Option */}
              <button
                onClick={handleToggleTheme}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                  isDarkMode
                    ? "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
                    : "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"
                }`}
              >
                {isDarkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-indigo-400 shrink-0 lucide lucide-moon"
                  >
                    <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-amber-500 shrink-0 lucide lucide-sun"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                  </svg>
                )}
                <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
              </button>

              <div
                className={`my-1 border-t ${
                  isDarkMode ? "border-zinc-800/80" : "border-zinc-200"
                }`}
              />

              {/* Log Out Option */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition-all cursor-pointer font-medium"
              >
                <svg
                  className="w-4 h-4 shrink-0 text-rose-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Log out</span>
              </button>
            </div>
          )}

          {/* Profile Trigger Button using Neobrutalism Avatar */}
          {isSidebarOpen ? (
            <div
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={`w-full flex items-center gap-2.5 cursor-pointer p-1.5 rounded-xl transition-all ${
                isDarkMode ? "hover:bg-zinc-800/50" : "hover:bg-zinc-100"
              }`}
            >
              <Avatar className="w-8 h-8 shrink-0 border border-zinc-700">
                <AvatarImage src="/profile.png" alt={user?.username || 'User'} className="object-cover" />
                <AvatarFallback className="bg-emerald-600/20 text-emerald-500 font-bold text-xs">
                  {user?.username ? user.username[0].toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="truncate flex-1 flex items-center justify-between">
                <p
                  className={`text-xs font-semibold truncate ${
                    isDarkMode ? "text-white" : "text-zinc-800"
                  }`}
                >
                  {user?.username || "User"}
                </p>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  } ${isProfileMenuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              title={user?.username || "User"}
              className="p-0 border-0 bg-transparent cursor-pointer transition-transform hover:scale-105 shrink-0"
            >
              <Avatar className="w-10 h-10 border border-zinc-700">
                <AvatarImage src="/profile.png" alt={user?.username || 'User'} className="object-cover" />
                <AvatarFallback className="bg-emerald-600/20 text-emerald-500 font-extrabold text-xs">
                  {user?.username ? user.username.substring(0, 2).toUpperCase() : "US"}
                </AvatarFallback>
              </Avatar>
            </button>
          )}
        </div>
      </aside>

      {/* 2. Main Right Area */}
      <section
        className={`relative z-10 flex-1 flex flex-col h-full overflow-hidden transition-colors duration-300 ${
          isDarkMode ? "bg-[#000000]" : "bg-[#f8fafc]"
        }`}
      >
        {/* Mobile Header Bar (Only visible on screens < 768px) */}
        <div className="md:hidden shrink-0 h-13 px-4 flex items-center justify-between border-b border-zinc-800/40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDarkMode ? "text-zinc-300 hover:bg-zinc-800" : "text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-base font-bold text-white tracking-tight">Perplexity</h1>
          </div>

          <button
            onClick={handleCreateNewChat}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDarkMode ? "text-zinc-300 hover:bg-zinc-800" : "text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Main Message Feed */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 space-y-6">
          {isMessagesLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <svg
                  className="animate-spin h-8 w-8 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span
                  className={`text-xs ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  Loading messages...
                </span>
              </div>
            </div>
          ) : messages.length === 0 ? (
            /* Welcome / Empty State */
            <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center p-4 sm:p-6">
              <h2
                className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 ${
                  isDarkMode ? "text-white" : "text-zinc-900"
                }`}
              >
                What do you want to know?
              </h2>
              <p
                className={`text-xs sm:text-sm max-w-md leading-relaxed ${
                  isDarkMode ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                Ask a question or search for anything to start exploring.
              </p>
            </div>
          ) : (
            /* Message Feed Container */
            <div className="max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto space-y-6 sm:space-y-8 w-full">
              {messages.map((msg, idx) => {
                const isUser = msg.role === "user";
                return isUser ? (
                  /* User Message Bubble */
                  <div key={msg._id || idx} className="flex flex-col items-end my-4 gap-1">
                    {msg.image && (
                      <div className="max-w-xs mb-1 rounded-2xl overflow-hidden shadow-lg border border-blue-400/30">
                        <img
                          src={msg.image}
                          alt="Uploaded attachment"
                          className="w-full max-h-56 object-cover"
                        />
                      </div>
                    )}
                    <div className="bg-[#1d4ed8] text-white text-xs sm:text-sm py-2.5 px-4 sm:px-5 rounded-3xl max-w-[85%] sm:max-w-md md:max-w-lg shadow-md leading-relaxed font-normal">
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  /* AI Response Container (Rendered with ReactMarkdown) */
                  <div
                    key={msg._id || idx}
                    className="flex flex-col justify-start my-6"
                  >
                    <div
                      className={`text-xs sm:text-sm leading-relaxed font-normal space-y-2 markdown-body overflow-hidden ${
                        isDarkMode ? "text-zinc-200" : "text-zinc-800"
                      }`}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>

                    {/* Action Bar (Copy, Thumbs, Share, Retry, More) */}
                    <div
                      className={`flex items-center gap-2 sm:gap-3 mt-4 text-xs ${
                        isDarkMode ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      {/* Copy Button */}
                      <button
                        onClick={() =>
                          copyToClipboard(msg.content, msg._id || idx)
                        }
                        title="Copy"
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                          isDarkMode
                            ? "hover:text-zinc-100 hover:bg-zinc-800"
                            : "hover:text-zinc-900 hover:bg-zinc-200"
                        }`}
                      >
                        {copiedId === (msg._id || idx) ? (
                          <span className="text-xs text-emerald-500 font-medium">
                            Copied!
                          </span>
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                      </button>

                      {/* Thumbs Down */}
                      <button
                        title="Dislike"
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isDarkMode
                            ? "hover:text-zinc-100 hover:bg-zinc-800"
                            : "hover:text-zinc-900 hover:bg-zinc-200"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                          />
                        </svg>
                      </button>

                      {/* Share */}
                      <button
                        title="Share"
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isDarkMode
                            ? "hover:text-zinc-100 hover:bg-zinc-800"
                            : "hover:text-zinc-900 hover:bg-zinc-200"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                      </button>

                      {/* Retry / Regenerate */}
                      <button
                        title="Retry"
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isDarkMode
                            ? "hover:text-zinc-100 hover:bg-zinc-800"
                            : "hover:text-zinc-900 hover:bg-zinc-200"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </button>

                      {/* More Options */}
                      <button
                        title="More"
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isDarkMode
                            ? "hover:text-zinc-100 hover:bg-zinc-800"
                            : "hover:text-zinc-900 hover:bg-zinc-200"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* AI Thinking Animation */}
              {isSending && (
                <div className="flex justify-start my-6">
                  <div className="flex items-center gap-3 py-1">
                    {/* AI Bot Icon */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isDarkMode
                          ? "bg-blue-600/20 text-blue-400"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>

                    {/* 3 Bouncing Dots Animation */}
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full animate-bounce ${
                          isDarkMode ? "bg-zinc-300" : "bg-zinc-600"
                        }`}
                        style={{ animationDelay: "0ms" }}
                      ></span>
                      <span
                        className={`w-2 h-2 rounded-full animate-bounce ${
                          isDarkMode ? "bg-zinc-300" : "bg-zinc-600"
                        }`}
                        style={{ animationDelay: "150ms" }}
                      ></span>
                      <span
                        className={`w-2 h-2 rounded-full animate-bounce ${
                          isDarkMode ? "bg-zinc-300" : "bg-zinc-600"
                        }`}
                        style={{ animationDelay: "300ms" }}
                      ></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* 3. Bottom Pill Input Bar */}
        <div
          className={`shrink-0 p-3 sm:p-4 pb-2 transition-colors duration-300 ${
            isDarkMode ? "bg-[#000000]" : "bg-[#f8fafc]"
          }`}
        >
          <form
            onSubmit={onSubmit}
            className={`max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto relative flex flex-col rounded-2xl p-2 sm:p-2.5 px-3 sm:px-4 transition-all border-2 ${
              isDarkMode
                ? "bg-[#18181b] border-zinc-700 shadow-[2px_2px_0px_0px_#2563eb]"
                : "bg-[#dbeafe] border-black shadow-[2px_2px_0px_0px_#000000]"
            }`}
          >
            {/* Attachment Popover Menu */}
            {isAttachMenuOpen && (
              <div
                ref={attachMenuRef}
                className={`absolute bottom-16 left-0 z-50 p-1.5 rounded-2xl border-2 animate-fadeIn ${
                  isDarkMode
                    ? "bg-[#18181b] border-zinc-700 text-white shadow-[2px_2px_0px_0px_#2563eb]"
                    : "bg-white border-black text-black shadow-[2px_2px_0px_0px_#000000]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsAttachMenuOpen(false);
                    fileInputRef.current?.click();
                  }}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer font-bold ${
                    isDarkMode
                      ? "hover:bg-zinc-800 text-zinc-200"
                      : "hover:bg-zinc-100 text-black"
                  }`}
                >
                  <svg
                    className={`w-4 h-4 shrink-0 ${
                      isDarkMode ? "text-zinc-400" : "text-black"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs">
                      Add photos & files
                    </span>
                  </div>
                </button>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
              multiple
            />

            {/* Attached Files Preview Chips */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2 pt-1 pb-1 border-b border-zinc-700/50">
                {attachedFiles.map((item) => (
                  <div
                    key={item.id}
                    className={`group relative flex items-center gap-2 py-1 px-2.5 rounded-xl text-xs border-2 ${
                      isDarkMode
                        ? "bg-zinc-800 border-zinc-600 text-zinc-200 shadow-[2px_2px_0px_0px_#2563eb]"
                        : "bg-white border-black text-black shadow-[2px_2px_0px_0px_#000000]"
                    }`}
                  >
                    {item.preview ? (
                      <img
                        src={item.preview}
                        alt={item.name}
                        className="w-5 h-5 rounded object-cover shrink-0"
                      />
                    ) : (
                      <svg
                        className="w-4 h-4 text-blue-500 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    )}
                    <span className="truncate max-w-[140px] font-bold">
                      {item.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttachedFile(item.id)}
                      className="p-0.5 hover:text-rose-500 rounded-full transition-colors cursor-pointer"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Row */}
            <div className="flex items-center w-full gap-2">
              {/* Left Plus Attachment Trigger Button */}
              <button
                type="button"
                onClick={() => setIsAttachMenuOpen(!isAttachMenuOpen)}
                title="Add photos & files"
                className={`p-1.5 rounded-xl cursor-pointer transition-all shrink-0 border-2 ${
                  isDarkMode
                    ? "text-zinc-300 hover:text-white bg-zinc-800 border-zinc-600 shadow-[2px_2px_0px_0px_#ffffff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                    : "text-black hover:bg-zinc-100 bg-white border-black shadow-[2px_2px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>

              {/* Input Field */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                className={`flex-1 bg-transparent border-0 text-xs sm:text-sm py-2 px-2.5 sm:px-3 focus:outline-none ${
                  isDarkMode
                    ? "text-white placeholder-zinc-500 font-medium"
                    : "text-black placeholder-zinc-700 font-bold"
                }`}
              />

              {/* Right Send Button */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="submit"
                  disabled={(!inputText.trim() && attachedFiles.length === 0) || isSending}
                  className={`bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:pointer-events-none text-white p-2 sm:p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                    isDarkMode
                      ? "border-white shadow-[3px_3px_0px_0px_#ffffff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                      : "border-black shadow-[3px_3px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </form>

          {/* Footer Disclaimer */}
          <div
            className={`text-center mt-2 text-[10px] sm:text-[11px] ${
              isDarkMode ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            Perplexity AI can make mistakes. Check important info.
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;

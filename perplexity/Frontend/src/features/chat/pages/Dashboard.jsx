import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [inputText, setInputText] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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

  const onSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const msg = inputText;
    setInputText("");
    handleSendMessage(msg);
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

  return (
    <main className="relative h-full w-full flex bg-[#09090b] text-zinc-100 font-sans overflow-hidden">
      {/* 1. Left Sidebar */}
      <aside
        className={`relative z-20 bg-[#121215] border-r border-zinc-800/70 flex flex-col justify-between shrink-0 h-full overflow-hidden transition-all duration-300 ${
          isSidebarOpen ? "w-64 md:w-72" : "w-16"
        }`}
      >
        {/* Sidebar Header / Top Controls */}
        <div className={`p-3.5 pb-2 shrink-0 flex flex-col ${isSidebarOpen ? "" : "items-center"}`}>
          {isSidebarOpen ? (
            <>
              {/* Expanded Header Row */}
              <div className="flex items-center justify-between mb-3 px-1">
                <h1 className="text-lg font-bold tracking-tight text-white">
                  Perplexity
                </h1>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  title="Collapse sidebar"
                  className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-lg transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
                    <path d="M9 3v18" strokeWidth={2} />
                  </svg>
                </button>
              </div>

              {/* Expanded New Chat Button */}
              <button
                onClick={handleCreateNewChat}
                className="w-full bg-[#18181b] hover:bg-[#272730] text-zinc-200 font-medium py-3 px-4 rounded-2xl transition-all duration-200 flex items-center gap-3 text-sm cursor-pointer border-0 hover:border hover:border-zinc-700/60 shadow-none"
              >
                <svg
                  className="w-4.5 h-4.5 text-zinc-300 shrink-0"
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
            </>
          ) : (
            <>
              {/* Collapsed Top: Logo Icon */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                title="Expand sidebar"
                className="group relative p-2.5 mb-4 text-white hover:bg-zinc-800/60 rounded-xl transition-all cursor-pointer flex items-center justify-center"
              >
                <svg
                  className="w-6 h-6 text-white group-hover:hidden transition-all"
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
                  className="w-5 h-5 text-zinc-300 hidden group-hover:block transition-all"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
                  <path d="M9 3v18" strokeWidth={2} />
                </svg>
              </button>

              {/* Collapsed New Chat Pencil Icon Button */}
              <button
                onClick={handleCreateNewChat}
                title="New chat"
                className="w-10 h-10 bg-[#18181b] hover:bg-[#272730] border-0 hover:border hover:border-zinc-700/60 text-zinc-200 rounded-xl flex items-center justify-center transition-all cursor-pointer"
              >
                <svg
                  className="w-5 h-5 text-zinc-300"
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
            </>
          )}
        </div>

        {/* Chat Titles List */}
        {isSidebarOpen ? (
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Recent Conversations
            </div>

            {isChatsLoading ? (
              <div className="p-4 text-center text-xs text-zinc-500">
                Loading history...
              </div>
            ) : chats.length === 0 ? (
              <div className="p-4 text-center text-xs text-zinc-600 italic">
                No chats found.
              </div>
            ) : (
              chats.map((c) => {
                const isActive = activeChatId === c._id;
                return (
                  <div
                    key={c._id}
                    onClick={() => handleSelectChat(c._id)}
                    className={`group relative w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600/10 border border-blue-500/40 text-white"
                        : "bg-transparent border-0 hover:border hover:border-zinc-800 text-zinc-400 hover:bg-zinc-800/40 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate pr-6">
                      <svg
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? "text-blue-500" : "text-zinc-500"
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
                      <span className="truncate">{c.title || "Untitled Chat"}</span>
                    </div>

                    {/* Delete Icon */}
                    <button
                      onClick={(e) => handleDeleteChat(c._id, e)}
                      title="Delete Chat"
                      className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-rose-400 rounded transition-all duration-200"
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

        {/* Sidebar Footer: User Profile */}
        <div className={`p-3.5 shrink-0 flex items-center ${isSidebarOpen ? "justify-start" : "justify-center"}`}>
          {isSidebarOpen ? (
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">
                {user?.username ? user.username[0].toUpperCase() : "U"}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.username || "User"}
                </p>
                <p className="text-[10px] text-zinc-500 truncate">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          ) : (
            <div
              title={user?.username || "User"}
              className="w-9 h-9 rounded-full bg-[#10b981] text-zinc-950 font-extrabold text-xs flex items-center justify-center cursor-pointer shadow-md"
            >
              {user?.username ? user.username.substring(0, 2).toUpperCase() : "US"}
            </div>
          )}
        </div>
      </aside>

      {/* 2. Main Right Area */}
      <section className="relative z-10 flex-1 flex flex-col h-full overflow-hidden bg-[#09090b]">
        {/* Main Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
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
                <span className="text-xs text-zinc-500">
                  Loading messages...
                </span>
              </div>
            </div>
          ) : messages.length === 0 ? (
            /* Welcome / Empty State */
            <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center p-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
                What do you want to know?
              </h2>
              <p className="text-sm text-zinc-400 max-w-md mb-8 leading-relaxed">
                Ask a question or search for anything to start exploring.
              </p>

              {/* Suggestion Chips */}
              {!inputText.trim() && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg transition-all duration-300">
                  {[
                    "Mob ka sabse powerful scene kiss season me h?",
                    "Write a React custom hook for socket.io",
                    "Explain quantum entanglement in simple Hindi",
                    "Best practices for Mongoose schema design",
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => setInputText(prompt)}
                      className="p-3.5 bg-[#141417] hover:bg-[#1f1f24] border-0 hover:border hover:border-zinc-800 rounded-2xl text-left text-xs text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm"
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Message Feed Container */
            <div className="max-w-3xl mx-auto space-y-8 w-full">
              {messages.map((msg, idx) => {
                const isUser = msg.role === "user";
                return isUser ? (
                  /* User Message Bubble */
                  <div key={msg._id || idx} className="flex justify-end my-4">
                    <div className="bg-[#1d4ed8] text-white text-sm py-2.5 px-5 rounded-3xl max-w-md md:max-w-lg shadow-md leading-relaxed font-normal">
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  /* AI Response Container (Rendered with ReactMarkdown) */
                  <div key={msg._id || idx} className="flex flex-col justify-start my-6">
                    <div className="text-sm text-zinc-200 leading-relaxed font-normal space-y-2 markdown-body overflow-hidden">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>

                    {/* Action Bar (Copy, Thumbs, Share, Retry, More) */}
                    <div className="flex items-center gap-3 mt-4 text-zinc-400 text-xs">
                      {/* Copy Button */}
                      <button
                        onClick={() => copyToClipboard(msg.content, msg._id || idx)}
                        title="Copy"
                        className="p-1.5 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      >
                        {copiedId === (msg._id || idx) ? (
                          <span className="text-xs text-emerald-400 font-medium">Copied!</span>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>

                      {/* Thumbs Down */}
                      <button title="Dislike" className="p-1.5 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                        </svg>
                      </button>

                      {/* Share */}
                      <button title="Share" className="p-1.5 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>

                      {/* Retry / Regenerate */}
                      <button title="Retry" className="p-1.5 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>

                      {/* More Options */}
                      <button title="More" className="p-1.5 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* AI Generating Loading Indicator */}
              {isSending && (
                <div className="flex justify-start my-4">
                  <div className="flex items-center gap-2 text-zinc-400 text-sm">
                    <svg className="animate-spin h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="animate-pulse">Thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* 3. Bottom Pill Input Bar */}
        <div className="shrink-0 bg-[#09090b] p-4 pb-2">
          <form
            onSubmit={onSubmit}
            className="max-w-3xl mx-auto relative flex items-center bg-[#18181b] border-0 hover:border hover:border-[#27272a] focus-within:border focus-within:border-[#3f3f46] rounded-full p-2 px-4 shadow-2xl transition-all"
          >
            {/* Left Plus Icon */}
            <button
              type="button"
              className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-full cursor-pointer transition-colors shrink-0"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {/* Input Field */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent border-0 text-white placeholder-zinc-500 text-sm py-2 px-3 focus:outline-none"
            />

            {/* Right Action Icons: Think, Mic, Send */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Think Button */}
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-800/60 hover:bg-zinc-800 py-1.5 px-3 rounded-full transition-colors cursor-pointer font-medium"
              >
                <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>Think</span>
              </button>

              {/* Mic Icon */}
              <button
                type="button"
                className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-full cursor-pointer transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isSending}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:pointer-events-none text-white p-2 rounded-full transition-all cursor-pointer shadow-md"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </form>

          {/* Footer Disclaimer */}
          <div className="text-center mt-2 text-[11px] text-zinc-500">
            Perplexity AI can make mistakes. Check important info.
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
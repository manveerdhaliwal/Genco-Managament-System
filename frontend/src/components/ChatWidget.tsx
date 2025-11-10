"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle, Loader2 } from "lucide-react";

type Message = {
  id: string;
  user?: string;
  bot?: string;
  timestamp: Date;
};

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const chatBoxRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  /* 🧠 STEP 1: Keep checking localStorage for login updates */
  useEffect(() => {
    function syncUserData() {
      const role = localStorage.getItem("userRole") || localStorage.getItem("role");
      const id = localStorage.getItem("userId");
      if (role && id) {
        setUserRole(role);
        setUserId(id);
      }
    }

    syncUserData(); // Run once when mounted
    const interval = setInterval(syncUserData, 1000); // Poll every 1 sec (handles late login)
    return () => clearInterval(interval);
  }, []);

  /* 🖥️ STEP 2: Initialize position */
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPosition({
        x: window.innerWidth - 420,
        y: window.innerHeight - 600,
      });
    }
  }, []);

  /* 👋 STEP 3: Show welcome message when user data becomes available */
  useEffect(() => {
    if (userRole && userId && messages.length === 0) {
      const welcomeMsg =
        userRole === "teacher"
          ? "👋 Welcome Teacher! I can help you with student data, statistics, and records."
          : "👋 Welcome! I can help you with your academic records.";

      setMessages([
        {
          id: Date.now().toString(),
          bot: welcomeMsg,
          timestamp: new Date(),
        },
      ]);
    }
  }, [userRole, userId]);

  /* 📜 Scroll to bottom on new messages */
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  /* 🖱️ Dragging logic for floating chat window */
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      isDragging.current = true;
      dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      if (typeof window === "undefined") return;

      const newX = Math.max(0, Math.min(window.innerWidth - 380, e.clientX - dragOffset.current.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 500, e.clientY - dragOffset.current.y));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [position]);

  /* 💬 Send message to /api/chat */
  const sendMessage = async () => {
    if (!input.trim()) return;

    if (!userRole || !userId) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          bot: "⚠️ Please log in first to use the chat assistant.",
          timestamp: new Date(),
        },
      ]);
      return;
    }

    const userMsg = input.trim();
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), user: userMsg, timestamp: new Date() },
    ]);
    setInput("");
    setLoading(true);

    try {
      console.log("📤 Sending message:", { userRole, userId, message: userMsg });

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userRole, userId, message: userMsg }),
      });

      const data = await res.json();
      console.log("📥 Received response:", data);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          bot: data.reply || data.error || "No response received.",
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          bot: "⚠️ Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* 🧩 Chat UI */
  return (
    <>
      {/* Floating chat icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all z-50"
        aria-label="Toggle chat"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: position.y,
            left: position.x,
            zIndex: 50,
          }}
          className="w-[380px] bg-white rounded-lg shadow-xl flex flex-col transition-opacity duration-200"
        >
          {/* Header */}
          <div
            className="p-4 bg-indigo-600 text-white rounded-t-lg cursor-move flex justify-between items-center"
            onMouseDown={handleMouseDown}
          >
            <div>
              <h3 className="font-semibold">Chat Assistant</h3>
              {userRole && (
                <p className="text-xs opacity-90">
                  {userRole === "teacher" ? "👨‍🏫 Teacher Mode" : "👨‍🎓 Student Mode"}
                </p>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-indigo-700 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div ref={chatBoxRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center text-sm">
                {!userRole || !userId
                  ? "⚠️ Please log in to start chatting"
                  : "👋 Hi! How can I help you today?"}
              </p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  {msg.user && (
                    <div className="flex justify-end">
                      <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg max-w-[80%] text-sm">
                        {msg.user}
                      </div>
                    </div>
                  )}
                  {msg.bot && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg max-w-[80%] text-sm whitespace-pre-line">
                        {msg.bot}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input box */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  !userRole || !userId ? "Please log in first..." : "Type your message..."
                }
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                disabled={loading || !userRole || !userId}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim() || !userRole || !userId}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

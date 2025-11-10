"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message instantly
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userRole: "student", // or "teacher"
          userId: "1234",
          message: userMessage,
        }),
      });

      const data = await res.json();

      // Add bot reply
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.reply || "No response received." },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Error: Could not reach server." },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl flex flex-col overflow-hidden">
        <div className="bg-blue-600 text-white text-center py-3 font-semibold text-lg">
          💬 Smart Chat Assistant
        </div>

        {/* Chat area */}
        <div
          ref={chatRef}
          className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-100"
        >
          {messages.length === 0 && (
            <p className="text-gray-500 text-center mt-10">
              👋 Start the conversation below...
            </p>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm shadow-sm ${
                  m.role === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none border"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="flex items-center border-t p-3 bg-white">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-grow border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="ml-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 py-2 text-sm font-medium transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

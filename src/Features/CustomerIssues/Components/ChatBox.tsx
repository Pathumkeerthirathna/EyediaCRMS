import React, { useState, useRef, useEffect } from "react";

export interface Message {
  id: number;
  sender: "customer" | "agent";
  text: string;
  timestamp: string;
}

interface ChatBoxProps {
  customerName: string;
  onClose: () => void;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ customerName, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "customer",
      text: "Hello, I need help with my order.",
      timestamp: "10:00 AM",
    },
    {
      id: 2,
      sender: "agent",
      text: "Sure, can you please share your order ID?",
      timestamp: "10:01 AM",
    },
  ]);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now(),
      sender: "agent",
      text: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  return (
    <div className="flex flex-col w-full max-w-md h-[380px] border rounded-lg shadow-lg bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-indigo-600 text-white rounded-t-lg">
        <div className="font-semibold">Messages - {customerName}</div>
        <button
          className="hover:bg-indigo-500 p-1 rounded"
          onClick={onClose}
          aria-label="Close chat"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "agent" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                msg.sender === "agent"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              <p>{msg.text}</p>
              <span className="block mt-1 text-[10px] text-gray-300">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-3 border-t">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export const ChatWithButton: React.FC<{ customerName: string }> = ({
  customerName,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Messages Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition z-50"
          aria-label="Open chat messages"
        >
          Messages
        </button>
      )}

      {/* Chat Box */}
      <div
        className={`fixed bottom-6 right-6 z-50 transform transition-transform duration-300 ease-out ${
          open
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <ChatBox customerName={customerName} onClose={() => setOpen(false)} />
      </div>
    </>
  );
};

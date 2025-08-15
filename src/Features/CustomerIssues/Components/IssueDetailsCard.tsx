import React, { useState, useRef, useEffect } from "react";
import { CustomerIssue } from "../types";
import { getIssueStatusMeta } from "../Constants/CustomerIssueStatus"; // adjust path if needed

interface IssueDetailCardProps {
  issue: CustomerIssue | null;
  onClearSelection?: () => void;
}

const communicationMethodMap: Record<number, string> = {
  1: "Email",
  2: "Phone",
  3: "Chat",
  4: "In Person",
};

const formatDate = (iso: string) => {
  if (!iso) return "-";
  try {
    const dt = new Date(iso);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dt);
  } catch {
    return iso;
  }
};

interface Message {
  id: number;
  sender: "customer" | "agent";
  text: string;
  timestamp: string;
}

const ChatBox: React.FC<{ customerName: string; onClose: () => void }> = ({
  customerName,
  onClose,
}) => {
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

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now(),
      sender: "agent",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  return (
    <div className="flex flex-col w-full max-w-md h-[500px]  rounded-lg shadow-lg bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-indigo-600 text-white rounded-t-lg cursor-pointer">
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
            className={`flex ${msg.sender === "agent" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                msg.sender === "agent"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              <p>{msg.text}</p>
              <span className="block mt-1 text-[10px] text-gray-300">{msg.timestamp}</span>
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

export const IssueDetailCard: React.FC<IssueDetailCardProps> = ({
  issue,
  onClearSelection,
}) => {
  const [chatOpen, setChatOpen] = useState(false);

  if (!issue) {
    return (
      <div className="border rounded p-6 h-full bg-white shadow relative">
        <div>
          <h3 className="text-xl font-semibold mb-2">Select an issue</h3>
          <p className="text-gray-500">
            Click on an issue from the list to see its details here.
          </p>
        </div>
      </div>
    );
  }

  const status = getIssueStatusMeta(issue.issueStatus);

  const badgeBgMap: Record<string, string> = {
    "bg-success": "bg-green-500",
    "bg-warning": "bg-yellow-400",
    "bg-danger": "bg-red-500",
    "bg-info": "bg-blue-500",
  };
  const badgeBgColor = badgeBgMap[status.colorClass] || "bg-gray-400";

  return (
    <div className=" h-full bg-white shadow flex flex-col relative">
      <div className="flex justify-between items-center  px-6 py-4">
        <div>
          <h3 className="text-xl font-semibold mb-0">Issue Details</h3>
          {/* <small className="text-gray-500">#{issue.id}</small> */}
        </div>
        <div className="flex items-center gap-3">

              <span
                className={`inline-block px-3 py-1 rounded-full text-white text-xs font-semibold ${badgeBgColor}`}
              >
                {status.label}
              </span>

              {issue.resolvedAt && !issue.resolvedAt.startsWith("1900")
                ? formatDate(issue.resolvedAt)
                : ""}

          
        </div>
      </div>

      <div className="p-6 flex-grow overflow-auto">
        
        <div className="grid grid-cols-12 gap-6 mb-8 h-[calc(30vh-150px)]">
          {/* 8/12 column */}
          <div className="col-span-12 md:col-span-9">

            <div className="mb-9">
            <div className="uppercase text-xs text-gray-500 mb-2 font-semibold">
              Issue Description
            </div>
            <div className="whitespace-pre-wrap">{issue.issueDesc}</div>
          </div>

          </div>

          {/* 4/12 column */}
          <div className="col-span-12 md:col-span-2">

            <div className="uppercase text-xs text-gray-500 mb-1 font-semibold">
              Customer Phone
            </div>
            <div>{issue.customerPhone}</div>

            <div className="uppercase text-xs text-gray-500 mb-1 mt-4 font-semibold">
              Communication Method
            </div>
            <div>{communicationMethodMap[issue.communicationMethod] ?? "Unknown"}</div>
          </div>

        </div>

        

      </div>

      
    </div>

  );
};


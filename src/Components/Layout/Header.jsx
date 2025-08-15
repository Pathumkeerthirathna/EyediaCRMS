import React from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function Header({ onToggleSidebar, isSidebarOpen, user }) {
  return (
    <header
      className={`flex items-center justify-between bg-white border-b px-4 py-2 shadow-sm transition-all duration-300`}
    >
      {/* Sidebar Toggle Button */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
      >
        <Bars3Icon className="h-6 w-6 text-gray-700" />
      </button>

      {/* User Profile */}
      <div className="flex items-center space-x-3">
        <span className="text-gray-700 font-medium">{user?.name || "Guest"}</span>
        <img
          src={user?.image || "https://via.placeholder.com/40"}
          alt="User Avatar"
          className="h-10 w-10 rounded-full border border-gray-300 object-cover"
        />
      </div>
    </header>
  );
}
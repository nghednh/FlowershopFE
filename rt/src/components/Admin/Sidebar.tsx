import React from "react";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  setActiveSection: (section: string) => void;
  activeSection: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ setActiveSection, activeSection }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user.role");
    localStorage.removeItem("adminActiveSection"); // Clear admin section state

    // Navigate to login page
    navigate("/login");
  };

  const menuItems = [
    { key: "flowers", label: "Flowers", icon: "🌸" },
    { key: "pricing", label: "Pricing", icon: "💰" },
    { key: "orders", label: "Orders", icon: "📦" },
    { key: "users", label: "Users", icon: "👥" },
    { key: "categories", label: "Categories", icon: "🗂️" },
    { key: "loyalty", label: "Loyalty", icon: "⭐" },
    { key: "reports", label: "Reports", icon: "📊" }
  ];

  return (
    <div className="w-64 bg-white/95 backdrop-blur-md border-r border-gray-200/50 h-screen flex flex-col fixed left-0 top-0 z-30 shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 bg-clip-text">
            FlowerShop
          </h2>
          <p className="text-lg font-semibold text-gray-700 mt-2 tracking-wide">
            Admin CMS
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = activeSection === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg" 
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600"
              }`}
            >
              <span className="text-xl">
                {item.icon}
              </span>
              <span className="font-medium text-xl">
                {item.label}
              </span>
              {isActive && (
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-200/50">
        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">A</span>
            </div>
            <div>
              <p className="font-medium text-gray-800 text-sm">Admin User</p>
              <p className="text-xs text-gray-500">Super Administrator</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium text-xl">Logout</span>
        </button>
      </div>
    </div>
  );
};

import React from "react";
import { useNavigate } from "react-router-dom";
import { APP_ICON } from "../../config";

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
    { key: "dashboard", label: "Dashboard", icon: "📊", description: "Overview & statistics" },
    { key: "flowers", label: "Products", icon: "🌸", description: "Manage inventory" },
    { key: "pricing", label: "Pricing", icon: "💰", description: "Set rules & discounts" },
    { key: "orders", label: "Orders", icon: "📦", description: "Track customer orders" },
    { key: "users", label: "Users", icon: "👥", description: "Manage accounts" },
    { key: "categories", label: "Categories", icon: "🗂️", description: "Organize products" },
    { key: "loyalty", label: "Loyalty", icon: "⭐", description: "Rewards program" },
    { key: "reports", label: "Analytics", icon: "📈", description: "Business insights" }
  ];

  return (
    <div className="w-64 bg-white/95 backdrop-blur-md border-r border-gray-200/50 h-screen flex flex-col fixed left-0 top-0 z-30 shadow-2xl transition-all duration-300 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 app-icon-bg rounded-2xl flex items-center justify-center shadow-lg">
            <img src={APP_ICON} alt="FlowerShop" className="w-10 h-10" />
          </div>
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
        {menuItems.map((item, index) => {
          const isActive = activeSection === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                isActive 
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-[1.02]" 
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 hover:transform hover:scale-[1.01]"
              }`}
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              {/* Background effect for active state */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
              )}
              
              <span className={`text-xl relative z-10 ${isActive ? 'animate-bounce-gentle' : ''}`}>
                {item.icon}
              </span>
              <div className="flex-1 text-left relative z-10">
                <span className="font-medium text-lg block">
                  {item.label}
                </span>
              </div>
              {isActive && (
                <div className="ml-auto relative z-10">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              )}
              
              {/* Hover effect indicator */}
              {!isActive && (
                <div className="absolute right-2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-200/50">
        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200/50 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-sm">A</span>
            </div>
            <div>
              <p className="font-medium text-gray-800 text-sm">Admin</p>
            </div>
            <div className="ml-auto">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group hover:shadow-md"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium text-lg">Logout</span>
        </button>
      </div>
    </div>
  );
};
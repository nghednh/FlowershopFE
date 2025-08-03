import React from "react";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  setActiveSection: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ setActiveSection }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user.role");

    // Navigate to login page
    navigate("/login");
  };

  return (
    <div className="w-64 bg-white border-r border-gray-300 h-screen px-4 py-6 flex flex-col">
      <div className="pb-6 mb-6 border-b border-gray-300 text-center">
        <h2 className="text-black uppercase text-[34px]">Admin CMS</h2>
      </div>

      <ul className="flex-1">
        {["Flowers", "Pricing", "Orders", "Users", "Categories", "Loyalty", "Reports"].map(
          (section) => (
            <li key={section} className="text-[18px] mb-6">
              <button
                onClick={() => setActiveSection(section.toLowerCase())}
                className="text-black uppercase hover:bg-gray-100 px-2 py-1 rounded transition-colors"
              >
                {section}
              </button>
            </li>
          )
        )}
      </ul>

      {/* Logout button at the bottom */}
      <div className="border-t border-gray-300 pt-4 mt-4">
        <button
          onClick={handleLogout}
          className="w-full text-left text-red-600 uppercase hover:bg-red-50 px-2 py-2 rounded transition-colors text-[18px] font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

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

  return (
    <div className="w-64 bg-white border-r border-gray-300 h-screen px-4 py-6 flex flex-col fixed left-0 top-0 z-10 overflow-y-auto">
      <div className="pb-6 mb-6 border-b border-gray-300 text-center">
        <h2 className="text-black uppercase text-[34px]">Admin CMS</h2>
      </div>

      <ul className="flex-1">
        {["Flowers", "Pricing", "Orders", "Users", "Categories", "Loyalty", "Reports"].map(
          (section) => {
            const sectionKey = section.toLowerCase();
            const isActive = activeSection === sectionKey;
            return (
              <li key={section} className="text-[18px] mb-6">
                <button
                  onClick={() => setActiveSection(sectionKey)}
                  className={`text-black uppercase px-2 py-1 rounded transition-colors w-full text-left ${
                    isActive 
                      ? "bg-blue-100 border-l-4 border-blue-500 font-semibold" 
                      : "hover:bg-gray-100"
                  }`}
                >
                  {section}
                </button>
              </li>
            );
          }
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

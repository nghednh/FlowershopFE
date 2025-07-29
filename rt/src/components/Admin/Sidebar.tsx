import React from "react";

interface SidebarProps {
  setActiveSection: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ setActiveSection }) => (
  <div className="w-64 bg-white border-r border-gray-300 h-screen px-4 py-6">
    <div className="pb-6 mb-6 border-b border-gray-300 text-center">
      <h2 className="text-black uppercase text-[34px]">Admin CMS</h2>
    </div>
    <ul>
      {["Flowers", "Pricing", "Orders", "Users", "Categories"].map((section) => (
        <li key={section} className="text-[18px] mb-6">
          <button
            onClick={() => setActiveSection(section.toLowerCase())}
            className="text-black uppercase hover:bg-gray-100 px-2 py-1 rounded transition-colors"
          >
            {section}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

import { useState } from "react";

const MobileTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "forYou", label: "For you" },
    { id: "following", label: "Following" },
  ];

  return (
    <div className="flex">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-4 relative hover:bg-white/5 transition-colors ${
            activeTab === tab.id ? "font-bold" : ""
          }`}
        >
          {tab.label}
          {/* Active Indicator */}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
};

export default MobileTabs;

import React, { useState } from "react";
import Games from "../components/dashboard/Games";
import Teams from "../components/dashboard/Teams";
import Players from "../components/dashboard/Players";
import Leagues from "../components/dashboard/Leagues";
import Analytics from "../components/dashboard/Analytics";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Games");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Games":
        return <Games />;
      case "Teams":
        return <Teams />;
      case "Players":
        return <Players />;
      case "Leagues":
        return <Leagues />;
      case "Analytics":
        return <Analytics />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="dashboard-container bg-dark text-center">
      <div className="dashboard-content">
        <div className="grid grid-cols-12 gap-[6px] px-[24px] py-[18px] border-b border-tgray">
          <div className="col-span-3"></div>
          <div className="col-span-9 dashboard-navbar">
            <div className="w-full flex items-center justify-evenly">
              {["Games", "Teams", "Players", "Leagues", "Analytics"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`w-full px-8 text-[20px] rounded group relative inline-block overflow-hidden transition ${
                      activeTab === tab ? "text-orange font-bold" : "text-white"
                    }`}
                  >
                    {tab}
                    <span
                      className={`absolute left-0 bottom-0 h-[1px] w-0 bg-orange transition-all duration-500 group-hover:w-full ${
                        activeTab === tab ? "w-full" : ""
                      }`}
                    ></span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
        <div className="w-full">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;

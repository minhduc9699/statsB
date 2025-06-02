import React, { useState } from "react";

const EventInputPanel = () => {
  const [filters, setFilters] = useState({ gameType: "" });
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-full h-[97%] p-[16px] bg-white rounded">
        <div className="text-[20px] pb-[22px] text-start">Match info</div>
        <div className="space-y-[8px]">
          <div className="match-type">
            <div className="text-[16px] pb-[4px] text-start">Match Type</div>
            <select
              name="gameType"
              value={filters.gameType}
              className="p-2 border rounded w-full shadow-lg"
              placeholder="Match Type"
            >
              <option value="5v5">5v5</option>
              <option value="3v3">3v3</option>
            </select>
          </div>
          <div className="match-type">
            <div className="text-[16px] pb-[4px] text-start">Team 1</div>
            <select
              name="gameType"
              value={filters.gameType}
              className="p-2 border rounded w-full shadow-lg"
              placeholder="Match Type"
            >
              <option value="5v5">5v5</option>
              <option value="3v3">3v3</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInputPanel;

import React, { useState } from "react";

const EventInputPanel = () => {
  const [filters, setFilters] = useState({ gameType: "" });
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-full h-[97%] p-[16px] bg-white rounded">
        <div className="text-[20px] pb-[16px] text-start">Match info</div>
        <div className="space-y-[16px]">
          <div className="flex gap-[8px] w-full">
            <div className="match-type w-full">
              <div className="text-[16px] pb-[4px] text-center">Season</div>
              <select
                name="gameType"
                value={filters.gameType}
                className="p-2 border rounded w-full shadow-lg"
                placeholder="Match Type"
              >
                <option value="5v5">Read&Go League</option>
                <option value="3v3">S League</option>
              </select>
            </div>
            <div className="match-type w-full">
              <div className="text-[16px] pb-[4px] text-center">Match type</div>
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

          <div className="flex gap-[8px] w-full">
            <div className="match-type w-full">
              <div className="text-[16px] pb-[4px] text-center">Team A</div>
              <select
                name="gameType"
                value={filters.gameType}
                className="p-2 border rounded w-full shadow-lg"
                placeholder="Match Type"
              >
                <option value="5v5">Read&Go League</option>
                <option value="3v3">S League</option>
              </select>
            </div>
            <div className="match-type w-full">
              <div className="text-[16px] pb-[4px] text-center">Team B</div>
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
    </div>
  );
};

export default EventInputPanel;

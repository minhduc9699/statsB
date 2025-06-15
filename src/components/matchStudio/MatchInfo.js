import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MatchInfo = () => {
  const homeTeam = useSelector((state) => state.match.homeTeam);
  const awayTeam = useSelector((state) => state.match.awayTeam);
  const season = useSelector((state) => state.match.season);
  const events = useSelector((state) => state.match.matchEvents);
  const lastEvent = events[events.length - 1];

  // Giả sử Redux store hoặc parent component truyền vào initial score
  const [score, setScore] = useState({
    home: 0,
    away: 0,
  });
  useEffect(() => {
    if (!lastEvent || !lastEvent.type || !lastEvent.details || lastEvent.details.outcome !== "Made") return;

    let isHome = false;
    if (lastEvent.team === homeTeam?.id || lastEvent.team === homeTeam?._id) isHome = true;
    if (lastEvent.team === awayTeam?.id || lastEvent.team === awayTeam?._id) isHome = false;

    let points = 0;
    if (
      lastEvent.type === "2-Point Score" ||
      (lastEvent.details.shotType?.toLowerCase().includes("two") && lastEvent.details.outcome === "Made")
    ) {
      points = 2;
    }
    if (
      lastEvent.type === "3-Point Score" ||
      (lastEvent.details.shotType?.toLowerCase().includes("three") && lastEvent.details.outcome === "Made")
    ) {
      points = 3;
    }
    if (points === 0) return; // Không phải event cộng điểm

    setScore((prev) => ({
      ...prev,
      [isHome ? "home" : "away"]: prev[isHome ? "home" : "away"] + points,
    }));
  }, [lastEvent, homeTeam, awayTeam]);

  return (
    <div className="w-full h-full p-3 bg-white rounded flex flex-col items-center justify-start">
      <div className="font-bold text-center mb-2 tracking-wider text-gray-700 text-sm">
      {/* Season */}
        Match Info
      </div>
      <div className="text-xs text-gray-500 font-medium tracking-wide mb-2">
        {season}
      </div>
      {/* Info 2 đội */}
      <div className="w-full flex items-center justify-between">
        {/* Home */}
        <div className="flex flex-col items-center min-w-[90px]">
          <img
            src={homeTeam?.avatar}
            alt={homeTeam?.name}
            className="w-12 h-12 rounded-full border-2 border-gray-200 object-cover"
          />
          <div className="text-sm font-semibold mt-1">{homeTeam?.name}</div>
        </div>
        {/* Score */}
        <div className="flex flex-col items-center mx-4">
          <span className="text-3xl font-bold text-blue-700">
            {score.home} - {score.away}
          </span>
        </div>
        {/* Away */}
        <div className="flex flex-col items-center min-w-[90px]">
          <img
            src={awayTeam?.avatar}
            alt={awayTeam?.name}
            className="w-12 h-12 rounded-full border-2 border-gray-200 object-cover"
          />
          <div className="text-sm font-semibold mt-1">{awayTeam?.name}</div>
        </div>
      </div>
    </div>
  );
};

export default MatchInfo;

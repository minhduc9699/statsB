import React from "react";
import { useSelector } from "react-redux";
import { formatTime } from "../../utils/formatTime";
import EventCreateSteps from "./EventCreateSteps";
import EventCreateStepsV2 from "./EventCreateSteps-v2"

const BOSTON =
  "https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg";
const GOLDEN =
  "https://upload.wikimedia.org/wikipedia/en/0/01/Golden_State_Warriors_logo.svg";

const events = [
  { type: "shoot", icon: "🏀" },
  { type: "rebound", icon: "🔁" },
  { type: "freeThrow", icon: "🎯" },
  { type: "turnover", icon: "💥" },
  { type: "steal", icon: "🕵️" },
  { type: "block", icon: "🧱" },
  { type: "fault", icon: "🚫" },
];

const TeamInfo = ({ name = "Team Name", logo ="", align = "left" }) => (
  <div
    className={`flex items-center gap-2 w-1/3 ${
      align === "right" ? "justify-start flex-row-reverse text-end" : ""
    }`}
  >
    <img src={logo} alt={name} className="h-[36px] w-[36px]" />
    <h2 className="font-medium">{name}</h2>
  </div>
);

const EventCreator = () => {
  // video store
  const currentTime = useSelector((state) => state.video.currentTime);
  const isPlaying = useSelector((state) => state.video.isPlaying);
  // match store
  const homeTeam = useSelector((state) => state.match.homeTeam);
  const awayTeam = useSelector((state) => state.match.awayTeam);


  return (
    <div className="h-full w-full flex items-center justify-center bg-white rounded shadow">
      <div className="w-full h-[100%] p-4 bg-white rounded shadow">
        {/* <div className="flex justify-between items-center mb-4">
          <TeamInfo name={homeTeam?.name} logo={homeTeam?.avatar} />
          <div className="text-[28px] font-semibold text-center w-1/3 flex justify-center gap-2">
            <span>36</span>
            <span>-</span>
            <span>16</span>
          </div>
          <TeamInfo name={awayTeam?.name} logo={awayTeam?.avatar} align="right" />
        </div> */}

        {/* Event creation panel */}
        {!isPlaying && (
          <>
            <div className="text-[20px] pb-[16px] text-start">
              Create Event at (
              <span className="text-sky-500">{formatTime(currentTime)}</span>)
            </div>
            <EventCreateStepsV2 />
          </>
        )}
      </div>
    </div>
  );
};

export default EventCreator;

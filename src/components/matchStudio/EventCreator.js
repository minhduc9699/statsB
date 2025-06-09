import React from "react";
import { useSelector } from "react-redux";
import { formatTime } from "../../utils/formatTime";
import EventCreateSteps from "./EventCreateSteps";

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

const TeamInfo = ({ name, logo, align = "left" }) => (
  <div
    className={`flex items-center gap-2 w-1/3 ${
      align === "right" ? "justify-end flex-row-reverse text-end" : ""
    }`}
  >
    <img src={logo} alt={name} className="h-[36px] w-[36px]" />
    <h2 className="font-medium">{name}</h2>
  </div>
);

const EventCreator = () => {
  const currentTime = useSelector((state) => state.video.currentTime);
  const duration = useSelector((state) => state.video.duration);
  const isPlaying = useSelector((state) => state.video.isPlaying);

  return (
    <div className="h-full w-full flex items-center justify-center bg-slate-100">
      <div className="w-full h-[95%] p-4 bg-white rounded shadow">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <TeamInfo name="Boston Celtics" logo={BOSTON} />
          <div className="text-[28px] font-semibold text-center w-1/3 flex justify-center gap-2">
            <span>36</span>
            <span>-</span>
            <span>16</span>
          </div>
          <TeamInfo name="Golden State Warriors" logo={GOLDEN} align="right" />
        </div>

        {/* Event creation panel */}
        {!isPlaying && (
          <div>
            <div className="text-[20px] pb-[16px] text-start">
              Create Event at (
              <span className="text-sky-500">{formatTime(currentTime)}</span>)
            </div>
            <EventCreateSteps />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCreator;

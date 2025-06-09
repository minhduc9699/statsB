import React from "react";
import { useSelector } from "react-redux";
import { formatTime } from "../../utils/formatTime";

const eventTypes = [
  {
    type: "SHOT",
    subTypes: ["2PT", "3PT"],
    color: "bg-yellow-400",
    icon: "🏀",
  },
  { type: "FREETHROW", color: "bg-indigo-400", icon: "🎯" },
  { type: "TURNOVER", color: "bg-red-400", icon: "💥" },
  { type: "STEAL", color: "bg-pink-400", icon: "🕵️" },
  { type: "BLOCK", color: "bg-cyan-400", icon: "🧱" },
  { type: "REBOUND", color: "bg-green-400", icon: "🔁" },
  { type: "FAULT", color: "bg-orange-400", icon: "🚫" },
];

// 🔁 Mock events
const mockEvents = [
  {
    id: "e1",
    start: 3,
    end: 6,
    eventType: "2PT",
    eventDetail: "Mid-range shot by #11",
  },
  {
    id: "e2",
    start: 8,
    end: 10,
    eventType: "3PT",
    eventDetail: "Corner three by #7",
  },

  {
    id: "e10",
    start: 30,
    end: 32,
    eventType: "3PT",
    eventDetail: "Corner three by #7",
  },
  {
    id: "e3",
    start: 15,
    end: 16,
    eventType: "FREETHROW",
    eventDetail: "Free throw missed by #9",
  },
  {
    id: "e4",
    start: 22,
    end: 24,
    eventType: "TURNOVER",
    eventDetail: "Bad pass by #4",
  },
  {
    id: "e5",
    start: 30,
    end: 32,
    eventType: "STEAL",
    eventDetail: "Stolen by #5",
  },
  {
    id: "e6",
    start: 38,
    end: 41,
    eventType: "BLOCK",
    eventDetail: "Blocked shot by #8",
  },
  {
    id: "e7",
    start: 49,
    end: 53,
    eventType: "REBOUND",
    eventDetail: "Defensive rebound by #12",
  },
  {
    id: "e8",
    start: 60,
    end: 61,
    eventType: "FAULT",
    eventDetail: "Foul by #3",
  },
];

const TimelineTracker = ({ events = mockEvents, onSeek, onSelectEvent }) => {
  const currentTime = useSelector((state) => state.video.currentTime);
  const duration = useSelector((state) => state.video.duration);

  // Xác định rowIndex (0–6) cho mỗi event dựa vào type/subType
  const getRowIndex = (eventType) => {
    return eventTypes.findIndex((et) =>
      et.subTypes ? et.subTypes.includes(eventType) : et.type === eventType
    );
  };

  return (
    <div className="w-full p-2 h-full flex flex-col relative">
      {/* Timeline Bar */}
      <div className="relative bg-gray-200 flex-1 rounded">
        {/* Grid line chia 7 hàng */}
        {[...Array(eventTypes.length - 1)].map((_, i) => (
          <div
            key={i}
            className="absolute left-0 w-full border-t border-gray-300"
            style={{ top: `${((i + 1) / eventTypes.length) * 100}%` }}
          />
        ))}

        {/* Current Time Indicator */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-sky-500 z-10"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        />

        {/* Event Blocks */}
        {events.map((event) => {
          const rowIndex = getRowIndex(event.eventType);
          const typeObj = eventTypes[rowIndex];
          const startPercent = (event.start / duration) * 100;
          const endPercent = (event.end / duration) * 100;
          const widthPercent = Math.max(endPercent - startPercent, 0.5);
          const topPercent = (rowIndex / eventTypes.length) * 100;

          return (
            <div
              key={event.id}
              className={`absolute h-[14.285%] ${
                typeObj?.color || "bg-gray-400"
              } 
              rounded-md cursor-pointer group flex items-center justify-center px-1 text-white text-xs`}
              style={{
                left: `${startPercent}%`,
                width: `${widthPercent}%`,
                top: `${topPercent}%`,
              }}
              onClick={() => onSelectEvent(event)}
            >
              <span>{typeObj?.icon}</span>

              {/* Tooltip */}
              <div className="hidden group-hover:block absolute -top-[52px] left-[6px] z-20 bg-white text-black text-xs px-2 py-1 rounded shadow min-w-max">
                <p className="font-semibold">{event.eventType}</p>
                <p>{event.eventDetail}</p>
                <p>
                  {formatTime(event.start)} - {formatTime(event.end)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Time Ruler */}
      <div className="flex justify-between items-center text-[#ADB5BD] text-xs mt-1">
        <span>0:00</span>
        <span>{formatTime(duration / 4)}</span>
        <span>{formatTime(duration / 2)}</span>
        <span>{formatTime((duration * 3) / 4)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default TimelineTracker;

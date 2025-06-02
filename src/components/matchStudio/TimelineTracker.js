import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { formatTime } from "../../utils/formatTime";

const eventTypes = [
  { type: "2PT", color: "bg-yellow-400", icon: "🏀" },
  { type: "3PT", color: "bg-blue-400", icon: "🎯" },
  { type: "REBOUND", color: "bg-green-400", icon: "🔁" },
  { type: "TURNOVER", color: "bg-red-400", icon: "💥" },
];

const TimelineTracker = ({ events, onSeek, onSelectEvent }) => {
  const currentTime = useSelector((state) => state.video.currentTime);
  const duration = useSelector((state) => state.video.duration);

  const onAddEvent = () => {};
  return (
    <div className="w-full p-2 h-full flex flex-col">
      {/* Event Type Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 mb-2 text-sm">
          <span className="font-semibold text-gray-600">Event Type:</span>
          {eventTypes.map((ev) => (
            <div key={ev.type} className="flex items-center gap-1">
              <span className={`w-3 h-3 rounded-full ${ev.color}`} />
              <span className="text-gray-600">{ev.type}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center mb-2 text-sm">
          <div className="flex justify-end items-center gap-4">
            <span className="text-sky-500 font-bold">
              {new Date(currentTime * 1000).toISOString().substr(14, 5)}
            </span>
            <button
              onClick={() => onAddEvent(currentTime)}
              className="bg-sky-500 hover:bg-sky-600 text-white text-sm px-4 py-1 rounded shadow"
            >
              ℹ️ Add Event
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Bar */}
      <div className="relative bg-gray-200 flex-1 rounded cursor-pointer overflow-hidden">
        {/* Current Time Indicator */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-sky-500"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        />

        {/* Event Markers */}
        {/* {events.map((event) => {
          const evType = eventTypes.find((e) => e.type === event.type);
          return (
            <div
              key={event.id}
              title={`${event.type} - ${Math.floor(event.time)}s`}
              className={`absolute top-[14px] w-4 h-4 rounded-md cursor-pointer ${evType?.color || 'bg-gray-400'}`}
              style={{ left: `${(event.time / duration) * 100}%` }}
              onClick={() => onSelectEvent(event)}
            >
              <span className="text-[12px]">{evType?.icon}</span>
            </div>
          );
        })} */}
      </div>

      {/* Time display + Add Event */}
      <div className="flex justify-between items-center text-[#ADB5BD]">
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

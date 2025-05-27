import React, { useRef, useEffect, useState } from "react";

const TimelineTracker = ({
  duration,
  currentTime,
  events,
  onSeek,
  onSelectEvent,
}) => {
  const timelineRef = useRef(null);
  const [timelineWidth, setTimelineWidth] = useState(1);
  const [hoverTime, setHoverTime] = useState(null);

  useEffect(() => {
    const updateWidth = () => {
      if (timelineRef.current) {
        setTimelineWidth(timelineRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleClick = (e) => {
    const rect = timelineRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / timelineWidth;
    const time = percent * duration;
    onSeek(time);
  };

  const handleMouseMove = (e) => {
    const rect = timelineRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / timelineWidth;
    setHoverTime(percent * duration);
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full px-4">
      <div
        className="relative h-6 bg-gray-800 rounded cursor-pointer"
        ref={timelineRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* progress bar */}
        <div
          className="absolute top-0 left-0 h-full bg-blue-600 rounded"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />

        {/* current time indicator */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        />

        {/* event markers */}
        {events.map((event) => (
          <div
            key={event.id}
            title={`${event.type} (${formatTime(event.time)})`}
            className="absolute top-0 bottom-0 w-[6px] bg-red-500 rounded-full cursor-pointer hover:scale-125 transition-transform"
            style={{ left: `${(event.time / duration) * 100}%` }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectEvent(event);
            }}
          />
        ))}

        {/* hover tooltip */}
        {hoverTime !== null && (
          <div
            className="absolute -top-6 text-xs bg-black text-white px-2 py-1 rounded"
            style={{
              left: `${(hoverTime / duration) * 100}%`,
              transform: "translateX(-50%)",
            }}
          >
            {formatTime(hoverTime)}
          </div>
        )}
      </div>

      {/* time scale */}
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>0:00</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default TimelineTracker;

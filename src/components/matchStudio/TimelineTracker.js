import React from 'react';
import { useSelector } from 'react-redux';
import { formatTime } from '../../utils/formatTime';

const eventTypes = [
  { type: '2PT', color: 'bg-yellow-400', icon: '🏀' },
  { type: '3PT', color: 'bg-blue-400', icon: '🎯' },
  { type: 'REBOUND', color: 'bg-green-400', icon: '🔁' },
  { type: 'TURNOVER', color: 'bg-red-400', icon: '💥' },
];

const mockEvents = [
  { id: 'e1', start: 10, end: 14, eventType: '2PT', eventDetail: 'Fast break' },
  { id: 'e2', start: 13, end: 14, eventType: 'TURNOVER', eventDetail: 'Bad pass' },
  { id: 'e3', start: 32, end: 38, eventType: 'REBOUND', eventDetail: 'Offensive' },
  { id: 'e4', start: 44, end: 47, eventType: '3PT', eventDetail: 'Corner shot' },
];

const TimelineTracker = ({ events = mockEvents, onSeek, onSelectEvent }) => {
  const currentTime = useSelector((state) => state.video.currentTime);
  const duration = useSelector((state) => state.video.duration);

  // Tính hàng cho mỗi event để tránh đè nhau
  const layeredEvents = events.map((event, i) => {
    let layer = 0;
    for (let j = 0; j < i; j++) {
      const prev = events[j];
      if (
        (event.start >= prev.start && event.start <= prev.end) ||
        (event.end >= prev.start && event.end <= prev.end)
      ) {
        layer++;
      }
    }
    return { ...event, layer };
  });

  return (
    <div className="w-full p-2 h-full flex flex-col">
      {/* Timeline Bar */}
      <div className="relative bg-gray-200 flex-1 rounded cursor-pointer overflow-hidden">
        {/* Current Time Indicator */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-sky-500 z-10"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        />

        {/* Event Blocks */}
        {layeredEvents.map((event) => {
          const type = eventTypes.find((et) => et.type === event.eventType);
          const startPercent = (event.start / duration) * 100;
          const endPercent = (event.end / duration) * 100;
          const widthPercent = Math.max(endPercent - startPercent, 0.5);

          return (
            <div
              key={event.id}
              className={`absolute top-[${event.layer * 24 + 6}px] h-[20px] ${type?.color || 'bg-gray-400'} rounded-md cursor-pointer group`}
              style={{ left: `${startPercent}%`, width: `${widthPercent}%` }}
              onClick={() => onSelectEvent(event)}
            >
              <span className="text-xs pl-1">{type?.icon}</span>
              <div className="hidden group-hover:block absolute top-full mt-1 left-0 z-20 bg-white text-black text-xs px-2 py-1 rounded shadow">
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

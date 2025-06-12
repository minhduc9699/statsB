import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useSelector } from "react-redux";
import eventStepConfig from "../../config/eventStepConfig";
import basketballFullCourt from "../../assets/court/Basketball_court_fiba.svg"
import basketballHalfCourt from "../../assets/court/Basketball_half_court.svg"

const events = [
  { type: "shoot", label: "Shoot" },
  { type: "rebound", label: "Rebound" },
  { type: "freeThrow", label: "Free Throw" },
  { type: "turnover", label: "Turnover" },
  { type: "steal", label: "Steal" },
  { type: "block", label: "Block" },
  { type: "fault", label: "Fault" },
];

const EventCreateSteps = () => {
  const homeTeam = useSelector((state) => state.match.homeTeam);
  const awayTeam = useSelector((state) => state.match.awayTeam);
  const gameType = useSelector((state) => state.match.gameType);

  const [eventType, setEventType] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const containerRef = useRef(null);

  const steps = eventType ? eventStepConfig[eventType] || [] : [];

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [stepIndex, eventType]);

  const handleEventClick = (type) => {
    setEventType(type);
    setStepIndex(0);
    setFormData({});
  };

  useEffect(() => {
  console.log("Updated formData:", formData);
}, [formData]);

  const handleNext = (value) => {
  const key = steps[stepIndex]?.field;

  if (typeof value === "object" && !Array.isArray(value)) {
    setFormData((prev) => ({ ...prev, ...value }));
  } else {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  if (stepIndex < steps.length - 1) {
    setStepIndex((prev) => prev + 1);
  } else {
    console.log("Submitted data:", {
      eventType,
      ...formData,
      [key]: value,
    });
  }
};

  const handleBack = () => {
    if (stepIndex === 0) {
      setEventType(null);
    } else {
      setStepIndex((prev) => prev - 1);
    }
  };

  const renderStepContent = () => {
    const step = steps[stepIndex];
    if(!step) return null;

    switch (step.type) {
      case "team-select":
        return (
          <div className="flex justify-center gap-2">
            <button onClick={() => handleNext({ team: "home" })} className="bg-yellow-500 px-4 py-1 text-white rounded">
              {homeTeam?.name}
            </button>
            <button onClick={() => handleNext({team: "away"})} className="bg-yellow-500 px-4 py-1 text-white rounded">
              {awayTeam?.name}
            </button>
          </div>
        );
      case "player-select":
  const selectedTeamKey = formData.team;
  const players =
    selectedTeamKey === "home"
      ? homeTeam?.roster || []
      : selectedTeamKey === "away"
      ? awayTeam?.roster || []
      : [];

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold">{step.label}</h3>
      {players.map((player) => (
        <button
          key={player.player._id}
          onClick={() => handleNext(player.player)}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          {player.player.name}
        </button>
      ))}
    </div>
  );
      case "court-select":
        // Render court image with click event
        return (
          <div className="relative w-full flex justify-center">
            <img
              src={gameType === "5v5" ? basketballFullCourt : basketballHalfCourt}
              onClick={(e) => {
                const rect = e.target.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width).toFixed(4);
                const y = ((e.clientY - rect.top) / rect.height).toFixed(4);
                handleNext({ x, y });
              }}
              className="max-w-full h-auto"
              alt="Court"
            />
            <p className="text-sm mt-2 text-gray-600">Click to select position</p>
          </div>
        );
      default:
        // Fallback: default step với options
        return (
          <div className="flex flex-wrap justify-center gap-2">
            {step.options?.map((opt) => (
              <button
                key={opt}
                onClick={() => handleNext(opt)}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-1 rounded"
              >
                {opt}
              </button>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-center">
      <div className="w-full max-w-md" ref={containerRef}>
        {!eventType && (
          <div className="flex flex-wrap justify-center gap-2">
            {events.map((ev) => (
              <button
                key={ev.type}
                onClick={() => handleEventClick(ev.type)}
                className="bg-orange text-white px-4 py-2 rounded shadow"
              >
                {ev.label}
              </button>
            ))}
          </div>
        )}

        {eventType && stepIndex < steps.length && (
          <div className="text-center space-y-4">
            <h2 className="text-lg font-semibold mb-2">{steps[stepIndex].label}</h2>
            {renderStepContent()}
            <button
              onClick={handleBack}
              className="text-sky-500 hover:underline text-sm mt-4 block"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCreateSteps;

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useSelector } from "react-redux";
import eventStepConfig from "../../config/eventStepConfig";

const events = [
  { type: "shoot", label: "Shoot" },
  { type: "rebound", label: "Rebound" },
  { type: "freeThrow", label: "Free Throw" },
  { type: "turnover", label: "Turnover" },
  { type: "steal", label: "Steal" },
  { type: "block", label: "Block" },
  { type: "fault", label: "Fault" },
];

const EventCreateSteps = ({ homeTeam, awayTeam, gameType }) => {
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

  const handleNext = (value) => {
    const key = steps[stepIndex]?.step;
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (stepIndex < steps.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      // Submit hoặc hoàn tất ở đây
      console.log("Submitted data:", {
        eventType,
        ...formData,
        [key]: value,
      });
      // Reset hoặc tiếp tục tùy ý
    }
  };

  const handleBack = () => {
    if (stepIndex === 0) {
      setEventType(null);
    } else {
      setStepIndex((prev) => prev - 1);
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

            {/* Nếu có options thì tạo các nút */}
            {steps[stepIndex].options ? (
              <div className="flex flex-wrap justify-center gap-2">
                {steps[stepIndex].options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleNext(opt)}
                    className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-1 rounded"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={() => handleNext("next")}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-1 rounded"
              >
                Next
              </button>
            )}

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

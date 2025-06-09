import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import gsap from "gsap";

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
  const [step, setStep] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
    );
  }, [step]);

  const handleEventClick = (eventType) => {
    // Sau này lưu eventType vào state hoặc store
    setStep(1); // Chuyển sang bước kế tiếp
  };

  return (
    <div className="w-full h-full flex justify-center items-start">
      <div className="w-full" ref={containerRef}>
        {step === 0 && (
          <div className="flex justify-center gap-2">
            {events.map((ev) => (
              <button
                key={ev.type}
                onClick={() => handleEventClick(ev.type)}
                className="bg-orange hover:bg-[#ccc] text-white p-1 rounded"
              >
                {ev.label}
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="text-center">
            <p className="text-lg font-semibold mb-4">
              🔧 Step 2: More Details Coming Soon...
            </p>
            <button
              className="text-sky-500 hover:underline"
              onClick={() => setStep(0)}
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

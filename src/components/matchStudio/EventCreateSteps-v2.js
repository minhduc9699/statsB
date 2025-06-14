import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { eventStepConfigv2 } from "../../config/eventStepConfigv2";
import EventAPI from "../../api/eventAPI";
import basketballFullCourt from "../../assets/court/Basketball_court_fiba.svg";
import basketballHalfCourt from "../../assets/court/Basketball_half_court.svg";

const eventTypes = Object.keys(eventStepConfigv2);

const EventCreateStepsV2 = () => {
  const gameType = useSelector((state) => state.match.gameType);
  const homeTeam = useSelector((state) => state.match.homeTeam);
  const awayTeam = useSelector((state) => state.match.awayTeam);
  const matchId = useSelector((state) => state.match.matchId);
  const currentTime = useSelector((state) => state.video.currentTime);
  const duration = useSelector((state) => state.video.duration);

  const [stepIndex, setStepIndex] = useState(0);
  const [eventType, setEventType] = useState(null);
  const [formData, setFormData] = useState({});
  const [courtPosition, setCourtPosition] = useState(null);

  const steps = eventType ? eventStepConfigv2[eventType]?.steps || [] : [];

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleNext = (value) => {
    const key = steps[stepIndex]?.key;
    if (!key) return;

    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (stepIndex < steps.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      console.log("over", { ...formData, [key]: value });
      // handleSubmit({ ...formData, [key]: value });
    }
  };

  const handleSubmit = async (finalData) => {
    try {
      const res = await EventAPI.createEvent({
        matchId,
        type: eventType,
        selectedData: finalData,
        timeStart: currentTime,
        timeEnd: currentTime + 1,
      });
      console.log("✅ Event created:", res);
      resetAll();
    } catch (err) {
      console.error("❌ Failed to create event", err);
    }
  };

  const resetAll = () => {
    setEventType(null);
    setStepIndex(0);
    setFormData({});
  };

  const isValidShot = (shotType, x, y) => {
    // Sử dụng các hệ số tùy thuộc tỷ lệ SVG của bạn
    const hoopX = 0.5;
    const hoopY = 1;
    const r = 0.23; // bán kính 3 điểm tỷ lệ theo ảnh, ví dụ 0.23 (tức là 23% chiều cao ảnh)
    const distance = Math.sqrt((x - hoopX) ** 2 + (y - hoopY) ** 2);

    if (shotType === "2PT") return distance < r;
    if (shotType === "3PT") return distance >= r;
    return false;
  };

  const renderStep = () => {
    const step = steps[stepIndex];
    if (!step) return null;

    switch (step.type) {
      case "selectTeam":
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleNext("home")}
              className=" bg-blue-500 text-white px-3 py-1 rounded"
            >
              {homeTeam.name}
            </button>
            <button
              onClick={() => handleNext("away")}
              className="bg-green text-white px-3 py-1 rounded"
            >
              {awayTeam.name}
            </button>
          </div>
        );

      case "selectPlayer":
        const selectedTeam = formData.team === "home" ? homeTeam : awayTeam;
        const players = selectedTeam?.roster || [];
        return (
          <div className="grid grid-cols-2 gap-2">
            {players.map((player) => (
              <button
                key={player._id}
                onClick={() => handleNext(player.player._id)}
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              >
                {player.player.name}
              </button>
            ))}
          </div>
        );

      case "selectType":
        return (
          <div className="flex flex-wrap gap-2 justify-center">
            {step.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleNext(opt)}
                className="bg-orange text-white px-3 py-1 rounded"
              >
                {opt}
              </button>
            ))}
          </div>
        );

      case "selectLocation":
        return (
          <div className="relative w-full max-w-md">
            <img
              src={basketballFullCourt}
              alt="court"
              className="w-full cursor-crosshair"
              onClick={(e) => {
                const rect = e.target.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                if (!isValidShot(formData.shotType, x, y)) return;
                setCourtPosition({ x, y });
              }}
            />

            {/* Hiển thị dấu chấm tại vị trí chọn nếu hợp lệ */}
            {courtPosition && (
              <div
                className="absolute w-3 h-3 bg-red-500 rounded-full border border-white"
                style={{
                  left: `${courtPosition.x * 100}%`,
                  top: `${courtPosition.y * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}

            {/* Overlay vùng không hợp lệ */}
            {formData.shotType && (
              <svg
                className="absolute left-0 top-0 w-full h-full pointer-events-none"
                style={{ zIndex: 2 }}
              >
                {formData.shotType === "2PT" && (
                  <circle
                    cx="50%"
                    cy="100%"
                    r="23%"
                    fill="transparent"
                    stroke="none"
                  />
                )}
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="black"
                  fillOpacity="0.25"
                  mask={`url(#valid-area-mask)`}
                />
                <defs>
                  <mask id="valid-area-mask">
                    {formData.shotType === "2PT" ? (
                      <>
                        <rect
                          x="0"
                          y="0"
                          width="100%"
                          height="100%"
                          fill="white"
                        />
                        <circle cx="50%" cy="100%" r="23%" fill="black" />
                      </>
                    ) : (
                      <>
                        <circle cx="50%" cy="100%" r="23%" fill="white" />
                      </>
                    )}
                  </mask>
                </defs>
              </svg>
            )}
          </div>
        );

      default:
        return <p>⚠️ Unsupported step type: {step.type}</p>;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-4 p-4 bg-white rounded shadow">
      {!eventType ? (
        <div className="grid grid-cols-2 gap-2">
          {eventTypes.map((type) => (
            <button
              key={type}
              onClick={() => {
                setEventType(type);
                setStepIndex(0);
                setFormData({});
              }}
              className="bg-orange text-white px-3 py-2 rounded"
            >
              {type}
            </button>
          ))}
        </div>
      ) : (
        <>
          <h2 className="text-md font-semibold mb-2">
            {steps[stepIndex]?.label || "Step"}
          </h2>
          {renderStep()}
          <button
            onClick={() =>
              stepIndex === 0 ? resetAll() : setStepIndex((prev) => prev - 1)
            }
            className="text-sm text-blue  mt-4 hover:underline"
          >
            ← Back
          </button>
        </>
      )}
    </div>
  );
};

export default EventCreateStepsV2;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMatchEvents } from "../../store/matchSlide";
import { eventStepConfigv2 } from "../../config/eventStepConfigv2";
import EventAPI from "../../api/eventAPI";
import EventToastNoti from "./EventToastNoti";
import basketballFullCourt from "../../assets/court/Basketball_court_fiba.svg";
import basketballHalfCourt from "../../assets/court/Basketball_half_court.svg";

const eventTypes = Object.keys(eventStepConfigv2);

const EventCreateStepsV2 = () => {
  const dispatch = useDispatch();

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
  const [onSubmit, setOnSubmit] = useState(false);
  const [toast, setToast] = useState(null);

  const steps = eventType ? eventStepConfigv2[eventType]?.steps || [] : [];

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
      setOnSubmit(true);
    }
  };

  const handleSubmit = async () => {
    let data = {
      match: matchId,
      team: formData.team,
      player: formData.player,
      type: eventType,
      timestamps: {
        start: currentTime,
        end: currentTime + 0.1,
      },
      details: {},
    };
    if (formData.reboundType !== undefined && formData.reboundType !== null) {
      data = {
        ...data,
        details: {
          ...data.details,
          location: {
          x: formData.location.x,
          y: formData.location.y
        },
          reboundType: formData.reboundType,
        },
      };
    }
    if (formData.shotType !== undefined && formData.shotType !== null) {
      data = {
        ...data,
        details: {
          ...data.details,
          shotType: formData.shotType,
          outcome: formData.outcome,
          location: {
          x: formData.location.x,
          y: formData.location.y
        },
        },
      };
    }
    if (formData.foulType !== undefined && formData.foulType !== null) {
      data = {
        ...data,
        details: {
          ...data.details,
          location: {
          x: formData.location.x,
          y: formData.location.y
        },
          foulType: formData.foulType,
        },
      };
    }
    if (eventType == "Steal") {
      data = {
        ...data,
        details: {
          ...data.details,
          location: {
          x: formData.location.x,
          y: formData.location.y
        },
        },
      };
    }
    if (eventType == "Block") {
      data = {
        ...data,
        details: {
          ...data.details,
          location: {
          x: formData.location.x,
          y: formData.location.y
        },
        },
      };
    }
    if (eventType == "Turnover") {
      data = {
        ...data,
        details: {
          ...data.details,
          location: {
          x: formData.location.x,
          y: formData.location.y
        },
        },
      };
    }
    if (eventType == "Free Throw") {
      data = {
        ...data,
        details: {
          outcome: formData.outcome,
        },
      };
    }

    try {
      const res = await EventAPI.createEvent(matchId, data);
      dispatch(setMatchEvents(res));
      setToast("✔️ Event created successfully!");
      resetAll();
    } catch (err) {
      console.log(err);
      setToast("❌ Failed to create event.");
    }
  };

  const resetAll = () => {
    setEventType(null);
    setStepIndex(0);
    setFormData({});
    setOnSubmit(false);
    setCourtPosition(null);
  };

  function isValidCourt(x, y) {
    // Kiểm tra trong sân (trừ viền ngoài)
    return x >= 0.05 && x <= 0.95 && y >= 0.05 && y <= 0.95;
  }

  function isValidShot(shotType, x, y) {
    if (!isValidCourt(x, y)) return false;

    // Vị trí hai rổ
    const hoopLeftX = 0.08,
      hoopRightX = 0.92,
      hoopY = 0.5;
    const r = 0.35;

    // Khoảng cách đến mỗi rổ
    const dLeft = Math.sqrt((x - hoopLeftX) ** 2 + (y - hoopY) ** 2);
    const dRight = Math.sqrt((x - hoopRightX) ** 2 + (y - hoopY) ** 2);

    if (shotType === "2-Point Score") {
      // Hợp lệ khi nằm trong vòng 3 điểm bất kỳ rổ nào
      return dLeft < r || dRight < r;
    }
    if (shotType === "3-Point Score") {
      // Hợp lệ khi ngoài cả hai vòng 3 điểm
      return dLeft >= r && dRight >= r;
    }
    // Các event khác luôn hợp lệ miễn là trong sân
    return true;
  }

  function handleClickPositon(e) {
    const rect = e.target.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    if (!isValidShot(eventType, x, y)) return;
    setCourtPosition({ x, y });
    handleNext({ x, y });
  }

  const renderStep = () => {
    const step = steps[stepIndex];
    if (!step) return null;

    switch (step.type) {
      case "selectTeam":
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleNext(homeTeam._id)}
              className=" bg-blue-500 text-white px-3 py-1 rounded"
            >
              {homeTeam.name}
            </button>
            <button
              onClick={() => handleNext(awayTeam._id)}
              className="bg-green text-white px-3 py-1 rounded"
            >
              {awayTeam.name}
            </button>
          </div>
        );

      case "selectPlayer":
        const selectedTeam =
          formData.team === homeTeam._id ? homeTeam : awayTeam;
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
          <div className="relative w-full max-w-[600px]">
            <img
              src={basketballFullCourt}
              alt="court"
              className="w-full cursor-crosshair"
              onClick={(e) => {
                handleClickPositon(e);
              }}
            />
            {/* Overlay vùng ngoài sân */}
            <svg
              className="absolute left-0 top-0 w-full h-full pointer-events-none"
              style={{ zIndex: 2 }}
            >
              {/* Overlay ngoài sân */}
              <rect
                x="0"
                y="0"
                width="100%"
                height="10%"
                fill="black"
                fillOpacity="0.35"
              />
              <rect
                x="0"
                y="90%"
                width="100%"
                height="10%"
                fill="black"
                fillOpacity="0.35"
              />
              <rect
                x="0"
                y="0"
                width="6%"
                height="100%"
                fill="black"
                fillOpacity="0.35"
              />
              <rect
                x="94%"
                y="0"
                width="6%"
                height="100%"
                fill="black"
                fillOpacity="0.35"
              />
              {/* Overlay ngoài vùng 2PT hoặc 3PT */}
              {eventType === "2-Point Score" && (
                <>
                  {/* Làm mờ ngoài hai vòng 3 điểm */}
                  <mask id="in-2pt-area">
                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                    <circle cx="8%" cy="50%" r="23.5%" fill="black" />
                    <circle cx="92%" cy="50%" r="23.5%" fill="black" />
                  </mask>
                  <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="black"
                    fillOpacity="0.25"
                    mask="url(#in-2pt-area)"
                  />
                </>
              )}
              {eventType === "3-Point Score" && (
                <>
                  {/* Làm mờ bên trong hai vòng 3 điểm */}
                  <mask id="out-3pt-area">
                    <rect x="0" y="0" width="100%" height="100%" fill="black" />
                    <circle cx="8%" cy="50%" r="23.5%" fill="white" />
                    <circle cx="92%" cy="50%" r="23.5%" fill="white" />
                  </mask>
                  <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="black"
                    fillOpacity="0.25"
                    mask="url(#out-3pt-area)"
                  />
                </>
              )}
            </svg>
            {/* Hiển thị điểm click */}
            {courtPosition && (
              <div
                className="absolute w-3 h-3 bg-red-600 rounded-full border border-white"
                style={{
                  left: `${courtPosition.x * 100}%`,
                  top: `${courtPosition.y * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}
          </div>
        );

      default:
        return <p>⚠️ Unsupported step type: {step.type}</p>;
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto ">
      {toast && (
        <EventToastNoti message={toast} onClose={() => setToast(null)} />
      )}
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
          <div className="flex items-center justify-between">
            <button
              onClick={() =>
                stepIndex === 0 ? resetAll() : setStepIndex((prev) => prev - 1)
              }
              className="text-sm text-blue  mt-4 hover:underline"
            >
              ← Back
            </button>
            {onSubmit && courtPosition && (
              <button
                onClick={handleSubmit}
                className="text-sm text-blue  mt-4 hover:underline"
              >
                Create Event
              </button>
            )}

            {eventType == "Free Throw" && (
              <button
                onClick={handleSubmit}
                className="text-sm text-blue  mt-4 hover:underline"
              >
                Create Event
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EventCreateStepsV2;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { eventStepConfigv2 } from "../../config/eventStepConfigv2";
import EventAPI from "../../api/eventAPI";
import basketballCourt from "../../assets/court/Basketball_court_fiba.svg";

const eventTypes = Object.keys(eventStepConfigv2);

const EventCreateStepsV2 = () => {
  const homeTeam = useSelector((state) => state.match.homeTeam);
  const awayTeam = useSelector((state) => state.match.awayTeam);
  const matchId = useSelector((state) => state.match.matchId);
  const currentTime = useSelector((state) => state.video.currentTime);
  const duration = useSelector((state) => state.video.duration);

  const [stepIndex, setStepIndex] = useState(0);
  const [eventType, setEventType] = useState(null);
  const [formData, setFormData] = useState({});

  const steps = eventType ? eventStepConfigv2[eventType]?.steps || [] : [];

  useEffect(()=> {
    console.log(formData)
  }, [formData])

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
      handleSubmit({ ...formData, [key]: value });
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

  const renderStep = () => {
    const step = steps[stepIndex];
    if (!step) return null;

    switch (step.type) {
      case "selectTeam":
        return (
          <div className="flex gap-2">
            <button onClick={() => handleNext("home")} className=" bg-blue-500 text-white px-3 py-1 rounded">
              {homeTeam.name}
            </button>
            <button onClick={() => handleNext("away")} className="bg-green text-white px-3 py-1 rounded">
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
                key={player.player._id}
                onClick={() => handleNext(player.player.id)}
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              >
                {player.player.name}
              </button>
            ))}
          </div>
        );

      case "select":
        return (
          <div className="flex flex-wrap gap-2 justify-center">
            {step.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleNext(opt)}
                className="bg-purple  text-white px-3 py-1 rounded"
              >
                {opt}
              </button>
            ))}
          </div>
        );

      case "selectLocation":
        return (
          <div className="flex flex-col items-center">
            <img
              src={basketballCourt}
              alt="court"
              className="w-full max-w-md cursor-crosshair"
              onClick={(e) => {
                const rect = e.target.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width).toFixed(3);
                const y = ((e.clientY - rect.top) / rect.height).toFixed(3);
                handleNext({ x, y });
              }}
            />
            <p className="text-xs text-gray  mt-2">Click to set position</p>
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
          <h2 className="text-md font-semibold mb-2">{steps[stepIndex]?.label || "Step"}</h2>
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

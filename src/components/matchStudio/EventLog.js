import React, { useState } from "react";
import fullCourtSVG from "../../assets/court/Basketball_court_fiba.svg";

const EventLog = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-full h-[97%] p-[16px] bg-white rounded flex flex-col space-y-[16px] items-center justify-between">
        <div className="text-[20px] pb-[16px] text-start">Event log</div>
        <div className="w-full">
          <div className="text-[20px] pb-[16px] text-start">Shoot position</div>
          <img
            src={fullCourtSVG}
            alt="Basketball Full Court"
            className="court-image"
          />
        </div>
      </div>
    </div>
  );
};

export default EventLog;

import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import matchAPI from "../api/matchAPI";
import VideoPlayerArea from "../components/matchStudio/VideoPlayerArea";
import TimelineTracker from "../components/matchStudio/TimelineTracker";

import infoIcon from "../assets/info-icon.png";

const MatchStudio = () => {
  const { matchId } = useParams(); // undefined nếu là tạo mới
  const [matchData, setMatchData] = useState(null);

  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [events, setEvents] = useState([
    { id: "evt1", time: 25, type: "2PT" },
    { id: "evt2", time: 90, type: "REBOUND" },
  ]);

  const handleSeek = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  useEffect(() => {
    if (matchId) {
      const fetchMatch = async () => {
        try {
          const res = await matchAPI.getMatchById(matchId);
          setMatchData(res.data);
        } catch (err) {
          console.error("Lỗi khi load match:", err);
        }
      };
      fetchMatch();
    }
  }, [matchId]);

  return (
    <>
      <div className="bg-studiobg">
        <div className="bg-dark text-white font-roboto text-[14px] flex items-center justify-between px-[24px] py-[10px]">
          <div className="">
            Matches List/ {matchId ? "Edit Match" : "Create New Match"}
          </div>
          <button className="bg-[#E9ECEF] text-[#ADB5BD] flex items-center p-[12px] rounded-[10px] space-x-[5px]">
            <img className="w-[10px] h-[10px]" src={infoIcon} alt="info-icon" />
            <span>View Dashboard</span>
          </button>
        </div>
        <div className="grid grid-cols-12 gap-[12px] px-[14px] overflow-hidden">
          <div className="col-span-9">
            <VideoPlayerArea
              videoRef={videoRef}
              onTimeUpdate={setCurrentTime}
              onDurationChange={setDuration}
            />

            <TimelineTracker
              duration={duration}
              currentTime={currentTime}
              events={events}
              onSeek={handleSeek}
              onSelectEvent={(e) => handleSeek(e.time)}
            />
          </div>
          <div className="col-span-3"></div>
        </div>
      </div>
    </>
  );
};

export default MatchStudio;

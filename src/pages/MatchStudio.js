import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import matchAPI from "../api/matchAPI";
import VideoPlayerArea from "../components/matchStudio/VideoPlayerArea";
import TimelineTracker from "../components/matchStudio/TimelineTracker";
import EventCreator from "../components/matchStudio/EventCreator";
import EventLog from "../components/matchStudio/EventLog";
import MatchSetupDialog from "../components/matchStudio/MatchSetupDialog";

import infoIcon from "../assets/info-icon.png";

const MatchStudio = () => {
  const { matchId } = useParams(); // undefined nếu là tạo mới
  const [matchData, setMatchData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(!matchId);

  const videoRef = useRef(null);

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
        <div className="bg-dark text-white font-roboto text-[14px] flex items-center justify-between px-[24px] py-[10px] h-[70px]">
          <div className="">
            Matches List/ {matchId ? "Edit Match" : "Create New Match"}
          </div>
          <button className="bg-[#E9ECEF] text-[#ADB5BD] flex items-center p-[12px] rounded-[10px] space-x-[5px]">
            <img className="w-[10px] h-[10px]" src={infoIcon} alt="info-icon" />
            <span>View Dashboard</span>
          </button>
        </div>
        <div className="match-studio-container grid grid-cols-12 gap-[12px] px-[14px] overflow-hidden">
          <div className="col-span-6 h-full">
            <div className="h-2/3">
              <VideoPlayerArea />
            </div>

            <div className="h-1/3">
              <TimelineTracker />
            </div>
          </div>
          <div className="col-span-4 h-full">
            <EventCreator />
          </div>
          <div className="col-span-2 h-full">
            <EventLog />
          </div>
        </div>
        {/* <MatchSetupDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        /> */}
      </div>
    </>
  );
};

export default MatchStudio;

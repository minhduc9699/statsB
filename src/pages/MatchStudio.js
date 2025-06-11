import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setMatchInfo } from "../store/matchSlide";
import matchAPI from "../api/matchAPI";
import teamAPI from "../api/teamAPI";
import playerAPI from "../api/playerAPI";
import VideoPlayerArea from "../components/matchStudio/VideoPlayerArea";
import TimelineTracker from "../components/matchStudio/TimelineTracker";
import EventCreator from "../components/matchStudio/EventCreator";
import EventLog from "../components/matchStudio/EventLog";
import MatchSetupDialog from "../components/matchStudio/MatchSetupDialog";

import infoIcon from "../assets/info-icon.png";

const MatchStudio = () => {
  const dispatch = useDispatch();
  
  const { matchId } = useParams(); // undefined nếu là tạo mới
  const [matchData, setMatchData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(!matchId);
  const [matchType, setMatchType] = useState("5v5");
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  // const [teams, setTeams] = useState([]);
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);

  const videoRef = useRef(null);

  useEffect(() => {
    if (matchId) {
      const fetchAll = async () => {
        await fetchMatch();
        // await fectchEvents();
      };  
      fetchAll();
    }
  }, [matchId]);

  const fetchMatch = async () => {
    try {
      const res = await matchAPI.getMatchById(matchId);
      setMatchData(res.data);
      // setMatchType(res.data.matchType);
      await fectchTeams();
    } catch (err) {
      console.error("Lỗi khi load match:", err);
    }
  };

  const fectchTeams = async () => {
    if (matchData) {
      const homeTeamId = matchData.homeTeam.id;
      const awayTeamId = matchData.awayTeam.id;
      try {
        const homeTeamRes = await teamAPI.getTeamById(homeTeamId);
        const awayTeamRes = await teamAPI.getTeamById(awayTeamId);
        setHomeTeam(homeTeamRes.data);
        setAwayTeam(awayTeamRes.data);
        setHomePlayers(homeTeamRes.roster);
        setAwayPlayers(awayTeamRes.roster);
        dispatch(setMatchInfo({ matchType, homeTeam, awayTeam }));
      } catch (err) {
        console.error("Lỗi khi load teams:", err);
      }
    }
  };

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

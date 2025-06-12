import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMatchId, setMatchInfo, setGameType } from "../store/matchSlide";
import teamAPI from "../api/teamAPI";
import matchAPI from "../api/matchAPI";
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
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  // const [teams, setTeams] = useState([]);
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);

  const videoRef = useRef(null);

  useEffect(() => {
  if (!matchId) return;

  const initMatchData = async () => {
    try {
      const matchData = await fetchMatchData(matchId);
      const { homeTeam, awayTeam } = await fetchTeamsData(matchData);

      // Cập nhật Redux store
      dispatch(setMatchId(matchId));
      dispatch(setGameType(matchData.gameType));
      dispatch(setMatchInfo({ homeTeam, awayTeam }));

      // Cập nhật local state nếu cần
      setMatchData(matchData);
      setHomeTeam(homeTeam);
      setAwayTeam(awayTeam);
      setHomePlayers(homeTeam.rosters || []);
      setAwayPlayers(awayTeam.rosters || []);

    } catch (err) {
      console.error("Lỗi khởi tạo dữ liệu trận đấu:", err);
    }
  };

  initMatchData();
}, [matchId]);

  const fetchMatchData = async (id) => {
  try {
    const res = await matchAPI.getMatchById(id);
    if (!res?.data) throw new Error("Không có dữ liệu match.");
    return res.data;
  } catch (error) {
    console.error("Lỗi khi fetch match:", error);
    throw error;
  }
};

const fetchTeamsData = async (matchData) => {
  const homeId = matchData?.homeTeam?._id;
  const awayId = matchData?.awayTeam?._id;

  if (!homeId || !awayId) {
    throw new Error("Thiếu thông tin team trong matchData");
  }

  try {
    const [homeRes, awayRes] = await Promise.all([
      teamAPI.getTeamById(homeId),
      teamAPI.getTeamById(awayId),
    ]);

    const homeData = homeRes?.data;
    const awayData = awayRes?.data;

    if (!homeData || !awayData) {
      throw new Error("Không lấy được dữ liệu team");
    }

    return { homeTeam: homeData, awayTeam: awayData };
  } catch (error) {
    console.error("Lỗi khi fetch team:", error);
    throw error;
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
        {!matchId && <MatchSetupDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />}
      </div>
    </>
  );
};

export default MatchStudio;

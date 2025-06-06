import React, { useEffect, useState } from "react";
import teamAPI from "../../api/teamAPI";
import { useDispatch } from "react-redux";
import { setMatchInfo } from "../../store/matchSlide";

const MatchSetupDialog = ({ onClose }) => {
    const dispatch = useDispatch();

    const [season, setSeason] = useState("");
    const [matchType, setMatchType] = useState("5v5");
    const [homeTeamId, setHomeTeamId] = useState("");
    const [awayTeamId, setAwayTeamId] = useState("");

    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await teamAPI.getAllTeams();
                // Kiểm tra log kết quả
                console.log("teams", res.data);
                setTeams(res.data); // hoặc res nếu res là array
            } catch (err) {
                console.error("Error fetching teams", err);
            }
        };

        fetchTeams();
    }, []);


    dispatch(
        setMatchInfo({
            season,
            matchType,
            homeTeamId,
            awayTeamId,
        })
    );

    onClose(); // đóng dialog

return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">Create New Match</h2>

            <label className="block text-sm font-medium">Season</label>
            <input
                type="text"
                className="w-full border p-2 rounded mb-4"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                placeholder="e.g. 2024-2025"
            />

            <label className="block text-sm font-medium">Match Type</label>
            <select
                className="w-full border p-2 rounded mb-4"
                value={matchType}
                onChange={(e) => setMatchType(e.target.value)}
            >
                <option value="5v5">5v5</option>
                <option value="3v3">3v3</option>
            </select>

            <label className="block text-sm font-medium">Home Team</label>
            <select
                className="w-full border p-2 rounded mb-4"
                value={homeTeamId}
                onChange={(e) => setHomeTeamId(e.target.value)}
            >{Array.isArray(teams) && teams.map(team => (
                <option key={team._id} value={team._id}>{team.name}</option>
            ))}
            </select>

            <label className="block text-sm font-medium">Away Team</label>
            <select
                className="w-full border p-2 rounded mb-4"
                value={awayTeamId}
                onChange={(e) => setAwayTeamId(e.target.value)}
            >{Array.isArray(teams) && teams.map(team => (
                <option key={team._id} value={team._id}>{team.name}</option>
            ))}
            </select>

            <div className="flex justify-end gap-2 mt-4">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                >
                    Cancel
                </button>
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded"
                >
                    Confirm
                </button>
            </div>
        </div>
    </div>
);
};

export default MatchSetupDialog;

import React, { useState, useEffect } from 'react';
import teamAPI from "../../api/teamAPI";
import { useDispatch, useSelector } from 'react-redux';
// import { setMatchMetadata } from '../store/matchSlice'; // giả định bạn có matchSlice.js

const MatchSetupDialog = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [season, setSeason] = useState('');
    const [matchType, setMatchType] = useState('5v5');
    const [teamsList, setTeamsList] = useState([]);
    const [teamHome, setTeamHome] = useState([]);
    const [teamAway, setTeamAway] = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
            await fetchTeams();
        };
        fetchAll();
    }, [])

    const fetchTeams = async () => {
        try {
            const res = await teamAPI.getAllTeams();
            setTeamHome(res.data);
            setTeamAway(res.data);
            return res.data;
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = () => {
        if (!season || !matchType || !teamHome || !teamAway) return;

        // dispatch(setMatchMetadata({ season, matchType, teamHome, teamAway }));
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow w-[400px]">
                <h2 className="text-lg font-semibold mb-4">Thiết lập trận đấu mới</h2>
                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Season (ex: 2025)"
                        className="border px-3 py-2 rounded"
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                    />
                    <select
                        className="border px-3 py-2 rounded"
                        value={matchType}
                        onChange={(e) => setMatchType(e.target.value)}
                    >
                        <option value="5v5">5v5</option>
                        <option value="3v3">3v3</option>
                    </select>
                    <div className="grid grid-cols-2 gap-3">
                        {teamHome.map((team) => (
                            <div
                                key={team._id}
                                // onClick={() => setHomeTeamId(team._id)}
                                className={`border p-2 rounded flex items-center gap-2 cursor-pointer
                                    }`}
                            >
                                <img src={team.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                                <span>{team.name}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button onClick={onClose} className="px-4 py-2 text-gray-500">Hủy</button>
                        <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Lưu</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchSetupDialog;

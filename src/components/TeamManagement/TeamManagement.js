import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TeamEditor from './TeamEditor';
import './TeamManagement.css';

const TeamManagement = () => {
  const teams = useSelector(state => state.teams.list);
  const players = useSelector(state => state.players.list);
  const dispatch = useDispatch();

  return (
    <div className="team-management">
      <h2>Team Management</h2>
      <div className="team-editors">
        {teams.map(team => (
          <TeamEditor
            key={team.id}
            team={team}
            allPlayers={players}
            dispatch={dispatch}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamManagement;

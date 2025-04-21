import React, { useState } from 'react';
import './TeamEditor.css';

const TeamEditor = ({ team, updateTeam, allTeams }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(team.name);
  const [description, setDescription] = useState(team.description);
  const [players, setPlayers] = useState(team.players);

  // Helper: count in-game players
  const inGameCount = players.filter(p => p.inGame).length;

  // Add new player
  const addPlayer = () => {
    const newName = prompt('Player name?');
    const newNumber = prompt('Jersey number?');
    if (!newName || !newNumber) return;
    setPlayers([
      ...players,
      { id: `p${Date.now()}`, name: newName, number: Number(newNumber), role: '', inGame: false },
    ]);
  };

  // Remove player
  const removePlayer = (id) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  // Toggle in-game status (max 5 enforced)
  const toggleInGame = (id) => {
    setPlayers(players => {
      const next = players.map(p =>
        p.id === id ? { ...p, inGame: !p.inGame } : p
      );
      if (next.filter(p => p.inGame).length > 5) {
        alert('Only 5 players can be in the game!');
        return players;
      }
      return next;
    });
  };

  // Assign captain
  const assignCaptain = (id) => {
    setPlayers(players => players.map(p => ({ ...p, role: p.id === id ? 'captain' : '' })));
  };

  // Save team edits
  const saveTeam = () => {
    updateTeam({ ...team, name, description, players });
    setEditing(false);
  };

  return (
    <div className="team-editor">
      {editing ? (
        <div className="team-header-edit">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Team Name" />
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
          <button onClick={saveTeam}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div className="team-header">
          <h3>{team.name}</h3>
          <p>{team.description}</p>
          <button onClick={() => setEditing(true)}>Edit</button>
        </div>
      )}
      <div className="player-list">
        <h4>Roster</h4>
        <button onClick={addPlayer}>Add Player</button>
        <ul>
          {players.map(player => (
            <li key={player.id} className={player.inGame ? 'in-game' : 'bench'}>
              <span>#{player.number} {player.name}</span>
              {player.role === 'captain' && <span className="captain-badge"> (C)</span>}
              <button onClick={() => toggleInGame(player.id)}>
                {player.inGame ? 'Bench' : (inGameCount < 5 ? 'In Game' : 'In Game (Full)')}
              </button>
              <button onClick={() => assignCaptain(player.id)} disabled={player.role === 'captain'}>
                Captain
              </button>
              <button onClick={() => removePlayer(player.id)}>Remove</button>
            </li>
          ))}
        </ul>
        <div className="in-game-summary">
          <strong>In Game ({players.filter(p => p.inGame).length}/5):</strong> {players.filter(p => p.inGame).map(p => p.name).join(', ')}
        </div>
      </div>
    </div>
  );
};

export default TeamEditor;

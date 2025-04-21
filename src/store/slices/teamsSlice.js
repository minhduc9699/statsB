import { createSlice } from '@reduxjs/toolkit';

// Initial state: two teams, each with roster of playerIds, roles, and inGame status
const initialState = {
  list: [
    {
      id: 'team-1',
      name: 'Team A',
      description: 'First team',
      players: [
        // { playerId: 'player-1', role: '', inGame: false }
      ]
    },
    {
      id: 'team-2',
      name: 'Team B',
      description: 'Second team',
      players: []
    }
  ]
};

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    editTeamInfo: (state, action) => {
      const { teamId, name, description } = action.payload;
      const team = state.list.find(t => t.id === teamId);
      if (team) {
        team.name = name;
        team.description = description;
      }
    },
    addPlayerToTeam: (state, action) => {
      const { teamId, playerId } = action.payload;
      const team = state.list.find(t => t.id === teamId);
      if (team && !team.players.some(p => p.playerId === playerId)) {
        team.players.push({ playerId, role: '', inGame: false });
      }
    },
    removePlayerFromTeam: (state, action) => {
      const { teamId, playerId } = action.payload;
      const team = state.list.find(t => t.id === teamId);
      if (team) {
        team.players = team.players.filter(p => p.playerId !== playerId);
      }
    },
    assignCaptain: (state, action) => {
      const { teamId, playerId } = action.payload;
      const team = state.list.find(t => t.id === teamId);
      if (team) {
        team.players.forEach(p => { p.role = (p.playerId === playerId ? 'captain' : ''); });
      }
    },
    toggleInGame: (state, action) => {
      const { teamId, playerId } = action.payload;
      const team = state.list.find(t => t.id === teamId);
      if (team) {
        const player = team.players.find(p => p.playerId === playerId);
        if (player) {
          const currentlyInGame = team.players.filter(p => p.inGame).length;
          if (!player.inGame && currentlyInGame >= 5) return; // Enforce max 5
          player.inGame = !player.inGame;
        }
      }
    },
    setInGame: (state, action) => {
      // Set a specific player's inGame status (for bulk updates)
      const { teamId, playerId, inGame } = action.payload;
      const team = state.list.find(t => t.id === teamId);
      if (team) {
        const player = team.players.find(p => p.playerId === playerId);
        if (player) player.inGame = inGame;
      }
    },
    clearTeam: (state, action) => {
      const { teamId } = action.payload;
      const team = state.list.find(t => t.id === teamId);
      if (team) team.players = [];
    }
  }
});

export const { editTeamInfo, addPlayerToTeam, removePlayerFromTeam, assignCaptain, toggleInGame, setInGame, clearTeam } = teamsSlice.actions;
export default teamsSlice.reducer;

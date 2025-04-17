import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [
    { id: 'player-1', name: 'John Smith', number: '23' },
    { id: 'player-2', name: 'Mike Johnson', number: '10' },
    { id: 'player-3', name: 'David Williams', number: '34' },
    { id: 'player-4', name: 'Chris Davis', number: '5' },
    { id: 'player-5', name: 'James Brown', number: '12' }
  ],
  selectedPlayerId: null
};

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    addPlayer: (state, action) => { state.list.push(action.payload); },
    updatePlayer: (state, action) => {
      const idx = state.list.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) state.list[idx] = action.payload;
    },
    deletePlayer: (state, action) => {
      state.list = state.list.filter(p => p.id !== action.payload);
    },
    selectPlayer: (state, action) => { state.selectedPlayerId = action.payload; }
  }
});

export const { addPlayer, updatePlayer, deletePlayer, selectPlayer } = playersSlice.actions;
export default playersSlice.reducer;

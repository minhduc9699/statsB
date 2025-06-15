import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  matchId: null,
  gameType: "5v5",
  homeTeam: null,
  awayTeam: null,
  matchEvents: [],
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    setMatchInfo: (state, action) => {
      const { gameType, homeTeam, awayTeam } = action.payload;
      state.gameType = gameType;
      state.homeTeam = homeTeam;
      state.awayTeam = awayTeam;
    },
    setGameType: (state, action) => {
      state.gameType = action.payload;
    },
    setMatchId: (state, action) => {
      state.matchId = action.payload;
    },
    setMatchEvents: (state, action) => {
      state.matchEvents = [...state.matchEvents, action.payload];
    },
  },
});

export const {
  setMatchInfo,
  setMatchId,
  setGameType,
  clearMatchInfo,
  setMatchEvents,
} = matchSlice.actions;

export default matchSlice.reducer;

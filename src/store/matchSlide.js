import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  matchId: null,
  season: "",
  matchType: "5v5",
  homeTeamId: null,
  awayTeamId: null,
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    setMatchInfo: (state, action) => {
      const { season, matchType, homeTeamId, awayTeamId } = action.payload;
      state.season = season;
      state.matchType = matchType;
      state.homeTeamId = homeTeamId;
      state.awayTeamId = awayTeamId;
    },
    setMatchId: (state, action) => {
      state.matchId = action.payload;
    },
    clearMatchInfo: () => initialState,
  },
});

export const {
  setMatchInfo,
  setMatchId,
  clearMatchInfo,
} = matchSlice.actions;

export default matchSlice.reducer;

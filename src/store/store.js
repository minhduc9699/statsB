import { configureStore } from '@reduxjs/toolkit';
import videoReducer from './slices/videoSlice';
import eventsReducer from './slices/eventsSlice';
import playersReducer from './slices/playersSlice';
import teamsReducer from './slices/teamsSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    video: videoReducer,
    events: eventsReducer,
    players: playersReducer,
    teams: teamsReducer,
    ui: uiReducer
  }
});

export default store;

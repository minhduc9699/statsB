import { configureStore } from '@reduxjs/toolkit';
import videoReducer from './slices/videoSlice';
import eventsReducer from './slices/eventsSlice';
import playersReducer from './slices/playersSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    video: videoReducer,
    events: eventsReducer,
    players: playersReducer,
    ui: uiReducer
  }
});

export default store;

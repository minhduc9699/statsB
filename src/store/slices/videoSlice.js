import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentTime: 0,
  duration: 0,
  isPaused: true,
  videoFile: null
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setVideoFile: (state, action) => { state.videoFile = action.payload; },
    setCurrentTime: (state, action) => { state.currentTime = action.payload; },
    setDuration: (state, action) => { state.duration = action.payload; },
    setIsPaused: (state, action) => { state.isPaused = action.payload; },
    togglePlayPause: (state) => { state.isPaused = !state.isPaused; }
  }
});

export const { setVideoFile, setCurrentTime, setDuration, setIsPaused, togglePlayPause } = videoSlice.actions;
export default videoSlice.reducer;

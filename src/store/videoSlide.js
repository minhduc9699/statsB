import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videos: [], // { id, file, name, duration }
  currentVideoIndex: 0,
  currentTime: 0,
  duration: 0,
  isPlaying: false,
};

const videoSlide = createSlice({
  name: "video",
  initialState,
  reducers: {
    addVideo: (state, action) => {
      console.log(action);
      state.videos.push(action.payload);
    },
    setCurrentVideoIndex: (state, action) => {
      state.currentVideoIndex = action.payload;
    },
    renameVideo: (state, action) => {
      const { id, name } = action.payload;
      const video = state.videos.find((v) => v.id === id);
      if (video) video.name = name;
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action) => { state.duration = action.payload; },
    setIsPlaying: (state, action) => {
      console.log(action);
      state.isPlaying = action.payload;
    },
    resetVideo: (state) => {
      state.currentTime = 0;
      state.isPlaying = false;
    },
  },
});

export const {
  addVideo,
  setCurrentVideoIndex,
  renameVideo,
  setCurrentTime,
  setDuration,
  setIsPlaying,
  resetVideo,
} = videoSlide.actions;
export default videoSlide.reducer;

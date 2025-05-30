import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videos: [], // { id, file, name, duration }
  currentVideoId: null,
  currentTime: 0,
  isPlaying: false,
};

const videoSlide = createSlice({
  name: "video",
  initialState,
  reducers: {
    setVideos: (state, action) => {
      state.videos = action.payload;
    },
    addVideo: (state, action) => {
      state.videos.push(action.payload);
    },
    renameVideo: (state, action) => {
      const { id, name } = action.payload;
      const video = state.videos.find((v) => v.id === id);
      if (video) video.name = name;
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    resetVideo: (state) => {
      state.currentTime = 0;
      state.isPlaying = false;
    },
  },
});

export const {
  setVideos,
  addVideo,
  renameVideo,
  setCurrentTime,
  setIsPlaying,
  resetVideo,
} = videoSlide.actions;
export default videoSlide.reducer;

import { configureStore } from "@reduxjs/toolkit";
import videoSlide from "./videoSlide";

const store = configureStore({
  reducer: {
    video: videoSlide,
  },
});

export default store;

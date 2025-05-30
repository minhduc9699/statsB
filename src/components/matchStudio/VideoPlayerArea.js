import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addVideo, setCurrentVideoIndex, resetVideo, setCurrentTime, setIsPlaying, renameVideo, setDuration } from "../../store/videoSlide";

import fiveBackward from "../../assets/video-player/5-seconds-backward.png";
import tenBackward from "../../assets/video-player/10-seconds-backward.png";
import fiveForward from "../../assets/video-player/5-seconds-forward.png";
import tenForward from "../../assets/video-player/10-seconds-forward.png";
import play from "../../assets/video-player/play.png";
import pause from "../../assets/video-player/pause.png";

const VideoPlayerArea = () => {
  const videos = useSelector((state) => state.video.videos);
  const currentVideoIndex = useSelector((state) => state.video.currentVideoIndex);
  const currentTime = useSelector((state) => state.video.currentTime);
  const duration = useSelector((state) => state.video.duration);
  const isPlaying = useSelector((state) => state.video.isPlaying);

  const containerRef = useRef(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [renamingIndex, setRenamingIndex] = useState(null);
  const [renameText, setRenameText] = useState("");
  const videoRef = useRef(null);
  const videoSrc = videos[currentVideoIndex]?.src;

  const dispatch = useDispatch();

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      dispatch(addVideo({ src: url, fileName: file.name }));
      console.log(videos)
      if (videos.length === 0) setCurrentVideoIndex(0);
    }
  };

  const moveVideo = (fromIdx, toIdx) => {
    addVideo((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIdx, 1);
      updated.splice(toIdx, 0, moved);
      return updated;
    });
  };

  const handleRename = (i) => {
    setRenamingIndex(i);
    setRenameText(videos[i].fileName);
  };

  const applyRename = () => {
    addVideo((prev) => {
      const updated = [...prev];
      updated[renamingIndex].fileName = renameText;
      return updated;
    });
    setRenamingIndex(null);
  };

  const deleteVideo = (index) => {
    addVideo((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    if (currentVideoIndex >= index && currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      dispatch(setIsPlaying(true));
    } else {
      video.pause();
      dispatch(setIsPlaying(false));
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      dispatch(setIsPlaying(false));
    }
  }, [videoSrc]);

  const changeSpeed = (rate) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const skip = (seconds) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime += seconds;
  };
  

  const handleUpdateTime = ()  => {
    const video = videoRef.current;
    if (!video) return;
    dispatch(setCurrentTime(video.currentTime));
  };


  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    dispatch(setDuration(videoRef.current.duration));
  };

  useEffect(() => {
    let hideControlsTimeout;
    const container = containerRef.current;

    const show = () => {
      setShowControls(true);
      clearTimeout(hideControlsTimeout);
      hideControlsTimeout = setTimeout(() => setShowControls(false), 2500);
    };

    container.addEventListener("mousemove", show);
    container.addEventListener("mouseleave", () => setShowControls(false));

    show();

    return () => {
      container.removeEventListener("mousemove", show);
      container.removeEventListener("mouseleave", () => setShowControls(false));
      clearTimeout(hideControlsTimeout);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative text-white rounded overflow-hidden"
    >
      {/* Playlist (top right) */}
      {videos.length > 0 && (
        <div className="absolute top-2 left-2 bg-gray-900/80 p-2 rounded text-sm z-10">
          <label className="block mb-1 text-gray-300 font-semibold">
            {/* Video Playlist {currentVideoIndex + 1}/{videos.length} */}
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={handleUpload}
            className="mb-2 text-xs"
          />
          <ul>
            {videos.map((v, i) => (
              <li
                key={i}
                className={`flex items-center justify-between px-2 py-1 mb-1 rounded cursor-pointer ${i === currentVideoIndex
                  ? "bg-gray-700"
                  : "bg-dark hover:bg-gray-600"
                  }`}
                onClick={() => setCurrentVideoIndex(i)}
              >
                {renamingIndex === i ? (
                  <input
                    type="text"
                    value={renameText}
                    onChange={(e) => setRenameText(e.target.value)}
                    onBlur={applyRename}
                    onKeyDown={(e) => e.key === "Enter" && applyRename()}
                    className="text-black text-xs px-1 py-0.5 rounded"
                    autoFocus
                  />
                ) : (
                  <span
                    className="truncate max-w-[100px]"
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      handleRename(i);
                    }}
                  >
                    {v.fileName}
                  </span>
                )}
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (i > 0) moveVideo(i, i - 1);
                    }}
                    className="text-xs"
                  >
                    ⬆️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (i < videos.length - 1) moveVideo(i, i + 1);
                    }}
                    className="text-xs"
                  >
                    ⬇️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteVideo(i);
                    }}
                    className="text-xs text-red-500"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Upload if empty */}
      {videos.length === 0 && (
        <div className="border border-dashed border-gray-500 p-8 text-center">
          <input type="file" accept="video/*" onChange={handleUpload} />
        </div>
      )}

      {/* Video Player */}
      {videoSrc && (
        <div className="relative">
          <video
            ref={videoRef}
            src={videoSrc}
            onTimeUpdate={handleUpdateTime}
            onLoadedMetadata={handleLoadedMetadata}
            className="w-full h-auto"
            controls={false}
          />

          {/* Overlay Controls */}
          {showControls && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-[28px] px-[56px] py-[16px] bg-[#2D2D2DE5] transition-opacity rounded-[28px]">
              <div
                onClick={() => skip(-10)}
                className="w-[28px] h-[28px] cursor-pointer hover:scale-110"
              >
                <img
                  src={tenBackward}
                  alt="10 seconds backward"
                  className="w-full h-full"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div
                onClick={() => skip(-5)}
                className="w-[28px] h-[28px] cursor-pointer hover:scale-110"
              >
                <img
                  src={fiveBackward}
                  alt="5 seconds backward"
                  className="w-full h-full"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div
                onClick={togglePlay}
                className="w-[28px] h-[28px] cursor-pointer hover:scale-110"
              >
                <img src={isPlaying ? pause : play} alt="play" />
              </div>
              <div
                onClick={() => skip(5)}
                className="w-[28px] h-[28px] cursor-pointer hover:scale-110"
              >
                <img
                  src={fiveForward}
                  alt="5 seconds forward"
                  className="w-full h-full"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div
                onClick={() => skip(10)}
                className="w-[28px] h-[28px] cursor-pointer hover:scale-110"
              >
                <img
                  src={tenForward}
                  alt="10 seconds forward"
                  className="w-full h-full"
                  style={{ objectFit: "contain" }}
                />
              </div>

              <select
                value={playbackRate}
                onChange={(e) => changeSpeed(parseFloat(e.target.value))}
                className="ml-auto bg-transparent text-white px-2 py-1 rounded hover:scale-110"
              >
                <option className="text-dark" value={0.5}>
                  0.5x
                </option>
                <option className="text-dark" value={1}>
                  1x
                </option>
                <option className="text-dark" value={1.5}>
                  1.5x
                </option>
                <option className="text-dark" value={2}>
                  2x
                </option>
              </select>
            </div>
          )}

          {/* Time Display */}
          <div className="absolute bottom-0 right-4 text-xs text-gray-300">
            {new Date(currentTime * 1000).toISOString().substr(14, 5)} /{" "}
            {new Date(duration * 1000).toISOString().substr(14, 5)}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayerArea;

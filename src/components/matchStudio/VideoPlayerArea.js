import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addVideo,
  setCurrentVideoIndex,
  moveVideo,
  renameVideo,
  deleteVideo,
  setCurrentTime,
  setIsPlaying,
  setDuration,
} from "../../store/videoSlide";

import fiveBackward from "../../assets/video-player/5-seconds-backward.png";
import tenBackward from "../../assets/video-player/10-seconds-backward.png";
import fiveForward from "../../assets/video-player/5-seconds-forward.png";
import tenForward from "../../assets/video-player/10-seconds-forward.png";
import play from "../../assets/video-player/play.png";
import pause from "../../assets/video-player/pause.png";

const VideoPlayerArea = () => {
  const videos = useSelector((state) => state.video.videos);
  const currentVideoIndex = useSelector(
    (state) => state.video.currentVideoIndex
  );
  const currentTime = useSelector((state) => state.video.currentTime);
  const duration = useSelector((state) => state.video.duration);
  const isPlaying = useSelector((state) => state.video.isPlaying);

  const containerRef = useRef(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [renamingIndex, setRenamingIndex] = useState(null);
  const [renameText, setRenameText] = useState("");
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const videoRef = useRef(null);
  const videoSrc = videos[currentVideoIndex]?.src;

  const dispatch = useDispatch();
  useEffect(() => {
    // console.log(currentVideoIndex);
  });

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      dispatch(addVideo({ src: url, name: file.name }));
    }
  };

  const handleMoveVideo = (fromIdx, toIdx) => {
    dispatch(moveVideo({ fromIdx, toIdx }));
  };

  const handleRename = (i) => {
    setRenamingIndex(i);
    setRenameText(videos[i].name);
  };

  const applyRename = () => {
    dispatch(renameVideo({ id: renamingIndex, name: renameText }));
    setRenamingIndex(null);
  };

  const handleDeleteVideo = (index) => {
    dispatch(deleteVideo(index));
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

  const handleUpdateTime = () => {
    const video = videoRef.current;
    if (!video) return;
    dispatch(setCurrentTime(video.currentTime));
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    dispatch(setDuration(videoRef.current.duration));
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const seekTime = parseFloat(e.target.value);
    if (video) video.currentTime = seekTime;
    dispatch(setCurrentTime(video.currentTime));
  };

  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100 * -1; // Invert for natural movement
    const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100 * -1;

    // Calculate new position with boundaries
    const newX = Math.max(0, Math.min(100, zoomPosition.x + deltaX));
    const newY = Math.max(0, Math.min(100, zoomPosition.y + deltaY));

    setZoomPosition({ x: newX, y: newY });
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    let hideControlsTimeout;
    const container = containerRef.current;

    const show = () => {
      setShowControls(true);
      clearTimeout(hideControlsTimeout);
      hideControlsTimeout = setTimeout(() => setShowControls(false), 2500);
    };

    container?.addEventListener("mousemove", show);
    container?.addEventListener("mouseleave", () => setShowControls(false));

    show();

    return () => {
      container?.removeEventListener("mousemove", show);
      container?.removeEventListener("mouseleave", () =>
        setShowControls(false)
      );
      clearTimeout(hideControlsTimeout);
    };
  }, [videos]);

  return (
    <div ref={containerRef} className="relative h-full overflow-hidden">
      {/* Playlist (top left) */}
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
            {videos.map((video, i) => (
              <li
                key={i}
                className={`flex items-center text-white justify-between px-2 py-1 mb-1 rounded cursor-pointer ${
                  i === currentVideoIndex
                    ? "bg-gray-700"
                    : "bg-dark hover:bg-gray-600"
                }`}
                onClick={() => dispatch(setCurrentVideoIndex(i))}
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
                    {video.name}
                  </span>
                )}
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveVideo(i, i - 1);
                    }}
                    className="text-xs"
                  >
                    ⬆️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveVideo(i, i + 1);
                    }}
                    className="text-xs"
                  >
                    ⬇️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteVideo(i);
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

      {/* Zoom (top right) */}
      {videos.length > 0 && (
        <div className="absolute top-2 right-2 z-10 bg-gray-900/80 bg-opacity-70 px-2 py-1 rounded shadow flex flex-col items-center">
          <input
            type="range"
            min="1"
            max="3"
            step="0.25"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
          />
          <span className="text-white text-bold text-[20px]">
            {Math.round(scale * 100)}%
          </span>
        </div>
      )}

      {/* Upload if empty */}
      {videos.length === 0 && (
        <div className="border border-dashed border-gray-500 h-full flex items-center justify-center">
          <input
            type="file"
            accept="video/*"
            onChange={handleUpload}
            className="block text-sm text-slate-500
             file:mr-4 file:py-2 file:px-4
             file:rounded-full file:border-0
             file:text-sm file:font-semibold
             file:bg-violet-50 file:text-violet-700
             hover:file:bg-violet-100 cursor-pointer"
          />
        </div>
      )}

      {/* Video Player */}
      {videoSrc && (
        <div className="relative h-full">
          <video
            ref={videoRef}
            src={videoSrc}
            onTimeUpdate={handleUpdateTime}
            onLoadedMetadata={handleLoadedMetadata}
            className="absolute object-contain w-full h-full"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              transition: isDragging ? "none" : "transform 0.2s ease",
              cursor:
                scale > 1 ? (isDragging ? "grabbing" : "grab") : "pointer",
              width: "100%",
              height: "100%",
              objectFit: "contain",
              userSelect: "none",
            }}
            controls={false}
          />

          {/* Overlay Controls */}
          {showControls && (
            <div>
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-[28px] px-[56px] py-[16px] bg-[#2D2D2DE5] transition-opacity rounded-[28px]">
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
              <div className="absolute bottom-0 left-0 w-full px-2 z-10">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full appearance-none bg-transparent h-[6px] hover:h-[10px] transition-all duration-200 cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-[#1EB8FF]
                    [&::-moz-range-thumb]:appearance-none
                    [&::-moz-range-thumb]:w-3
                    [&::-moz-range-thumb]:h-3
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-white
                    bg-white/30 rounded-full"
                />
              </div>
            </div>
          )}

          {/* Time Display */}
          <div className="absolute bottom-4 right-4 text-xs text-gray-300">
            {new Date(currentTime * 1000).toISOString().substr(14, 5)} /{" "}
            {new Date(duration * 1000).toISOString().substr(14, 5)}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayerArea;

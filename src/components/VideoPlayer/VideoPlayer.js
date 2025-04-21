import React, { useRef, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { setVideoFile, setCurrentTime, setDuration, setIsPaused } from '../../store/slices/videoSlice';
import './VideoPlayer.css';
import { formatTime } from '../../utils/eventManager';

const VideoPlayer = () => {
  const dispatch = useDispatch();
  const videoFile = useSelector(state => state.video.videoFile);
  const currentTime = useSelector(state => state.video.currentTime);
  const videoDuration = useSelector(state => state.video.duration);
  const isPaused = useSelector(state => state.video.isPaused);
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 }); // Default center (in %)
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const loadVideoSource = (source) => {
    dispatch(setVideoFile(source));
    dispatch(setCurrentTime(0));
    dispatch(setDuration(0));
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      loadVideoSource(URL.createObjectURL(file));
    }
  };

  // Handle offload video
  const handleOffloadVideo = () => {
    if (videoRef.current) videoRef.current.pause();
    dispatch(setVideoFile(null));
    dispatch(setCurrentTime(0));
    dispatch(setDuration(0));
    dispatch(setIsPaused(true));
  };

  // Handle time update
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      dispatch(setCurrentTime(video.currentTime));
    }
  };

  // Handle video loaded metadata
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      const newDuration = video.duration;
      dispatch(setDuration(newDuration));
    }
  };

  // Handle play/pause
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
        dispatch(setIsPaused(false));
      } else {
        video.pause();
        dispatch(setIsPaused(true));
      }
    }
  };

  // Handle seeking
  const handleSeek = (e) => {
    const video = videoRef.current;
    const seekTime = parseFloat(e.target.value);
    if (video) {
      video.currentTime = seekTime;
      dispatch(setCurrentTime(seekTime));
    }
  };

  // Update video playback state based on isPaused state
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (isPaused && !video.paused) {
        video.pause();
      } else if (!isPaused && video.paused && videoFile) {
        video.play();
      }
    }
  }, [isPaused, videoFile]);

  // Sync video time with currentTime state (from timeline markers or Redux)
  useEffect(() => {
    const video = videoRef.current;
    if (video && Math.abs(video.currentTime - currentTime) > 0.5) {
      video.currentTime = currentTime;
    }
  }, [currentTime]);

  // Jump forward 5 seconds
  const jumpForward = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.min(video.currentTime + 5, video.duration);
    }
  };

  // Jump backward 5 seconds
  const jumpBackward = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.max(video.currentTime - 5, 0);
    }
  };


  // Handle mouse down for drag start
  const handleMouseDown = (e) => {
    if (zoomLevel <= 1) return; // Only enable dragging when zoomed in
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.preventDefault(); // Prevent text selection during drag
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e) => {
    if (!isDragging || !videoContainerRef.current) return;
    
    const rect = videoContainerRef.current.getBoundingClientRect();
    const deltaX = (e.clientX - dragStart.x) / rect.width * 100 * -1; // Invert for natural movement
    const deltaY = (e.clientY - dragStart.y) / rect.height * 100 * -1;
    
    // Calculate new position with boundaries
    const newX = Math.max(0, Math.min(100, zoomPosition.x + deltaX));
    const newY = Math.max(0, Math.min(100, zoomPosition.y + deltaY));
    
    setZoomPosition({ x: newX, y: newY });
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle mouse leave to end dragging
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Handle double click for quick zoom toggle
  const handleDoubleClick = (e) => {
    if (!videoContainerRef.current) return;
    
    if (zoomLevel > 1) {
      // Reset zoom
      setZoomLevel(1);
      setZoomPosition({ x: 50, y: 50 });
    } else {
      // Zoom in at click position
      const rect = videoContainerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomLevel(1.75);
      setZoomPosition({ x, y });
    }
  };

  // Handle playback speed change
  const handlePlaybackRateChange = (rate) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  // Reset zoom and playback rate when video changes
  useEffect(() => {
    setZoomLevel(1);
    setZoomPosition({ x: 50, y: 50 });
    setPlaybackRate(1);
    if (videoRef.current) {
      videoRef.current.playbackRate = 1;
    }
  }, [videoFile]);

  return (
    <div className="video-player-container">
      <div className="video-upload">
        {!videoFile && (
          <>
            <Form.Group controlId="videoUpload">
              <Form.Label>Upload Basketball Game Video</Form.Label>
              <Form.Control 
                type="file" 
                accept="video/*" 
                onChange={handleFileSelect} 
              />
            </Form.Group>
          </>
        )}
      </div>
      
      {videoFile && (

        <div 
          className="video-container" 
          ref={videoContainerRef}
          style={{ 
            overflow: 'hidden', 
            position: 'relative',
            width: '100%',
            height: '100%'
          }}
        >
          <Button variant="danger" onClick={handleOffloadVideo} className="ms-2">
            <i className="bi bi-x-lg" />
          </Button>
          <div style={{ 
            width: '100%', 
            height: '100%', 
            overflow: 'hidden',
            position: 'relative'
          }}>
            
            <video
              ref={videoRef}
              src={videoFile}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="video-element"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onDoubleClick={handleDoubleClick}
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                transition: isDragging ? 'none' : 'transform 0.2s ease',
                cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                userSelect: 'none'
              }}
            />
          </div>
          
          <div className="video-controls">
            <Button variant="secondary" onClick={jumpBackward}>-5s</Button>
            <Button variant="primary" onClick={togglePlayPause}>
              {isPaused ? 'Play' : 'Pause'}
            </Button>
            <Button variant="secondary" onClick={jumpForward}>+5s</Button>
   
            
            <div className="ms-2">
              <Form.Select 
                size="sm" 
                value={playbackRate}
                onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                style={{ width: '80px' }}
              >
                <option value="0.25">0.25x</option>
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1">1x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </Form.Select>
            </div>
            <div className="time-display">
              {formatTime(currentTime)} / {formatTime(videoDuration)}
            </div>
            <div className="ms-2 d-flex align-items-center">
              <Form.Range
                min={1}
                max={3}
                step={0.25}
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                className="zoom-slider"
              />
              <span className="mx-1">{Math.round(zoomLevel * 100)}%</span>
            </div>
            <Form.Range
              min={0}
              max={videoDuration}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="seek-bar"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;

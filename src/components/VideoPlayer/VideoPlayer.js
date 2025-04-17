import React, { useRef, useEffect } from 'react';
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

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(setVideoFile(URL.createObjectURL(file)));
      dispatch(setCurrentTime(0));
      dispatch(setDuration(0));
    }
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

  return (
    <div className="video-player-container">
      <div className="video-upload">
        {!videoFile && (
          <Form.Group controlId="videoUpload">
            <Form.Label>Upload Basketball Game Video</Form.Label>
            <Form.Control 
              type="file" 
              accept="video/*" 
              onChange={handleFileSelect} 
            />
          </Form.Group>
        )}
      </div>
      
      {videoFile && (
        <div className="video-container">
          <video
            ref={videoRef}
            src={videoFile}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            className="video-element"
          />
          
          <div className="video-controls">
            <Button variant="secondary" onClick={jumpBackward}>-5s</Button>
            <Button variant="primary" onClick={togglePlayPause}>
              {isPaused ? 'Play' : 'Pause'}
            </Button>
            <Button variant="secondary" onClick={jumpForward}>+5s</Button>
            
            <div className="time-display">
              {formatTime(currentTime)} / {formatTime(videoDuration)}
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

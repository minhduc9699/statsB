import React, { useState, useRef, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import './VideoPlayer.css';
import { formatTime } from '../../utils/eventManager';

const VideoPlayer = ({ 
  onTimeUpdate, 
  onTagEvent, 
  isPaused, 
  setIsPaused, 
  currentTime: externalCurrentTime,
  onDurationChange 
}) => {
  const [videoFile, setVideoFile] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(URL.createObjectURL(file));
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      setCurrentTime(video.currentTime);
      onTimeUpdate(video.currentTime);
    }
  };

  // Handle video loaded metadata
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      const newDuration = video.duration;
      setDuration(newDuration);
      // Notify parent component about duration change
      if (onDurationChange) {
        onDurationChange(newDuration);
      }
    }
  };

  // Handle play/pause
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
        setIsPaused(false);
      } else {
        video.pause();
        setIsPaused(true);
      }
    }
  };

  // Handle seeking
  const handleSeek = (e) => {
    const video = videoRef.current;
    const seekTime = parseFloat(e.target.value);
    if (video) {
      video.currentTime = seekTime;
      setCurrentTime(seekTime);
      onTimeUpdate(seekTime);
    }
  };

  // Update video playback state based on isPaused prop
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

  // Sync video time with external currentTime (from timeline markers)
  useEffect(() => {
    const video = videoRef.current;
    if (video && Math.abs(video.currentTime - externalCurrentTime) > 0.5) {
      video.currentTime = externalCurrentTime;
      setCurrentTime(externalCurrentTime);
    }
  }, [externalCurrentTime]);

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
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            
            <Form.Range
              min={0}
              max={duration}
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

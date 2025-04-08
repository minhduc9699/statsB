import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';
import { formatTime } from '../../utils/eventManager';
import './Timeline.css';

const Timeline = ({ events, videoDuration, onMarkerClick, currentTime }) => {
  const [eventTracks, setEventTracks] = useState([]);
  
  // Calculate effective duration and normalize event positions
  useEffect(() => {
    const effectiveDuration = Math.max(videoDuration, 1);
    
    // Process events to ensure they have valid time values
    const processed = events.map(event => {
      // Check if the event has time or timestamp property
      const eventTime = typeof event.time !== 'undefined' ? event.time : 
                       (typeof event.timestamp !== 'undefined' ? event.timestamp : 0);
      
      return {
        ...event,
        // Ensure we have a consistent time property
        time: eventTime,
        // Normalize time to be within video duration
        normalizedTime: Math.min(Math.max(parseFloat(eventTime) || 0, 0), effectiveDuration)
      };
    });
    
    // Distribute events across tracks to avoid overlap
    const tracks = distributeEventsToTracks(processed, effectiveDuration);
    setEventTracks(tracks);
  }, [events, videoDuration]);
  
  // Function to distribute events across multiple tracks to avoid overlap
  const distributeEventsToTracks = (events, duration) => {
    if (!events.length) return [];
    
    // Sort events by time
    const sortedEvents = [...events].sort((a, b) => a.normalizedTime - b.normalizedTime);
    
    // Initialize with one empty track
    const tracks = [[]];
    
    // Define the minimum distance between events (in percentage of total duration)
    const minDistance = 0.02; // 2% of the total duration
    
    // For each event, find a track where it doesn't overlap with existing events
    sortedEvents.forEach(event => {
      const eventPosition = event.normalizedTime / duration;
      
      let trackIndex = 0;
      let foundTrack = false;
      
      // Check each track for a suitable position
      while (trackIndex < tracks.length && !foundTrack) {
        const trackEvents = tracks[trackIndex];
        let canAddToTrack = true;
        
        // Check if the event overlaps with any existing event in the current track
        for (const existingEvent of trackEvents) {
          const existingPosition = existingEvent.normalizedTime / duration;
          const distance = Math.abs(existingPosition - eventPosition);
          
          if (distance < minDistance) {
            canAddToTrack = false;
            break;
          }
        }
        
        if (canAddToTrack) {
          tracks[trackIndex].push(event);
          foundTrack = true;
        } else {
          trackIndex++;
          
          // If we've checked all tracks and none are suitable, create a new track
          if (trackIndex === tracks.length) {
            tracks.push([]);
          }
        }
      }
    });
    
    return tracks;
  };
  
  // Get event icon based on type
  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'shot':
        return 'bi-bullseye';
      case 'free-throw':
        return 'bi-record-circle';
      case 'rebound':
        return 'bi-arrow-down-circle';
      case 'steal':
        return 'bi-lightning';
      case 'block':
        return 'bi-shield';
      case 'turnover':
        return 'bi-x-circle';
      default:
        return 'bi-circle';
    }
  };
  
  // Group events by type for color coding
  const getEventColor = (eventType) => {
    switch (eventType) {
      case 'shot':
        return '#28a745'; // green
      case 'free-throw':
        return '#17a2b8'; // teal
      case 'rebound':
        return '#ffc107'; // yellow
      case 'steal':
        return '#fd7e14'; // orange
      case 'block':
        return '#dc3545'; // red
      case 'turnover':
        return '#6c757d'; // gray
      default:
        return '#007bff'; // blue
    }
  };

  // Get event shape class based on type and outcome
  const getEventShapeClass = (event) => {
    const baseClass = 'timeline-marker';
    
    // Add shape class based on event type
    if (event.eventType === 'shot' || event.eventType === 'free-throw') {
      const outcome = event.details?.outcome || 'missed';
      return `${baseClass} ${outcome === 'made' ? 'marker-success' : 'marker-missed'}`;
    }
    
    if (event.eventType === 'rebound') {
      const reboundType = event.details?.reboundType || 'defensive';
      return `${baseClass} ${reboundType === 'offensive' ? 'marker-offensive' : 'marker-defensive'}`;
    }
    
    if (event.eventType === 'turnover') {
      return `${baseClass} marker-negative`;
    }
    
    if (event.eventType === 'block' || event.eventType === 'steal') {
      return `${baseClass} marker-defensive-play`;
    }
    
    return baseClass;
  };

  // Calculate minimum video duration to prevent division by zero
  const effectiveVideoDuration = Math.max(videoDuration, 1);

  return (
    <div className="timeline-container">
      {/* Render a timeline track for each track of events */}
      <div className="timeline-tracks-container">
        {eventTracks.map((track, trackIndex) => (
          <div key={`track-${trackIndex}`} className="timeline-track">
            {/* Event markers for this track */}
            {track.map((event) => (
              <OverlayTrigger
                key={event.id}
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-${event.id}`} className="event-tooltip">
                    <div>
                      <Badge bg="secondary" className="me-1">{formatTime(event.time)}</Badge>
                      <strong>{event.playerName || `Player ${event.playerId}`}</strong>
                    </div>
                    <div className="mt-1">
                      <Badge 
                        bg={event.eventType === 'shot' && event.details?.outcome === 'made' ? 'success' : 
                           (event.eventType === 'shot' && event.details?.outcome === 'missed' ? 'danger' : 'primary')}
                      >
                        {event.eventType}
                      </Badge>
                      {event.details?.shotType && ` (${event.details.shotType})`}
                      {event.details?.reboundType && ` (${event.details.reboundType})`}
                    </div>
                  </Tooltip>
                }
              >
                <div
                  className={getEventShapeClass(event)}
                  style={{
                    left: `${(event.normalizedTime / effectiveVideoDuration) * 100}%`,
                    backgroundColor: getEventColor(event.eventType)
                  }}
                  onClick={() => onMarkerClick(event)}
                >
                  <i className={`bi ${getEventIcon(event.eventType)}`}></i>
                  {event.eventType === 'shot' && event.details?.outcome === 'made' && 
                    (event.details?.shotType === '3-point' ? <span className="marker-points">3</span> : <span className="marker-points">2</span>)}
                  {event.eventType === 'free-throw' && event.details?.outcome === 'made' && <span className="marker-points">1</span>}
                </div>
              </OverlayTrigger>
            ))}
          </div>
        ))}
        
        {/* Current time indicator - shown on the first track or a separate ruler track */}
        <div className="timeline-ruler-track">
          <div 
            className="timeline-current-time" 
            style={{ left: `${(currentTime / effectiveVideoDuration) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Time labels */}
      <div className="timeline-labels">
        <span>0:00</span>
        <span>{formatTime(effectiveVideoDuration / 4)}</span>
        <span>{formatTime(effectiveVideoDuration / 2)}</span>
        <span>{formatTime(effectiveVideoDuration * 3 / 4)}</span>
        <span>{formatTime(effectiveVideoDuration)}</span>
      </div>
      
      {/* Event type legend */}
      <div className="timeline-legend">
        <div className="legend-title">Event Types:</div>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-marker" style={{ backgroundColor: getEventColor('shot') }}>
              <i className={`bi ${getEventIcon('shot')}`}></i>
            </div>
            <span>Shot</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker" style={{ backgroundColor: getEventColor('free-throw') }}>
              <i className={`bi ${getEventIcon('free-throw')}`}></i>
            </div>
            <span>Free Throw</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker" style={{ backgroundColor: getEventColor('rebound') }}>
              <i className={`bi ${getEventIcon('rebound')}`}></i>
            </div>
            <span>Rebound</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker" style={{ backgroundColor: getEventColor('steal') }}>
              <i className={`bi ${getEventIcon('steal')}`}></i>
            </div>
            <span>Steal</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker" style={{ backgroundColor: getEventColor('block') }}>
              <i className={`bi ${getEventIcon('block')}`}></i>
            </div>
            <span>Block</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker" style={{ backgroundColor: getEventColor('turnover') }}>
              <i className={`bi ${getEventIcon('turnover')}`}></i>
            </div>
            <span>Turnover</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;

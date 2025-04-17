import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectEvent } from '../../store/slices/eventsSlice';
import { EVENT_TYPE_SHOT, EVENT_TYPE_FREE_THROW, EVENT_TYPE_REBOUND, EVENT_TYPE_STEAL, EVENT_TYPE_BLOCK, EVENT_TYPE_TURNOVER } from '../../constants/eventTypes';
import { OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';
import { formatTime } from '../../utils/eventManager';
import './Timeline.css';

const Timeline = () => {
  const dispatch = useDispatch();
  const videoDuration = useSelector(state => state.video.duration);
  const currentTime = useSelector(state => state.video.currentTime);
  const events = useSelector(state => state.events.list);
  const players = useSelector(state => state.players.list);
  const [eventTracks, setEventTracks] = useState([]);
  
  // Calculate effective duration and normalize event positions
  useEffect(() => {
    const effectiveDuration = Math.max(videoDuration, 1);
    
    // Process events to ensure they have valid time values
    const processed = events.map(event => {
      // Use timestamp as the standard time property
      const eventTime = typeof event.timestamp !== 'undefined' ? event.timestamp : 0;
      
      return {
        ...event,
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
      case EVENT_TYPE_SHOT:
        return 'bi-bullseye';
      case EVENT_TYPE_FREE_THROW:
        return 'bi-record-circle';
      case EVENT_TYPE_REBOUND:
        return 'bi-arrow-down-circle';
      case EVENT_TYPE_STEAL:
        return 'bi-lightning';
      case EVENT_TYPE_BLOCK:
        return 'bi-shield';
      case EVENT_TYPE_TURNOVER:
        return 'bi-x-circle';
      default:
        return 'bi-circle';
    }
  };
  
  // Group events by type for color coding
  const getEventColor = (eventType) => {
    switch (eventType) {
      case EVENT_TYPE_SHOT:
        return '#28a745'; // green
      case EVENT_TYPE_FREE_THROW:
        return '#17a2b8'; // teal
      case EVENT_TYPE_REBOUND:
        return '#ffc107'; // yellow
      case EVENT_TYPE_STEAL:
        return '#fd7e14'; // orange
      case EVENT_TYPE_BLOCK:
        return '#dc3545'; // red
      case EVENT_TYPE_TURNOVER:
        return '#6c757d'; // gray
      default:
        return '#007bff'; // blue
    }
  };

  // Get event shape class based on type and outcome
  const getEventShapeClass = (event) => {
    const baseClass = 'timeline-marker';
    
    // Add shape class based on event type
    if (event.type === EVENT_TYPE_SHOT || event.type === EVENT_TYPE_FREE_THROW) {
      const outcome = event.details?.outcome || 'missed';
      return `${baseClass} ${outcome === 'made' ? 'marker-success' : 'marker-missed'}`;
    }
    
    if (event.type === EVENT_TYPE_REBOUND) {
      const reboundType = event.details?.reboundType || 'defensive';
      return `${baseClass} ${reboundType === 'offensive' ? 'marker-offensive' : 'marker-defensive'}`;
    }
    
    if (event.type === EVENT_TYPE_TURNOVER) {
      return `${baseClass} marker-negative`;
    }
    
    if (event.type === EVENT_TYPE_BLOCK || event.type === EVENT_TYPE_STEAL) {
      return `${baseClass} marker-positive`;
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
                      <Badge bg="secondary" className="me-1">{formatTime(event.timestamp)}</Badge>
                      <strong>{players.find(p => p.id === event.playerId)?.name || `Player ${event.playerId}`}</strong>
                    </div>
                    <div className="mt-1">
                      <Badge 
                        bg={event.type === EVENT_TYPE_SHOT && event.details?.outcome === 'made' ? 'success' : 
                           (event.type === EVENT_TYPE_SHOT && event.details?.outcome === 'missed' ? 'danger' : 
                            (event.type === EVENT_TYPE_FREE_THROW && event.details?.outcome === 'made' ? 'success' : 
                             (event.type === EVENT_TYPE_FREE_THROW && event.details?.outcome === 'missed' ? 'danger' : 'primary')))}
                        className="me-1"
                      >
                        {event.type}
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
                    backgroundColor: getEventColor(event.type)
                  }}
                  onClick={() => dispatch(selectEvent(event.id))}
                >
                  <i className={`bi ${getEventIcon(event.type)}`}></i>
                  {event.type === EVENT_TYPE_SHOT && event.details?.outcome === 'made' && 
                    (event.details?.shotType === '3-point' ? <span className="marker-points">3</span> : <span className="marker-points">2</span>)}
                  {event.type === EVENT_TYPE_FREE_THROW && event.details?.outcome === 'made' && <span className="marker-points">1</span>}
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
            <div className="legend-marker" style={{ backgroundColor: getEventColor(EVENT_TYPE_SHOT) }}>
              <i className={`bi ${getEventIcon(EVENT_TYPE_SHOT)}`}></i>
            </div>
            <span>Shot</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker" style={{ backgroundColor: getEventColor(EVENT_TYPE_FREE_THROW) }}>
              <i className={`bi ${getEventIcon(EVENT_TYPE_FREE_THROW)}`}></i>
            </div>
            <span>Free Throw</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker" style={{ backgroundColor: getEventColor(EVENT_TYPE_REBOUND) }}>
              <i className={`bi ${getEventIcon(EVENT_TYPE_REBOUND)}`}></i>
            </div>
            <span>Rebound</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker" style={{ backgroundColor: getEventColor(EVENT_TYPE_STEAL) }}>
              <i className={`bi ${getEventIcon(EVENT_TYPE_STEAL)}`}></i>
            </div>
            <span>Steal</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker" style={{ backgroundColor: getEventColor(EVENT_TYPE_BLOCK) }}>
              <i className={`bi ${getEventIcon(EVENT_TYPE_BLOCK)}`}></i>
            </div>
            <span>Block</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker" style={{ backgroundColor: getEventColor(EVENT_TYPE_TURNOVER) }}>
              <i className={`bi ${getEventIcon(EVENT_TYPE_TURNOVER)}`}></i>
            </div>
            <span>Turnover</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;

import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
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
  
  // Group events by type for color coding
  const getEventColor = (eventType) => {
    switch (eventType) {
      case 'shot':
        return '#28a745'; // green
      case 'free-throw':
        return '#17a2b8'; // teal
      case 'rebound':
        return '#ffc107'; // yellow
      case 'assist':
        return '#6f42c1'; // purple
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

  // Get event details for tooltip
  const getEventDetails = (event) => {
    const playerName = event.playerName || `Player ${event.playerId}`;
    let details = `${formatTime(event.time)} - ${playerName}: ${event.eventType}`;
    
    if (!event.details) {
      return details;
    }
    
    switch (event.eventType) {
      case 'shot':
        details += ` (${event.details.shotType}, ${event.details.outcome})`;
        break;
      case 'free-throw':
        details += ` (${event.details.outcome})`;
        break;
      case 'rebound':
        details += ` (${event.details.reboundType})`;
        break;
      case 'assist':
        const assistedName = event.details.assistedPlayerName || `Player ${event.details.assistedPlayer}`;
        details += ` to ${assistedName}`;
        break;
      default:
        break;
    }
    
    return details;
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
                  <Tooltip id={`tooltip-${event.id}`}>
                    {getEventDetails(event)}
                  </Tooltip>
                }
              >
                <div
                  className="timeline-marker"
                  style={{
                    left: `${(event.normalizedTime / effectiveVideoDuration) * 100}%`,
                    backgroundColor: getEventColor(event.eventType)
                  }}
                  onClick={() => onMarkerClick(event)}
                />
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
    </div>
  );
};

export default Timeline;

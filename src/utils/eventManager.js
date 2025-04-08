/**
 * Utility functions for managing basketball game events
 */

// Event type definitions with their keyboard shortcuts
export const EVENT_TYPES = {
  SHOT: { key: 'S', label: 'Shot' },
  FREE_THROW: { key: 'F', label: 'Free Throw' },
  REBOUND: { key: 'R', label: 'Rebound' },
  STEAL: { key: 'T', label: 'Steal' },
  BLOCK: { key: 'B', label: 'Block' },
  TURNOVER: { key: 'O', label: 'Turnover' }
};

// Generate a unique ID for events
export const generateEventId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Format time in MM:SS format
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Convert time string to seconds
export const timeToSeconds = (timeString) => {
  const [minutes, seconds] = timeString.split(':').map(Number);
  return minutes * 60 + seconds;
};

// Create a new event object
export const createEvent = (eventType, playerId, timestamp, details = {}) => {
  return {
    id: generateEventId(),
    eventType,
    playerId,
    timestamp,
    details,
    createdAt: new Date().toISOString()
  };
};

// Add event details based on event type
export const addEventDetails = (event, details) => {
  return {
    ...event,
    details: {
      ...event.details,
      ...details
    }
  };
};

// Get keyboard shortcut for event type
export const getKeyboardShortcut = (eventType) => {
  for (const [type, config] of Object.entries(EVENT_TYPES)) {
    if (type.toLowerCase() === eventType.toLowerCase()) {
      return config.key;
    }
  }
  return null;
};

// Get event type from keyboard key
export const getEventTypeFromKey = (key) => {
  const upperKey = key.toUpperCase();
  for (const [type, config] of Object.entries(EVENT_TYPES)) {
    if (config.key === upperKey) {
      return type.toLowerCase();
    }
  }
  return null;
};

// Sort events by timestamp
export const sortEventsByTimestamp = (events) => {
  return [...events].sort((a, b) => a.timestamp - b.timestamp);
};

// Group events by player
export const groupEventsByPlayer = (events) => {
  return events.reduce((acc, event) => {
    if (!acc[event.playerId]) {
      acc[event.playerId] = [];
    }
    acc[event.playerId].push(event);
    return acc;
  }, {});
};

// Group events by type
export const groupEventsByType = (events) => {
  return events.reduce((acc, event) => {
    if (!acc[event.eventType]) {
      acc[event.eventType] = [];
    }
    acc[event.eventType].push(event);
    return acc;
  }, {});
};

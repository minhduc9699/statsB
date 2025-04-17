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

/**
 * Format time in hh:mm:ss for any duration.
 * Always returns two digits for each unit, e.g., 01:05:09, 00:03:12
 * @param {number} seconds - Number of seconds
 * @returns {string} Time formatted as hh:mm:ss
 * @example
 *   formatTime(3661) // '01:01:01'
 */
export const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return [hrs, mins, secs]
    .map(unit => String(unit).padStart(2, '0'))
    .join(':');
};

/**
 * Convert time string (hh:mm:ss or mm:ss) to seconds
 * @param {string} timeString - Time as 'hh:mm:ss' or 'mm:ss'
 * @returns {number} Total seconds
 * @example
 *   timeToSeconds('01:02:03') // 3723
 *   timeToSeconds('05:12')    // 312
 */
export const timeToSeconds = (timeString) => {
  const parts = timeString.split(':').map(Number);
  if (parts.length === 3) {
    // hh:mm:ss
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // mm:ss
    return parts[0] * 60 + parts[1];
  }
  return 0;
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
    if (!acc[event.type]) {
      acc[event.type] = [];
    }
    acc[event.type].push(event);
    return acc;
  }, {});
};

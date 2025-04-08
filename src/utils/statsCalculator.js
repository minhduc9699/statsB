/**
 * Utility functions for calculating basketball statistics
 */

// Calculate field goal percentage
export const calculateFGPercentage = (made, attempted) => {
  if (attempted === 0) return 0;
  return ((made / attempted) * 100).toFixed(1);
};

// Calculate three-point percentage
export const calculate3PPercentage = (made, attempted) => {
  if (attempted === 0) return 0;
  return ((made / attempted) * 100).toFixed(1);
};

// Calculate free throw percentage
export const calculateFTPercentage = (made, attempted) => {
  if (attempted === 0) return 0;
  return ((made / attempted) * 100).toFixed(1);
};

// Calculate simplified Player Efficiency Rating (PER)
export const calculateSimplePER = (points, rebounds, assists, totalEvents) => {
  if (totalEvents === 0) return 0;
  return ((points + rebounds + assists) / totalEvents).toFixed(2);
};

// Calculate usage rate
export const calculateUsageRate = (playerEvents, totalEvents) => {
  if (totalEvents === 0) return 0;
  return ((playerEvents / totalEvents) * 100).toFixed(1);
};

// Filter events by player
export const filterEventsByPlayer = (events, playerId) => {
  return events.filter(event => event.playerId === playerId);
};

// Filter events by type
export const filterEventsByType = (events, eventType) => {
  return events.filter(event => event.eventType === eventType);
};

// Get player stats from events
export const getPlayerStats = (events, playerId) => {
  events.forEach(event => {
    if (
      event.eventType === 'shot' &&
      event.details &&
      event.details.assistingPlayerId === playerId
    ) {
      stats.assists++;
    }
  });
  const playerEvents = filterEventsByPlayer(events, playerId);
  
  // Initialize stats
  const stats = {
    points: 0,
    fgMade: 0,
    fgAttempted: 0,
    fg3Made: 0,
    fg3Attempted: 0,
    ftMade: 0,
    ftAttempted: 0,
    rebounds: 0,
    offensiveRebounds: 0,
    defensiveRebounds: 0,
    assists: 0,
    steals: 0,
    blocks: 0,
    turnovers: 0,
    totalEvents: playerEvents.length,
  };
  
  // Calculate stats from events
  playerEvents.forEach(event => {
    const details = event.details;
    switch(event.eventType) {
      case 'shot':
        stats.fgAttempted++;
        if (details.outcome === 'made') {
          stats.fgMade++;
          stats.points += details.shotType === '3-point' ? 3 : 2;
        }
        if (details.shotType === '3-point') {
          stats.fg3Attempted++;
          if (details.outcome === 'made') {
            stats.fg3Made++;
          }
        }
        break;
      case 'free-throw':
        stats.ftAttempted++;
        if (details.outcome === 'made') {
          stats.ftMade++;
          stats.points += 1;
        }
        break;
      case 'rebound':
        stats.rebounds++;
        if (details.reboundType === 'offensive') {
          stats.offensiveRebounds++;
        } else {
          stats.defensiveRebounds++;
        }
        break;
      case 'assist':
        stats.assists++;
        break;
      case 'steal':
        stats.steals++;
        break;
      case 'block':
        stats.blocks++;
        break;
      case 'turnover':
        stats.turnovers++;
        break;
      default:
        break;
    }
  });
  
  // Calculate percentages
  stats.fgPercentage = calculateFGPercentage(stats.fgMade, stats.fgAttempted);
  stats.fg3Percentage = calculate3PPercentage(stats.fg3Made, stats.fg3Attempted);
  stats.ftPercentage = calculateFTPercentage(stats.ftMade, stats.ftAttempted);
  
  // Calculate advanced stats
  stats.simplePER = calculateSimplePER(stats.points, stats.rebounds, stats.assists, stats.totalEvents);
  
  return stats;
};

// Get team stats from events
export const getTeamStats = (events) => {
  // Initialize stats
  const stats = {
    points: 0,
    fgMade: 0,
    fgAttempted: 0,
    fg3Made: 0,
    fg3Attempted: 0,
    ftMade: 0,
    ftAttempted: 0,
    rebounds: 0,
    offensiveRebounds: 0,
    defensiveRebounds: 0,
    assists: 0,
    steals: 0,
    blocks: 0,
    turnovers: 0,
    totalEvents: events.length,
  };
  
  // Calculate stats from events
  events.forEach(event => {
    const details = event.details;
    switch(event.eventType) {
      case 'shot':
        stats.fgAttempted++;
        if (details.outcome === 'made') {
          stats.fgMade++;
          stats.points += details.shotType === '3-point' ? 3 : 2;
        }
        if (details.shotType === '3-point') {
          stats.fg3Attempted++;
          if (details.outcome === 'made') {
            stats.fg3Made++;
          }
        }
        if (details.assist) {
          stats.assists++;
        }
        break;
      case 'free-throw':
        stats.ftAttempted++;
        if (details.outcome === 'made') {
          stats.ftMade++;
          stats.points += 1;
        }
        break;
      case 'rebound':
        stats.rebounds++;
        if (details.reboundType === 'offensive') {
          stats.offensiveRebounds++;
        } else {
          stats.defensiveRebounds++;
        }
        break;
      case 'assist':
        stats.assists++;
        break;
      case 'steal':
        stats.steals++;
        break;
      case 'block':
        stats.blocks++;
        break;
      case 'turnover':
        stats.turnovers++;
        break;
      default:
        break;
    }
  });
  
  // Calculate percentages
  stats.fgPercentage = calculateFGPercentage(stats.fgMade, stats.fgAttempted);
  stats.fg3Percentage = calculate3PPercentage(stats.fg3Made, stats.fg3Attempted);
  stats.ftPercentage = calculateFTPercentage(stats.ftMade, stats.ftAttempted);
  
  return stats;
};

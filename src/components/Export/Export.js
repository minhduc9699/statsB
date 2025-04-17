import React from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getPlayerStats, getTeamStats } from '../../utils/statsCalculator';
import { EVENT_TYPE_SHOT, EVENT_TYPE_FREE_THROW, EVENT_TYPE_REBOUND, EVENT_TYPE_ASSIST } from '../../constants/eventTypes';
import './Export.css';

const Export = () => {
  const events = useSelector(state => state.events.list);
  const players = useSelector(state => state.players.list);
  // Export events as JSON
  const exportEventsAsJSON = () => {
    const dataStr = JSON.stringify({ events, players }, null, 2);
    downloadData(dataStr, 'basketball-events.json', 'application/json');
  };

  // Export events as CSV
  const exportEventsAsCSV = () => {
    // CSV header
    let csvContent = 'Timestamp,Time,Player,Event Type,Details\n';
    
    // Sort events by timestamp
    const sortedEvents = [...events].sort((a, b) => a.timestamp - b.timestamp);
    
    // Add each event as a row
    sortedEvents.forEach(event => {
      const player = players.find(p => p.id === event.playerId) || {};
      const playerName = player.name || 'Unknown';
      const playerNumber = player.number || '';
      
      // Format time as MM:SS
      const minutes = Math.floor(event.timestamp / 60);
      const seconds = Math.floor(event.timestamp % 60);
      const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      // Format details based on event type
      let details = '';
      switch(event.type) {
        case EVENT_TYPE_SHOT:
          details = `${event.details.shotType}, ${event.details.outcome}`;
          if (event.details.location) {
            details += `, location: (${event.details.location.x.toFixed(1)}, ${event.details.location.y.toFixed(1)})`;
          }
          break;
        case EVENT_TYPE_FREE_THROW:
          details = event.details.outcome;
          break;
        case EVENT_TYPE_REBOUND:
          details = event.details.reboundType;
          break;
        case EVENT_TYPE_ASSIST:
          const assistedPlayer = players.find(p => p.id === event.details.assistedPlayer) || {};
          details = `to ${assistedPlayer.name || 'Unknown'}`;
          break;
        default:
          break;
      }
      
      // Escape any commas in the details
      details = details.replace(/,/g, ';');
      
      // Add row to CSV
      csvContent += `${event.timestamp},${timeFormatted},${playerNumber} - ${playerName},${event.type},${details}\n`;
    });
    
    downloadData(csvContent, 'basketball-events.csv', 'text/csv');
  };

  // Export stats as CSV
  const exportStatsAsCSV = () => {
    // CSV header
    let csvContent = 'Player,Points,FGM,FGA,FG%,3PM,3PA,3P%,FTM,FTA,FT%,REB,OREB,DREB,AST,STL,BLK,TO,Simple PER\n';
    
    // Add team stats
    const teamStats = getTeamStats(events);
    csvContent += `Team,${teamStats.points},${teamStats.fgMade},${teamStats.fgAttempted},${teamStats.fgPercentage},${teamStats.fg3Made},${teamStats.fg3Attempted},${teamStats.fg3Percentage},${teamStats.ftMade},${teamStats.ftAttempted},${teamStats.ftPercentage},${teamStats.rebounds},${teamStats.offensiveRebounds},${teamStats.defensiveRebounds},${teamStats.assists},${teamStats.steals},${teamStats.blocks},${teamStats.turnovers},N/A\n`;
    
    // Add player stats
    players.forEach(player => {
      const stats = getPlayerStats(events, player.id);
      csvContent += `${player.number} - ${player.name},${stats.points},${stats.fgMade},${stats.fgAttempted},${stats.fgPercentage},${stats.fg3Made},${stats.fg3Attempted},${stats.fg3Percentage},${stats.ftMade},${stats.ftAttempted},${stats.ftPercentage},${stats.rebounds},${stats.offensiveRebounds},${stats.defensiveRebounds},${stats.assists},${stats.steals},${stats.blocks},${stats.turnovers},${stats.simplePER}\n`;
    });
    
    downloadData(csvContent, 'basketball-stats.csv', 'text/csv');
  };

  // Helper function to download data
  const downloadData = (content, fileName, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="export-container">
      <Card>
        <Card.Header>
          <h4>Export Data</h4>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Export Options</Form.Label>
            <div className="export-buttons">
              <Button 
                variant="primary" 
                onClick={exportEventsAsJSON}
                disabled={events.length === 0}
              >
                Export Events as JSON
              </Button>
              <Button 
                variant="primary" 
                onClick={exportEventsAsCSV}
                disabled={events.length === 0}
              >
                Export Events as CSV
              </Button>
              <Button 
                variant="primary" 
                onClick={exportStatsAsCSV}
                disabled={events.length === 0}
              >
                Export Stats as CSV
              </Button>
            </div>
          </Form.Group>
          
          <div className="export-info">
            <p>
              <strong>JSON Export:</strong> Contains all event data including timestamps, player information, and detailed event attributes.
              Useful for backing up your data or importing into other analysis tools.
            </p>
            <p>
              <strong>CSV Export:</strong> Provides a spreadsheet-compatible format of events or statistics.
              Can be opened in Excel, Google Sheets, or other spreadsheet applications.
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Export;

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Table, Tabs, Tab, Form, Row, Col, Button } from 'react-bootstrap';
import { 
  getPlayerStats, 
  getTeamStats, 
  calculateUsageRate 
} from '../../utils/statsCalculator';
import { formatTime } from '../../utils/eventManager';
import ShotChart from './ShotChart';
import { deleteEvent } from '../../store/slices/eventsSlice';
import { EVENT_TYPE_SHOT, EVENT_TYPE_FREE_THROW, EVENT_TYPE_REBOUND, EVENT_TYPE_ASSIST } from '../../constants/eventTypes';
import './Dashboard.css';

const Dashboard = () => {
  const events = useSelector(state => state.events.list);
  const players = useSelector(state => state.players.list);
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedPlayer, setSelectedPlayer] = useState('all');
  const dispatch = useDispatch();
  
  // Filter events by selected player
  const filteredEvents = selectedPlayer === 'all' 
    ? [...events] 
    : [...events.filter(event => event.playerId === selectedPlayer)];
  
  // Get stats based on selected player
  const stats = selectedPlayer === 'all' 
    ? getTeamStats(events) 
    : getPlayerStats(events, selectedPlayer);
  
  // Get shot events for shot chart
  const shotEvents = filteredEvents.filter(event => 
    event.type === EVENT_TYPE_SHOT && event.details?.location
  );
  // Calculate usage rates for all players
  const playerUsageRates = players.map(player => {
    const playerEvents = events.filter(event => event.playerId === player.id);
    return {
      ...player,
      usageRate: calculateUsageRate(playerEvents.length, events.length)
    };
  }).sort((a, b) => b.usageRate - a.usageRate);

  // Format event details based on event type
  const formatEventDetails = (event) => {
    let details = '';
    const eventType = event.type;
    
    switch(eventType) {
      case EVENT_TYPE_SHOT:
        details = `${event.details?.shotType || ''} (${event.details?.outcome || ''})`;
        break;
      case EVENT_TYPE_FREE_THROW:
        details = event.details?.outcome || '';
        break;
      case EVENT_TYPE_REBOUND:
        details = event.details?.reboundType || '';
        break;
      case EVENT_TYPE_ASSIST:
        const assistedPlayer = players.find(p => p.id === event.details?.assistedPlayer) || {};
        details = `to ${assistedPlayer.name || 'Player'}`;
        break;
      default:
        break;
    }
    return details;
  };

  // Handle confirmation before deleting an event
  const handleDeleteClick = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      dispatch(deleteEvent(eventId));
    }
  };

  return (
    <div className="dashboard">
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h4>Stats Dashboard</h4>
            <Form.Select 
              className="player-filter"
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
            >
              <option value="all">All Players</option>
              {players.map(player => (
                <option key={player.id} value={player.id}>
                  {player.number} - {player.name}
                </option>
              ))}
            </Form.Select>
          </div>
        </Card.Header>
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="basic" title="Basic Stats">
              <Row>
                <Col md={6}>
                  <div className="stat-card">
                    <h5>Scoring</h5>
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Stat</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Points</td>
                          <td>{stats.points}</td>
                        </tr>
                        <tr>
                          <td>FG</td>
                          <td>{stats.fgMade}/{stats.fgAttempted} ({stats.fgPercentage}%)</td>
                        </tr>
                        <tr>
                          <td>3PT</td>
                          <td>{stats.fg3Made}/{stats.fg3Attempted} ({stats.fg3Percentage}%)</td>
                        </tr>
                        <tr>
                          <td>FT</td>
                          <td>{stats.ftMade}/{stats.ftAttempted} ({stats.ftPercentage}%)</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="stat-card">
                    <h5>Other Stats</h5>
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Stat</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Rebounds</td>
                          <td>{stats.rebounds} (O: {stats.offensiveRebounds}, D: {stats.defensiveRebounds})</td>
                        </tr>
                        <tr>
                          <td>Assists</td>
                          <td>{stats.assists}</td>
                        </tr>
                        <tr>
                          <td>Steals</td>
                          <td>{stats.steals}</td>
                        </tr>
                        <tr>
                          <td>Blocks</td>
                          <td>{stats.blocks}</td>
                        </tr>
                        <tr>
                          <td>Turnovers</td>
                          <td>{stats.turnovers}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
              
              <Row className="mt-4">
                <Col md={6}>
                  <div className="stat-card">
                    <h5>Advanced Stats</h5>
                    {selectedPlayer !== 'all' && (
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>Metric</th>
                            <th>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Simple PER</td>
                            <td>{stats.simplePER}</td>
                          </tr>
                          <tr>
                            <td>Usage Rate</td>
                            <td>{calculateUsageRate(stats.totalEvents, events.length)}%</td>
                          </tr>
                        </tbody>
                      </Table>
                    )}
                    
                    <h5 className="mt-4">Player Usage Rates</h5>
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Player</th>
                          <th>Usage Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {playerUsageRates.map(player => (
                          <tr key={player.id}>
                            <td>{player.number} - {player.name}</td>
                            <td>{player.usageRate}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="stat-card">
                    <h5>Shot Distribution</h5>
                    <div className="text-center">
                      <ShotChart shotEvents={shotEvents} />
                    </div>
                  </div>
                </Col>
              </Row>
            </Tab>
            
            <Tab eventKey="events" title="Event Log">
              <div className="event-log">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Player</th>
                      <th>Event</th>
                      <th>Details</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.sort((a, b) => a.timestamp - b.timestamp).map(event => {
                      const player = players.find(p => p.id === event.playerId) || {};
                      const details = formatEventDetails(event, player);
                      
                      return (
                        <tr key={event.id}>
                          <td>{formatTime(event.timestamp)}</td>
                          <td>{players.find(p => p.id === event.playerId)?.name || 'Unknown'}</td>
                          <td>{event.type}</td>
                          <td>{details}</td>
                          <td>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDeleteClick(event.id)}
                            >
                              <i className="bi bi-trash"></i> Delete
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;

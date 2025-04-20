import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form, Row, Col, Card, ListGroup, Badge, Toast, ToastContainer } from 'react-bootstrap';
import { EVENT_TYPES, getEventTypeFromKey, formatTime } from '../../utils/eventManager';
import { 
  EVENT_TYPE_SHOT, 
  EVENT_TYPE_REBOUND, 
  EVENT_TYPE_FREE_THROW, 
} from '../../constants/eventTypes';
import { useSelector, useDispatch } from 'react-redux';
import { setIsPaused } from '../../store/slices/videoSlice';
import { addEvent } from '../../store/slices/eventsSlice';
import CourtDiagram from './CourtDiagram';
import GameTypeSelector from '../GameTypeSelector/GameTypeSelector';
import './TaggingInterface.css';

const TaggingInterface = () => {
  const currentTime = useSelector(state => state.video.currentTime);
  const isPaused = useSelector(state => state.video.isPaused);
  const players = useSelector(state => state.players.list);
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [eventType, setEventType] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [shotType, setShotType] = useState('2-point');
  const [shotOutcome, setShotOutcome] = useState('made');
  const [reboundType, setReboundType] = useState('defensive');
  const [assistingPlayer, setAssistingPlayer] = useState('');
  const [shotLocation, setShotLocation] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [lastEventAdded, setLastEventAdded] = useState(null);
  const [gameType, setGameType] = useState('3v3'); // Default to 3v3 half court

  // Handle keyboard shortcuts
  const handleKeyPress = useCallback((e) => {
    if (isPaused) {
      const eventTypeFromKey = getEventTypeFromKey(e.key);
      if (eventTypeFromKey) {
        setEventType(eventTypeFromKey);
        setShowForm(true);
      }
    }
  }, [isPaused]);

  useEffect(() => {
    document.addEventListener('keypress', handleKeyPress);
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Handle game type change
  const handleGameTypeChange = (type) => {
    setGameType(type);
    // Reset shot location when game type changes as court dimensions change
    setShotLocation(null);
  };

  // Handle shot location selection
  const handleLocationSelect = (location) => {
    // Add the current shotOutcome to the location data
    setShotLocation({
      ...location,
      outcome: shotOutcome
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create details object based on event type
    let details = {};
    
    if (eventType === EVENT_TYPE_SHOT) {
      details = {
        shotType,
        outcome: shotOutcome,
        location: shotLocation,
        gameType // Include game type in event details
      };
      
      if (shotOutcome === 'made' && assistingPlayer) {
        details.assist = assistingPlayer;
      }
    } else if (eventType === EVENT_TYPE_REBOUND) {
      details = {
        reboundType,
        gameType // Include game type in event details
      };
    } else if (eventType === EVENT_TYPE_FREE_THROW) {
      details = {
        shotType: '1-point',
        outcome: shotOutcome,
        gameType // Include game type in event details
      };
    } else {
      details = {
        gameType // Include game type in event details
      }
    }
    
    // Create event summary for recent events list
    const eventSummary = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      type: eventType,
      playerId: selectedPlayer,
      timestamp: currentTime,
      details: {
        ...details,
        assist: assistingPlayer
      }
    };
    
    // Add to recent events (keep last 5)
    setRecentEvents(prev => [eventSummary, ...prev].slice(0, 5));
    
    // Set last event for toast
    setLastEventAdded(eventSummary);
    setShowToast(true);
    
    // Call the addEvent function with the expected parameters
    dispatch(addEvent(eventSummary));
    
    // Reset form
    setShowForm(false);
    setEventType('');
    setSelectedPlayer('');
    setShotType('2-point');
    setShotOutcome('made');
    setReboundType('defensive');
    setAssistingPlayer('');
    setShotLocation(null);
  };

  // Handle cancel
  const handleCancel = () => {
    setShowForm(false);
    setEventType('');
    setSelectedPlayer('');
    setShotLocation(null);
  };

  // Format event for display
  const formatEventDisplay = (event) => {
    let display = `${formatTime(event.timestamp)} - ${players.find(p => p.id === event.playerId)?.name || 'Unknown'}: ${event.type}`;
    
    if (event.type === EVENT_TYPE_SHOT || event.type === EVENT_TYPE_FREE_THROW) {
      display += ` (${event.details.shotType}, ${event.details.outcome})`;
      if (event.details.assist) {
        const assistPlayerName = players.find(p => p.id === event.details.assist)?.name || 'Unknown';
        display += ` - Assist: ${assistPlayerName}`;
      }
    } else if (event.type === EVENT_TYPE_REBOUND) {
      display += ` (${event.details.reboundType})`;
    }
    
    return display;
  };

  return (
    <div className="tagging-interface">
      {/* Toast notification for successful event tagging */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          onClose={() => setShowToast(false)} 
          show={showToast} 
          delay={3000} 
          autohide
          bg="success"
          text="white"
        >
          <Toast.Header>
            <strong className="me-auto">Event Tagged</strong>
          </Toast.Header>
          <Toast.Body>
            {lastEventAdded && formatEventDisplay(lastEventAdded)}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Row className="mb-3 align-items-center">
        <Col xs={6}>
          <h5 className="m-0">
            <Badge bg="primary" className="me-2">
              {formatTime(currentTime)}
            </Badge>
            {isPaused ? 'Video Paused' : 'Video Playing'}
          </h5>
        </Col>
        <Col xs={6} className="text-end">
          <Button 
            variant={isPaused ? "success" : "danger"}
            onClick={() => setIsPaused(!isPaused)}
            size="sm"
          >
            <i className={`bi ${isPaused ? "bi-play-fill" : "bi-pause-fill"}`}></i>
            {isPaused ? " Resume" : " Pause"}
          </Button>
        </Col>
      </Row>

      {/* Game Type Selector */}
      <GameTypeSelector 
        selectedType={gameType} 
        onTypeChange={handleGameTypeChange} 
      />

      {isPaused && !showForm ? (
        <Row>
          <Col md={8}>
            <Card className="mb-3">
              <Card.Header className="bg-primary text-white">
                <h5 className="m-0">Tag an Event</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {Object.entries(EVENT_TYPES).map(([type, config]) => (
                    <Button
                      key={type}
                      variant="outline-primary"
                      className="event-button"
                      onClick={() => {
                        setEventType(type.toLowerCase());
                        setShowForm(true);
                      }}
                    >
                      <div className="d-flex flex-column align-items-center">
                        <span>{config.label}</span>
                        <Badge bg="secondary" className="keyboard-badge">
                          {config.key}
                        </Badge>
                      </div>
                    </Button>
                  ))}
                </div>
                <div className="text-center text-muted small">
                  <i className="bi bi-info-circle me-1"></i>
                  Press keyboard shortcut or click button to tag an event
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-3">
              <Card.Header className="bg-secondary text-white">
                <h5 className="m-0">Recent Events</h5>
              </Card.Header>
              <ListGroup variant="flush">
                {recentEvents.length > 0 ? (
                  recentEvents.map((event, index) => (
                    <ListGroup.Item key={index} className="py-2 px-3">
                      <div className="d-flex align-items-center">
                        <Badge 
                          bg={event.type === EVENT_TYPE_SHOT || event.type === EVENT_TYPE_FREE_THROW ? 
                            (event.details.outcome === 'made' ? 'success' : 'danger') : 
                            'primary'} 
                          className="me-2"
                        >
                          {formatTime(event.timestamp)}
                        </Badge>
                        <div className="small">
                          <strong>{players.find(p => p.id === event.playerId)?.name || 'Unknown'}</strong>: {event.type}
                          {(event.type === EVENT_TYPE_SHOT || event.type === EVENT_TYPE_FREE_THROW) && ` (${event.details.shotType}, ${event.details.outcome})`}
                          {event.details.assist && (
                            <span className="text-muted"> • Assist: {players.find(p => p.id === event.details.assist)?.name || 'Unknown'}</span>
                          )}
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item className="text-center text-muted py-3">
                    No events tagged yet
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      ) : null}

      {isPaused && showForm && (
        <Form onSubmit={handleSubmit}>
          <Card>
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="m-0">
                {EVENT_TYPES[eventType.toUpperCase()]?.label || eventType} at {formatTime(currentTime)}
              </h5>
              <Button 
                variant="light" 
                size="sm" 
                onClick={handleCancel}
              >
                <i className="bi bi-x-lg"></i>
              </Button>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>
                      <strong>Player</strong>
                    </Form.Label>
                    <div className="player-chip-row" role="listbox" aria-label="Select Player">
                      {players.map((player) => (
                        <button
                          key={player.id}
                          type="button"
                          className={`player-chip${selectedPlayer === player.id ? ' selected' : ''}`}
                          onClick={() => setSelectedPlayer(player.id)}
                        >
                          <span className="player-jersey">#{player.number}</span>
                          <span className="player-name">{player.name}</span>
                        </button>
                      ))}
                    </div>
                    <div className="text-muted small mt-1" aria-live="polite">
                      {selectedPlayer ? '' : 'Please select a player'}
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              {eventType === EVENT_TYPE_SHOT && (
                <>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          <strong>Shot Type</strong>
                        </Form.Label>
                        <div className="d-flex">
                          <Button
                            variant={shotType === '2-point' ? 'primary' : 'outline-primary'}
                            className="w-100 me-2"
                            onClick={() => setShotType('2-point')}
                            type="button"
                          >
                            2-Point
                          </Button>
                          <Button
                            variant={shotType === '3-point' ? 'primary' : 'outline-primary'}
                            className="w-100"
                            onClick={() => setShotType('3-point')}
                            type="button"
                          >
                            3-Point
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          <strong>Outcome</strong>
                        </Form.Label>
                        <div className="d-flex">
                          <Button
                            variant={shotOutcome === 'made' ? 'success' : 'outline-success'}
                            className="w-100 me-2"
                            onClick={() => {
                              setShotOutcome('made');
                              if (shotLocation) {
                                setShotLocation({
                                  ...shotLocation,
                                  outcome: 'made'
                                });
                              }
                            }}
                            type="button"
                          >
                            Made
                          </Button>
                          <Button
                            variant={shotOutcome === 'missed' ? 'danger' : 'outline-danger'}
                            className="w-100"
                            onClick={() => {
                              setShotOutcome('missed');
                              if (shotLocation) {
                                setShotLocation({
                                  ...shotLocation,
                                  outcome: 'missed'
                                });
                              }
                            }}
                            type="button"
                          >
                            Missed
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  {shotOutcome === 'made' && (
                    <Row className="mb-3">
                      <Col>
                        <Form.Group>
                          <Form.Label>
                            <strong>Assisted By</strong>
                          </Form.Label>
                          <Form.Control 
                            as="select"
                            value={assistingPlayer}
                            onChange={(e) => setAssistingPlayer(e.target.value)}
                            className="form-select"
                          >
                            <option value="">No Assist</option>
                            {players
                              .filter(p => p.id !== selectedPlayer)
                              .map((player) => (
                                <option key={player.id} value={player.id}>
                                  #{player.number} {player.name}
                                </option>
                              ))
                            }
                          </Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                  )}

                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>
                          <strong>Shot Location</strong> <span className="text-muted small">(Click on the court)</span>
                        </Form.Label>
                        <div className="court-container">
                          <CourtDiagram 
                            onLocationSelect={handleLocationSelect} 
                            selectedLocation={shotLocation} 
                            shotType={shotType}
                            shotOutcome={shotOutcome}
                            gameType={gameType}
                          />
                          {!shotLocation && (
                            <div className="court-overlay">
                              <div className="court-instruction">
                                <Badge bg="primary" className="p-2">
                                  <i className="bi bi-cursor-fill me-1"></i>
                                  Click to mark shot location
                                </Badge>
                              </div>
                            </div>
                          )}
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </>
              )}

              {eventType === EVENT_TYPE_FREE_THROW && (
                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>
                        <strong>Free Throw Outcome</strong>
                      </Form.Label>
                      <div className="d-flex">
                        <Button
                          variant={shotOutcome === 'made' ? 'primary' : 'outline-primary'}
                          className="w-100 me-2"
                          onClick={() => setShotOutcome('made')}
                          type="button"
                        >
                          Made
                        </Button>
                        <Button
                          variant={shotOutcome === 'missed' ? 'primary' : 'outline-primary'}
                          className="w-100"
                          onClick={() => setShotOutcome('missed')}
                          type="button"
                        >
                          Missed
                        </Button>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              )}

              {eventType === EVENT_TYPE_REBOUND && (
                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>
                        <strong>Rebound Type</strong>
                      </Form.Label>
                      <div className="d-flex">
                        <Button
                          variant={reboundType === 'defensive' ? 'primary' : 'outline-primary'}
                          className="w-100 me-2"
                          onClick={() => setReboundType('defensive')}
                          type="button"
                        >
                          Defensive
                        </Button>
                        <Button
                          variant={reboundType === 'offensive' ? 'primary' : 'outline-primary'}
                          className="w-100"
                          onClick={() => setReboundType('offensive')}
                          type="button"
                        >
                          Offensive
                        </Button>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              )}
              <div className="d-flex justify-content-end gap-2 mt-4">
                <Button variant="secondary" onClick={handleCancel} type="button">
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!selectedPlayer || (eventType === EVENT_TYPE_SHOT && !shotLocation)}
                >
                  <i className="bi bi-check-lg me-1"></i>
                  Save Event
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Form>
      )}
    </div>
  );
};

export default TaggingInterface;

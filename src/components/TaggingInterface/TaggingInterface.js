import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form, Row, Col, Card, ListGroup, Badge, Toast, ToastContainer } from 'react-bootstrap';
import { EVENT_TYPES, getEventTypeFromKey, formatTime } from '../../utils/eventManager';
import CourtDiagram from './CourtDiagram';
import './TaggingInterface.css';

const TaggingInterface = ({ 
  currentTime, 
  onAddEvent, 
  isPaused, 
  setIsPaused,
  players 
}) => {
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
    
    if (eventType === 'shot') {
      details = {
        shotType,
        outcome: shotOutcome,
        location: shotLocation
      };
      
      if (shotOutcome === 'made' && assistingPlayer) {
        details.assist = assistingPlayer;
      }
    } else if (eventType === 'rebound') {
      details = {
        reboundType
      };
    }
    
    // Get player name for display
    const playerName = players.find(p => p.id === selectedPlayer)?.name || selectedPlayer;
    const assistName = players.find(p => p.id === assistingPlayer)?.name || '';
    
    // Create event summary for recent events list
    const eventSummary = {
      type: eventType,
      player: playerName,
      time: currentTime,
      details: {
        ...details,
        assist: assistingPlayer,
        assistingPlayerName: assistName
      }
    };
    
    // Add to recent events (keep last 5)
    setRecentEvents(prev => [eventSummary, ...prev].slice(0, 5));
    
    // Set last event for toast
    setLastEventAdded(eventSummary);
    setShowToast(true);
    
    // Call the onAddEvent function with the expected parameters
    onAddEvent(eventType, selectedPlayer, currentTime, details);
    
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
    let display = `${formatTime(event.time)} - ${event.player}: ${event.type}`;
    
    if (event.type === 'shot') {
      display += ` (${event.details.shotType}, ${event.details.outcome})`;
      if (event.details.assistingPlayerName) {
        display += ` - Assist: ${event.details.assistingPlayerName}`;
      }
    } else if (event.type === 'rebound') {
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
                          bg={event.type === 'shot' ? 
                            (event.details.outcome === 'made' ? 'success' : 'danger') : 
                            'primary'} 
                          className="me-2"
                        >
                          {formatTime(event.time)}
                        </Badge>
                        <div className="small">
                          <strong>{event.player}</strong>: {event.type}
                          {event.type === 'shot' && ` (${event.details.shotType}, ${event.details.outcome})`}
                          {event.details.assistingPlayerName && (
                            <span className="text-muted"> • Assist: {event.details.assistingPlayerName}</span>
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
                    <Form.Control 
                      as="select"
                      value={selectedPlayer}
                      onChange={(e) => setSelectedPlayer(e.target.value)}
                      required
                      className="form-select-lg"
                    >
                      <option value="">Select Player</option>
                      {players.map((player) => (
                        <option key={player.id} value={player.id}>
                          #{player.number} {player.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              {eventType === 'shot' && (
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

              {eventType === 'rebound' && (
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
                  disabled={!selectedPlayer || (eventType === 'shot' && !shotLocation)}
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

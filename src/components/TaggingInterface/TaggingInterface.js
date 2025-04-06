import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form, Row, Col, Card, ListGroup } from 'react-bootstrap';
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
  const [keyboardShortcuts, setKeyboardShortcuts] = useState([]);

  // Initialize keyboard shortcuts
  useEffect(() => {
    const shortcuts = Object.entries(EVENT_TYPES).map(([type, config]) => ({
      type: type.toLowerCase(),
      key: config.key,
      label: config.label
    }));
    setKeyboardShortcuts(shortcuts);
  }, []);

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

  return (
    <div className="tagging-interface">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="m-0">Current Time: {formatTime(currentTime)}</h5>
        <Button 
          variant={isPaused ? "success" : "danger"}
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? "Resume" : "Pause"}
        </Button>
      </div>

      {isPaused && !showForm && (
        <div className="text-center mb-3">
          <p>Press a key to tag an event or click a button below:</p>
          <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
            {Object.entries(EVENT_TYPES).map(([type, config]) => (
              <Button
                key={type}
                variant="outline-primary"
                onClick={() => {
                  setEventType(type.toLowerCase());
                  setShowForm(true);
                }}
              >
                {config.label} ({config.key})
              </Button>
            ))}
          </div>
          
          <Card className="mb-3">
            <Card.Header>Keyboard Shortcuts</Card.Header>
            <ListGroup variant="flush">
              {keyboardShortcuts.map((shortcut) => (
                <ListGroup.Item key={shortcut.type}>
                  <strong>{shortcut.key}</strong> - {shortcut.label}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </div>
      )}

      {isPaused && showForm && (
        <Form onSubmit={handleSubmit}>
          <Card className="mb-3">
            <Card.Header>
              <h5 className="m-0">
                {EVENT_TYPES[eventType.toUpperCase()]?.label || 'New Event'}
              </h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Player</Form.Label>
                    <Form.Control 
                      as="select"
                      value={selectedPlayer}
                      onChange={(e) => setSelectedPlayer(e.target.value)}
                      required
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
                    <Col>
                      <Form.Group>
                        <Form.Label>Shot Type</Form.Label>
                        <Form.Control 
                          as="select"
                          value={shotType}
                          onChange={(e) => setShotType(e.target.value)}
                        >
                          <option value="2-point">2-Point</option>
                          <option value="3-point">3-Point</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Outcome</Form.Label>
                        <Form.Control 
                          as="select"
                          value={shotOutcome}
                          onChange={(e) => {
                            setShotOutcome(e.target.value);
                            // Update the shot location with the new outcome if it exists
                            if (shotLocation) {
                              setShotLocation({
                                ...shotLocation,
                                outcome: e.target.value
                              });
                            }
                          }}
                        >
                          <option value="made">Made</option>
                          <option value="missed">Missed</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>

                  {shotOutcome === 'made' && (
                    <Row className="mb-3">
                      <Col>
                        <Form.Group>
                          <Form.Label>Assisted By</Form.Label>
                          <Form.Control 
                            as="select"
                            value={assistingPlayer}
                            onChange={(e) => setAssistingPlayer(e.target.value)}
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
                        <Form.Label>Shot Location</Form.Label>
                        <CourtDiagram 
                          onLocationSelect={handleLocationSelect} 
                          selectedLocation={shotLocation} 
                          shotType={shotType}
                          shotOutcome={shotOutcome}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </>
              )}

              {eventType === 'rebound' && (
                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>Rebound Type</Form.Label>
                      <Form.Control 
                        as="select"
                        value={reboundType}
                        onChange={(e) => setReboundType(e.target.value)}
                      >
                        <option value="defensive">Defensive</option>
                        <option value="offensive">Offensive</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
              )}

              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
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

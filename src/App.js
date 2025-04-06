import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import VideoPlayer from './components/VideoPlayer/VideoPlayer';
import TaggingInterface from './components/TaggingInterface/TaggingInterface';
import Timeline from './components/Timeline/Timeline';
import Dashboard from './components/Dashboard/Dashboard';
import Export from './components/Export/Export';
import { createEvent } from './utils/eventManager';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  // State for video player
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  // State for events and players
  const [events, setEvents] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // State for player management modal
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [playerNumber, setPlayerNumber] = useState('');
  
  // Handle time update from video player
  const handleTimeUpdate = (time) => {
    setCurrentTime(time);
  };
  
  // Handle duration change from video player
  const handleDurationChange = (duration) => {
    console.log('Video duration changed:', duration);
    setVideoDuration(duration);
  };
  
  // Handle adding a new event
  const handleAddEvent = (eventType, playerId, timestamp, details) => {
    const newEvent = createEvent(eventType, playerId, timestamp, details);
    setEvents(prevEvents => [...prevEvents, newEvent]);
  };
  
  // Handle deleting an event
  const handleDeleteEvent = (eventId) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(null);
    }
  };
  
  // Handle clicking on a timeline marker
  const handleMarkerClick = (event) => {
    setSelectedEvent(event);
    setIsPaused(true);
    if (event && event.time) {
      setCurrentTime(event.time);
    }
  };
  
  // Handle adding a new player
  const handleAddPlayer = () => {
    if (!playerName || !playerNumber) {
      alert('Please enter both player name and number');
      return;
    }
    
    const newPlayer = {
      id: `player-${Date.now()}`,
      name: playerName,
      number: playerNumber
    };
    
    setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
    setPlayerName('');
    setPlayerNumber('');
    setShowPlayerModal(false);
  };
  
  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('basketballEvents');
    const savedPlayers = localStorage.getItem('basketballPlayers');
    
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
    
    if (savedPlayers) {
      setPlayers([
        { id: 'player-1', name: 'John Smith', number: '23' },
        { id: 'player-2', name: 'Mike Johnson', number: '10' },
        { id: 'player-3', name: 'David Williams', number: '34' },
        { id: 'player-4', name: 'Chris Davis', number: '5' },
        { id: 'player-5', name: 'James Brown', number: '12' }
      ]);
    } else {
      setPlayers([
        { id: 'player-1', name: 'John Smith', number: '23' },
        { id: 'player-2', name: 'Mike Johnson', number: '10' },
        { id: 'player-3', name: 'David Williams', number: '34' },
        { id: 'player-4', name: 'Chris Davis', number: '5' },
        { id: 'player-5', name: 'James Brown', number: '12' }
      ]);
    }
  }, []);
  
  // Save data to localStorage whenever events or players change
  useEffect(() => {
    localStorage.setItem('basketballEvents', JSON.stringify(events));
  }, [events]);
  
  useEffect(() => {
    localStorage.setItem('basketballPlayers', JSON.stringify(players));
  }, [players]);

  // Display event details when an event is selected
  useEffect(() => {
    if (selectedEvent) {
      console.log('Selected event:', selectedEvent);
    }
  }, [selectedEvent]);

  return (
    <div className="App">
      <Container fluid>
        <header className="app-header">
          <h1>Basketball Statistics Tracker</h1>
          <div className="header-actions">
            <Button 
              variant="outline-primary" 
              onClick={() => setShowPlayerModal(true)}
            >
              Manage Players
            </Button>
          </div>
        </header>
        
        <Row>
          <Col lg={8}>
            <VideoPlayer 
              onTimeUpdate={handleTimeUpdate}
              onDurationChange={handleDurationChange}
              onTagEvent={handleAddEvent}
              isPaused={isPaused}
              setIsPaused={setIsPaused}
              currentTime={currentTime}
            />
            
            <Timeline 
              events={events}
              videoDuration={videoDuration}
              onMarkerClick={handleMarkerClick}
              currentTime={currentTime}
              key={`timeline-${videoDuration}-${events.length}`}
            />
            
            <TaggingInterface 
              currentTime={currentTime}
              onAddEvent={handleAddEvent}
              isPaused={isPaused}
              setIsPaused={setIsPaused}
              players={players}
            />
          </Col>
          
          <Col lg={4}>
            <Dashboard 
              events={events}
              players={players}
              onDeleteEvent={handleDeleteEvent}
            />
            
            <Export 
              events={events}
              players={players}
            />
          </Col>
        </Row>
      </Container>
      
      {/* Player Management Modal */}
      <Modal show={showPlayerModal} onHide={() => setShowPlayerModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Manage Players</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <h5>Add New Player</h5>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Player Name</Form.Label>
                <Form.Control 
                  type="text" 
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter player name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Jersey Number</Form.Label>
                <Form.Control 
                  type="text" 
                  value={playerNumber}
                  onChange={(e) => setPlayerNumber(e.target.value)}
                  placeholder="Enter jersey number"
                />
              </Form.Group>
              <Button variant="primary" onClick={handleAddPlayer}>
                Add Player
              </Button>
            </Form>
          </div>
          
          <div>
            <h5>Current Players</h5>
            <ul className="player-list">
              {players.map(player => (
                <li key={player.id} className="player-item">
                  <span>{player.number} - {player.name}</span>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => {
                      setPlayers(prevPlayers => 
                        prevPlayers.filter(p => p.id !== player.id)
                      );
                    }}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPlayerModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;

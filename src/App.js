import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addPlayer, deletePlayer } from './store/slices/playersSlice';
import { Container, Button, Modal, Form, Nav } from 'react-bootstrap';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link 
} from 'react-router-dom';
import MainPage from './pages/MainPage';
import DashboardPage from './pages/DashboardPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  // UI state for player management modal only
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [playerNumber, setPlayerNumber] = useState('');
  const dispatch = useDispatch();
  const players = useSelector(state => state.players.list);

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
    dispatch(addPlayer(newPlayer));
    setPlayerName('');
    setPlayerNumber('');
    setShowPlayerModal(false);
  };
  


  return (
    <Router>
      <div className="App">
        <Container fluid>
          <header className="app-header">
            <h1>Basketball Statistics Tracker</h1>
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link as={Link} to="/">Main</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/dashboard">Dashboard & Export</Nav.Link>
              </Nav.Item>
            <Nav.Item className="ms-auto">
                <Button 
                  variant="outline-primary" 
                  onClick={() => setShowPlayerModal(true)}
                >
                  Manage Players
                </Button>
              </Nav.Item>
            </Nav>
          </header>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
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
                        dispatch(deletePlayer(player.id));
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
    </Router>
  );
}

export default App;

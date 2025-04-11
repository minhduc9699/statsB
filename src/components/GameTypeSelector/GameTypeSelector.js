import React from 'react';
import { Form, ButtonGroup, Button } from 'react-bootstrap';
import './GameTypeSelector.css';

/**
 * Component for selecting basketball game type (team size and court type)
 */
const GameTypeSelector = ({ selectedType, onTypeChange }) => {
  // Available game types
  const gameTypes = [
    { id: '1v1', label: '1v1', description: 'Half Court' },
    { id: '2v2', label: '2v2', description: 'Half Court' },
    { id: '3v3', label: '3v3', description: 'Half Court' },
    { id: '4v4', label: '4v4', description: 'Half Court' },
    { id: '5v5', label: '5v5', description: 'Full Court' }
  ];

  return (
    <div className="game-type-selector">
      <Form.Group>
        <Form.Label className="fw-bold">Game Type</Form.Label>
        <div className="mt-2">
          <ButtonGroup>
            {gameTypes.map(type => (
              <Button
                key={type.id}
                variant={selectedType === type.id ? 'primary' : 'outline-primary'}
                onClick={() => onTypeChange(type.id)}
                className="game-type-button"
              >
                <div className="d-flex flex-column align-items-center">
                  <span>{type.label}</span>
                  <small className="text-size-xs">{type.description}</small>
                </div>
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </Form.Group>
    </div>
  );
};

export default GameTypeSelector;

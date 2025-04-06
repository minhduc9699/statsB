import React, { useRef, useEffect } from 'react';
import fibaCourtSVG from '../../assets/Basketball_court_fiba.svg';
import './CourtDiagram.css';

const CourtDiagram = ({ onLocationSelect, selectedLocation, shotType, shotOutcome }) => {
  const svgRef = useRef(null);
  const imgRef = useRef(null);
  
  useEffect(() => {
    // Prevent default drag behavior on the image
    if (imgRef.current) {
      const img = imgRef.current;
      
      // Prevent drag start
      const preventDrag = (e) => {
        e.preventDefault();
        return false;
      };
      
      img.addEventListener('dragstart', preventDrag);
      
      // Clean up
      return () => {
        img.removeEventListener('dragstart', preventDrag);
      };
    }
  }, []);
  
  // Handle click on court
  const handleCourtClick = (e) => {
    if (!imgRef.current) return;
    
    const img = imgRef.current;
    const rect = img.getBoundingClientRect();
    
    // Calculate click position relative to image
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert to percentage coordinates (0-100)
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    // Check if click is within court boundaries
    if (isWithinCourtBoundaries(xPercent, yPercent)) {
      // Pass location to parent component with current shotOutcome
      onLocationSelect({ 
        x: xPercent, 
        y: yPercent,
        outcome: shotOutcome // Use the shotOutcome from props
      });
    } else {
      alert('Please click within the court boundaries');
    }
  };
  
  // Prevent drag events
  const preventDragHandler = (e) => {
    e.preventDefault();
    return false;
  };
  
  // Check if location is within court boundaries
  const isWithinCourtBoundaries = (x, y) => {
    // Simple boundary check
    return x >= 10 && x <= 90 && y >= 6 && y <= 94;
  };
  
  return (
    <div className="court-diagram-container">
      <div 
        ref={svgRef} 
        className="court-diagram"
        onClick={handleCourtClick}
        onDragStart={preventDragHandler}
        onDrag={preventDragHandler}
      >
        <img 
          ref={imgRef}
          src={fibaCourtSVG} 
          alt="Basketball Court" 
          className="court-image"
          draggable="false"
          onDragStart={preventDragHandler}
        />
        
        {/* Selected shot location marker */}
        {selectedLocation && (
          <div 
            className="shot-marker"
            style={{
              left: `${selectedLocation.x}%`,
              top: `${selectedLocation.y}%`,
              backgroundColor: selectedLocation.outcome === 'made' ? '#28a745' : '#dc3545', // Green for made, Red for missed
              border: '2px solid white'
            }}
            title={`${shotType} shot - ${selectedLocation.outcome || ''}`}
          />
        )}
      </div>
      
      <div className="court-instructions">
        Click on the court to mark the shot location
      </div>
      
      {/* Shot outcome legend */}
      <div className="shot-outcome-legend">
        <div className="legend-item">
          <span className="legend-marker made"></span> Made Shot
        </div>
        <div className="legend-item">
          <span className="legend-marker missed"></span> Missed Shot
        </div>
      </div>
    </div>
  );
};

export default CourtDiagram;

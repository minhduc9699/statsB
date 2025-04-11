import React, { useRef, useEffect } from 'react';
import fullCourtSVG from '../../assets/Basketball_court_fiba.svg';
import halfCourtSVG from '../../assets/Basketball_half_court.svg';
import './CourtDiagram.css';

const CourtDiagram = ({ 
  onLocationSelect, 
  selectedLocation, 
  shotType, 
  shotOutcome, 
  gameType = '3v3' // Default to 3v3 half court
}) => {
  const svgRef = useRef(null);
  const imgRef = useRef(null);
  
  // Determine if full court based on game type
  const isFullCourt = gameType === '5v5';
  
  // Use appropriate court SVG based on game type
  const courtSVG = isFullCourt ? fullCourtSVG : halfCourtSVG;
  
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
    
    // Check if click is within court boundaries based on court type
    if (isWithinCourtBoundaries(xPercent, yPercent, isFullCourt)) {
      // Pass location to parent component with current shotOutcome and court position info
      onLocationSelect({ 
        x: xPercent, 
        y: yPercent,
        outcome: shotOutcome, // Use the shotOutcome from props
        courtSide: getCourtSide(yPercent, isFullCourt) // Add court side information (offensive/defensive)
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
  
  // Check if location is within court boundaries based on court type
  const isWithinCourtBoundaries = (x, y, isFullCourt) => {
    if (isFullCourt) {
      // Full court boundaries (slightly inset from edge)
      return x >= 10 && x <= 90 && y >= 3 && y <= 97;
    } else {
      // Half court boundaries (slightly inset from edge)
      return x >= 10 && x <= 90 && y >= 6 && y <= 94;
    }
  };
  
  // Determine which side of the court a shot was taken from
  const getCourtSide = (y, isFullCourt) => {
    if (!isFullCourt) {
      return 'offensive'; // Half court is always offensive
    }
    
    // For full court, determine offense/defense based on position
    // Assuming top half is defensive, bottom half is offensive
    return y > 50 ? 'offensive' : 'defensive';
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
          src={courtSVG} 
          alt={`Basketball ${isFullCourt ? 'Full' : 'Half'} Court`}
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

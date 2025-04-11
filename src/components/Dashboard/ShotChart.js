import React from 'react';
import fullCourtSVG from '../../assets/Basketball_court_fiba.svg';
import halfCourtSVG from '../../assets/Basketball_half_court.svg';
import './ShotChart.css';

const ShotChart = ({ shotEvents }) => {
  // Determine if we have any events from a 5v5 game (full court)
  // Need to check the first event that has gameType information to determine the court type
  const hasFullCourtEvents = shotEvents.some(shot => 
    shot.details.gameType === '5v5'
  );
  
  // Group shots by court type
  const fullCourtShots = hasFullCourtEvents ? 
    shotEvents.filter(shot => shot.details.gameType === '5v5') : [];
    
  const halfCourtShots = hasFullCourtEvents ? 
    shotEvents.filter(shot => shot.details.gameType !== '5v5') : shotEvents;
  
  return (
    <div className="shot-chart-container">
      {/* Show full court if any 5v5 events exist */}
      {hasFullCourtEvents && (
        <div className="shot-chart full-court-chart">
          <h6 className="chart-title">Full Court (5v5)</h6>
          <div className="court-wrapper">
            <img 
              src={fullCourtSVG} 
              alt="Basketball Full Court" 
              className="court-image"
            />
            
            {/* Shot markers for full court */}
            {fullCourtShots.map(shot => (
              <div
                key={shot.id}
                className="shot-marker"
                style={{
                  left: `${shot.details.location.x}%`,
                  top: `${shot.details.location.y}%`,
                  backgroundColor: shot.details.outcome === 'made' ? '#28a745' : '#dc3545',
                  border: '2px solid #fff'
                }}
                data-shot-type={shot.details.shotType}
                data-outcome={shot.details.outcome}
                title={`${shot.details.shotType} - ${shot.details.outcome}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Show half court for non-5v5 games */}
      {halfCourtShots.length > 0 && (
        <div className="shot-chart half-court-chart">
          <h6 className="chart-title">Half Court {hasFullCourtEvents ? '(1v1 to 4v4)' : ''}</h6>
          <div className="court-wrapper">
            <img 
              src={halfCourtSVG} 
              alt="Basketball Half Court" 
              className="court-image"
            />
            
            {/* Shot markers for half court */}
            {halfCourtShots.map(shot => (
              <div
                key={shot.id}
                className="shot-marker"
                style={{
                  left: `${shot.details.location.x}%`,
                  top: `${shot.details.location.y}%`,
                  backgroundColor: shot.details.outcome === 'made' ? '#28a745' : '#dc3545',
                  border: '2px solid #fff'
                }}
                data-shot-type={shot.details.shotType}
                data-outcome={shot.details.outcome}
                title={`${shot.details.shotType} - ${shot.details.outcome}`}
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="shot-chart-legend">
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

export default ShotChart;

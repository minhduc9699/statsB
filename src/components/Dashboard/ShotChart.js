import React from 'react';
import fibaCourtSVG from '../../assets/Basketball_court_fiba.svg';
import './ShotChart.css';

const ShotChart = ({ shotEvents }) => {
  return (
    <div className="shot-chart-container">
      <div className="shot-chart">
        <img 
          src={fibaCourtSVG} 
          alt="Basketball Court" 
          className="court-image"
        />
        
        {/* Shot markers */}
        {shotEvents.map(shot => (
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
          />
        ))}
      </div>
      
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

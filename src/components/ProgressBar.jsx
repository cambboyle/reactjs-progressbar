import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ 
  progress,
  height,
  milestones,
}) => {
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    setBarWidth(progress);
  }, [progress]);

  const containerStyles = {
    height,
    width: '100%',
    backgroundColor: '#2d2d2d',
    borderRadius: '8px',
    margin: '16px 0',
    overflow: 'hidden',
    position: 'relative',
    border: '1px solid #404040'
  };

  const fillerStyles = {
    height: '100%',
    width: `${barWidth}%`,
    backgroundColor: '#0099ff',
    borderRadius: 'inherit',
    transition: 'width 0.6s ease',
    position: 'relative',
    boxShadow: '0 0 8px rgba(0, 153, 255, 0.5)'
  };

  const cssRules = `
    @keyframes progress-animation {
      0% {
        background-position: 0 0;
      }
      100% {
        background-position: 20px 0;
      }
    }

    @keyframes progress-celebration {
      0%, 100% {
        transform: scaleY(1);
      }
      50% {
        transform: scaleY(0.85);
      }
    }
  `;

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = cssRules;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [cssRules]);

  // Update milestone styles
  const milestoneStyle = {
    position: 'absolute',
    width: '2px',
    height: '12px',
    backgroundColor: '#e0e0e0',
    transform: 'translateX(-50%)',
    bottom: '-4px',
    opacity: 0.4
  };

  const milestoneLabelStyle = {
    position: 'absolute',
    bottom: '-24px',
    transform: 'translateX(-50%)',
    fontSize: '11px',
    color: '#b0b0b0',
    whiteSpace: 'nowrap'
  };

  return (
    <div 
      style={containerStyles}
    >
      <div style={fillerStyles} />
      {milestones.map(milestone => (
        <div key={milestone.value}>
          <div 
            style={milestoneStyle}
          />
          <div
            style={milestoneLabelStyle}
          >
            {milestone.label}
          </div>
        </div>
      ))}
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  barColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  height: PropTypes.number,
  targetValue: PropTypes.number,
  milestones: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      label: PropTypes.string
    })
  ),
  theme: PropTypes.shape({
    text: PropTypes.string,
    primary: PropTypes.string,
    background: PropTypes.string
  })
};

ProgressBar.defaultProps = {
  barColor: '#0F7B6C',
  backgroundColor: '#F1F1EF',
  height: 8,
  targetValue: 100,
  milestones: [],
  theme: {
    text: '#37352F',
    primary: '#0F7B6C',
    background: '#FFFFFF'
  }
};

export default ProgressBar;

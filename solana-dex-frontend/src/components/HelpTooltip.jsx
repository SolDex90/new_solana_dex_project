import React from 'react';

const HelpTooltip = ({ text }) => {
  return (
    <div className="tooltip">
      <span className="tooltiptext">{text}</span>
    </div>
  );
};

export default HelpTooltip;

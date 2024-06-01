import React, { useState } from 'react';

const CustomizableDashboard = () => {
  const [widgets, setWidgets] = useState([
    { id: 1, name: 'Price Chart' },
    { id: 2, name: 'Order Book' },
  ]);

  const handleAddWidget = (widgetName) => {
    setWidgets([...widgets, { id: widgets.length + 1, name: widgetName }]);
  };

  return (
    <div>
      <h2>Customizable Dashboard</h2>
      <div>
        <input
          type="text"
          placeholder="Widget Name"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddWidget(e.target.value);
              e.target.value = '';
            }
          }}
        />
      </div>
      <div>
        {widgets.map((widget) => (
          <div key={widget.id}>
            <h3>{widget.name}</h3>
            {/* Render widget content based on widget.name */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomizableDashboard;

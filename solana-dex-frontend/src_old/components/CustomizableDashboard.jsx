import React, { useState } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../styles/styles.css'; // Adjusted import path

const CustomizableDashboard = () => {
  const [widgets, setWidgets] = useState([
    { id: '1', name: 'Price Chart' },
    { id: '2', name: 'Order Book' },
  ]);

  const handleAddWidget = (widgetName) => {
    setWidgets([...widgets, { id: `${widgets.length + 1}`, name: widgetName }]);
  };

  const layout = widgets.map((widget, index) => ({
    i: widget.id,
    x: (index * 2) % 12,
    y: Math.floor(index / 6) * 2,
    w: 2,
    h: 2,
  }));

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
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
        draggableHandle=".widget"
        draggableCancel=".no-drag"
      >
        {widgets.map((widget) => (
          <div key={widget.id} data-grid={{ i: widget.id, x: 0, y: 0, w: 2, h: 2 }}>
            <div className="widget">
              <h3>{widget.name}</h3>
              {/* Render widget content based on widget.name */}
            </div>
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default CustomizableDashboard;

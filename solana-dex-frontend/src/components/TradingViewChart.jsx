import React, { useEffect, useRef, memo } from 'react';

function TradingViewChart() {
  const container = useRef();

  useEffect(() => {
    // Function to remove existing widget
    const removeExistingWidget = () => {
      if (container.current) {
        container.current.innerHTML = ''; // Clear any previous content
      }
    };

    // Load the TradingView widget
    const loadWidget = () => {
      removeExistingWidget(); // Clear the widget if it already exists

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "autosize": true,
          "height": 500,
          "symbol": "BINANCE:SOLUSD",
          "interval": "60",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "allow_symbol_change": true,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`;

      container.current.appendChild(script);
    };

    // Initial load of the widget
    loadWidget();

    // Cleanup to remove the widget on unmount or reload
    return () => removeExistingWidget();
  }, []); // Dependency array can include items to trigger reloads

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewChart);

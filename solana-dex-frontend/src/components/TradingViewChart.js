import React, { useEffect, useRef } from 'react';

const TradingViewChart = ({ symbol, interval }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (window.TradingView) {
      new window.TradingView.widget({
        symbol: symbol,
        interval: interval,
        container_id: containerRef.current.id,
        width: "100%",
        height: "100%",
        theme: "light",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: true,
        hideideas: true,
      });
    }
  }, [symbol, interval]);

  return <div id={`tradingview_${symbol}`} ref={containerRef} style={{ height: '400px' }} />;
};

export default TradingViewChart;

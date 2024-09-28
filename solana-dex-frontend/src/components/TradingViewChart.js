import React, { useEffect, useRef } from 'react';

const TradingViewChart = ({ symbol, interval }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (window.TradingView) {
      new window.TradingView.widget({
        dataSource:"Crypto",
        symbol: symbol,
        interval: interval,
        container_id: containerRef.current.id,
        width: "100%",
        height: "300px",
        theme: "dark",
        style: "2",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: true,
        hideideas: true,
      });
    }
  }, [symbol, interval]);

  return <div id={`tradingview_0a135`} symbol = {symbol} ref={containerRef} style={{ height: '300px' }} />;
};

export default TradingViewChart;

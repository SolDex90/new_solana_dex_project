import React, { useEffect, useRef } from 'react';
import { fetchChartDataNew } from '../fetchChartData'; // Adjust the import path if necessary
import { fetchTokenMetadata } from '../fetchTokenMetadata';

const configurationData = {
  // Represents the resolutions for bars supported by your datafeed
  supported_resolutions: ['1', '5', '15', '30', '60', '240', '1D', '1W'],
  // The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
  exchanges: [
    { value: 'Birdeye', name: 'Birdeye', desc: 'birdeye' },
  ],
  // The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
  // symbols_types: [
  //     { name: 'crypto', value: 'crypto'}
  // ]
};

async function getAllSymbols() {
  const tokens = await fetchTokenMetadata();
  const symbols = [];
  tokens.map(token => {
    symbols.push({
      symbol: token.symbol,
      full_name: token.name,
      description: token.address,
      exchange: "birdeye",
      type: 'crypto',
    });
  })
  return symbols;
}

const datafeed = {
  onReady: (callback) => {
    console.log('[onReady]: Method call');
    setTimeout(() => callback(configurationData));
  },

  searchSymbols: async (
    userInput,
    exchange,
    symbolType,
    onResultReadyCallback
  ) => {
    console.log('[searchSymbols]: Method call');
    const symbols = await getAllSymbols();
    const newSymbols = symbols.filter(symbol => {
      // const isExchangeValid = exchange === '' || symbol.exchange === exchange;
      const isFullSymbolContainsInput = symbol.full_name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1;
      // return isExchangeValid && isFullSymbolContainsInput;
      return isFullSymbolContainsInput;
    });

    onResultReadyCallback(newSymbols);
  },

  resolveSymbol: async (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback,
    extension
  ) => {
    const symbols = await getAllSymbols();
    const symbolItem = symbols.find(({ full_name }) => full_name === symbolName);
    if (!symbolItem) {
      console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
      onResolveErrorCallback('Cannot resolve symbol');
      return;
    }
    // Symbol information object
    const symbolInfo = {
      ticker: symbolItem.full_name,
      name: symbolItem.symbol,
      description: symbolItem.description,
      type: symbolItem.type,
      // session: '24x7',
      // timezone: 'Etc/UTC',
      exchange: symbolItem.exchange,
      // minmov: 1,
      // pricescale: 100,
      // has_intraday: false,
      // has_no_volume: true,
      // has_weekly_and_monthly: false,
      supported_resolutions: configurationData.supported_resolutions,
      // volume_precision: 2,
      // data_status: 'streaming',
    };
    console.log('[resolveSymbol]: Symbol resolved', symbolName);
    onSymbolResolvedCallback(symbolInfo);
  },

  getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
    const { from, to, firstDataRequest } = periodParams;
    console.log('[getBars]: Method call', symbolInfo, resolution, from, to);

    try {
      const data = await fetchChartDataNew(symbolInfo.name, from, to, resolution);
      if (data.length === 0) {
        onHistoryCallback([], { noData: true });
        return;
      }
      let bars = [];
      data.forEach(bar => {
        if (bar.time >= from && bar.time < to) {
          bars.push({
            time: bar.time * 1000,
            low: bar.low,
            high: bar.high,
            open: bar.open,
            close: bar.close,
          })
        }
      });
      console.log(`[getBars]: returned ${bars.length} bar(s)`);
      onHistoryCallback(bars, { noData: false });
    } catch (error) {
      console.log('[getBars]: Get error', error);
      onErrorCallback(error);
    }
  },

  subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
    console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID);
  },
  unsubscribeBars: (subscriberUID) => {
    console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
  },
};


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
        datafeed: datafeed,
      });
    }
  }, [symbol, interval]);

  return <div id={`tradingview_${symbol}`} ref={containerRef} style={{ height: '400px' }} />;
};

export default TradingViewChart;

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { fetchStockData, fetchHistoricalDataForSymbols } = require('./fetch-stock-data');

const STOCK_SYMBOLS = ['CAN', 'CCC', 'BRL', '^GDAXI', '^SDAXI', '^CDAX'];
const STOCK_NAMES = {
  'CAN': 'CANCOM SE',
  'CCC': 'Computacenter',
  'BRL': 'Bechtle',
  '^GDAXI': 'DAX',
  '^SDAXI': 'SDAX',
  '^CDAX': 'TechDAX'
};
const STOCK_EXCHANGES = {
  'CAN': 'XETRA',
  'CCC': 'LSE',
  'BRL': 'XETRA',
  '^GDAXI': 'XETRA',
  '^SDAXI': 'XETRA',
  '^CDAX': 'XETRA'
};

async function updateStockData() {
  try {
    console.log('Fetching latest stock data...');
    const stockData = await fetchStockData(STOCK_SYMBOLS);
    
    console.log('Fetching historical data for charts...');
    const historicalData = await fetchHistoricalDataForSymbols(STOCK_SYMBOLS);
    
    // Build stock objects array
    const stocks = STOCK_SYMBOLS.map(sym => ({
      sym: sym.replace('^', ''),
      name: STOCK_NAMES[sym],
      price: stockData[sym].price,
      currency: stockData[sym].currency,
      change_pct: stockData[sym].change_pct,
      exchange: STOCK_EXCHANGES[sym]
    }));
    
    // Generate new STOCK_DATA object
    const today = new Date().toISOString().slice(0, 10);
    const newStockDataScript = `const STOCK_DATA = {
  "generated": "${today}",
  "stocks": [
${stocks.map(s => `    { "sym": "${s.sym}",  "name": "${s.name.padEnd(20)}", "price": "${s.price.padEnd(10)}", "currency": "${s.currency}", "change_pct": ${s.change_pct}, "exchange": "${s.exchange}"  }`).join(',\n')}
  ]
};

const STOCK_HISTORY = {
${STOCK_SYMBOLS.map(sym => `  "${sym.replace('^', '')}": [${historicalData[sym].map(p => p.toFixed(2)).join(', ')}]`).join(',\n')}
};`;

    // Read current index.html
    const indexPath = path.join(__dirname, '..', 'index.html');
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Replace STOCK_DATA section
    const stockDataStart = content.indexOf('<!-- STOCK_DATA_START -->');
    const stockDataEnd = content.indexOf('<!-- STOCK_DATA_END -->');
    
    if (stockDataStart === -1 || stockDataEnd === -1) {
      throw new Error('Could not find STOCK_DATA markers in index.html');
    }
    
    const beforeStockData = content.substring(0, stockDataStart);
    const afterStockData = content.substring(stockDataEnd);
    
    const updatedContent = beforeStockData + 
      '<!-- STOCK_DATA_START -->\n<script>\n' + 
      newStockDataScript + 
      '\n</script>\n' + 
      afterStockData;
    
    // Write updated index.html
    fs.writeFileSync(indexPath, updatedContent, 'utf8');
    
    console.log('✅ Stock data updated successfully');
    console.log(`Updated ${stocks.length} stocks with historical data`);
    stocks.forEach(s => {
      const hist = historicalData[s.sym.replace('^', '')] || [];
      console.log(`  ${s.sym}: ${s.price} ${s.currency} (${s.change_pct > 0 ? '+' : ''}${s.change_pct.toFixed(2)}%) - ${hist.length} days history`);
    });
    
  } catch (error) {
    console.error('❌ Error updating stock data:', error.message);
    process.exit(1);
  }
}

updateStockData();

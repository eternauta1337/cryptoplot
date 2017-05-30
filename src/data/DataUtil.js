import * as d3fc from 'd3fc-random-data';

/*
* Interacts with the CRYPTOCOMPARE data api.
* https://www.cryptocompare.com/api/
* DOCS: https://min-api.cryptocompare.com
* */

// ---------------------------------------
// GET PRICE HISTORICAL DATA
// ---------------------------------------

export function getPriceData(coin, exchange, span, callback, simulate = false) {
  console.log('DataUtil - getPriceData()');
  console.log('  coin: ' + coin);
  console.log('  exchange: ' + exchange);

  // Simulate data?
  if(simulate) {
    console.log('  *** SIMULATED ***');
    callback(d3fc.randomFinancial()(Math.floor(500 * Math.random() + 500)));
    return;
  }

  // Prepare request.
  const urlRequest = 'https://min-api.cryptocompare.com/data/histo' + span + encodeUrlParams({
    fsym: coin,
    tsym: 'USD',
    limit: 2000,
    aggregate: 1,
    e: exchange,
    toTs: getUnixTimeStamp_daysAgo(0),
    allData: true
  });
  console.log('  url request: ' + urlRequest);

  // FETCH ->
  fetch(urlRequest, {method: 'GET'})
    .then(response => {
      response.json()
        .then(json => {
          console.log('  json: ', json);

          // PARSE
          const data = json.Data;
          data.forEach(d => {
            d.date = new Date(+d.time * 1000);
            d.open = +d.open;
            d.high = +d.high;
            d.low = +d.low;
            d.close = +d.close;
            d.volume = ((+d.volumefrom) + (+d.volumeto)) / 2;
          });

          console.log('  data: ', data);
          callback(data);
        });
    });
}

// ---------------------------------------
// GET LIST OF COINS
// ---------------------------------------

export function getCoins(callback) {
  // TODO
  callback([
    "BTC",
    "ETH"
  ]);
}

// ---------------------------------------
// GET LIST OF TIME SPANS
// ---------------------------------------

export function getSpans(callback) {
  // TODO
  callback([
    "day",
    "hour",
    "minute",
  ]);
}

// ---------------------------------------
// GET TOP EXCHANGES FOR A COIN
// ---------------------------------------

export function getExchangesForCoin(coin, callback) {
  console.log('DataUtil - getExchangesForCoin() - COIN: ' + coin);

  // Prepare request.
  const urlRequest = 'https://min-api.cryptocompare.com/data/top/exchanges' + encodeUrlParams({
    fsym: 'BTC',
    tsym: 'USD',
    limit: 10
  });
  console.log('  url request: ' + urlRequest);

  // FETCH ->
  fetch(urlRequest, {method: 'GET'})
    .then(response => {
      response.json()
        .then(json => {
          console.log('  json: ', json);

          // PARSE
          const data = json.Data;
          const exchanges = [];
          data.forEach(d => {
            exchanges.push(d.exchange);
          });

          console.log('  exchanges: ', exchanges);
          callback(exchanges);
        });
    });
}

// ---------------------------------------
// Utils
// ---------------------------------------

function encodeUrlParams(data) {
  let ret = [];
  for (let d in data)
    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  return '?' + ret.join('&');
}

function getUnixTimeStamp_daysAgo(days) {

  // Note:
  // JS Date.getTime() = millis since Jan 1 1970
  // Unix time = secs since Jan 1 1970

  const startDate = new Date((new Date()).getTime() - 1000 /*milli*/ * 60 /*sec*/ * 60 /*min*/ * 24 /*hours*/ * days);
  return Math.floor(startDate.getTime() / 1000);
}
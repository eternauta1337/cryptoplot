import React, {Component} from 'react';
import * as DataUtil from './data/DataUtil';
import TechanChart from './components/charts/TechanChart';
import ParamsConfig from './components/ParamsConfig';

class App extends Component {

  constructor() {
    super();

    this.state = {
      priceData: [],
      exchangeData: [],
      coinData: [],
      spanData: [],
      countData: [],
      selectedCoin: 'BTC',
      selectedSpan: 'day',
      selectedExchange: 'Bitstamp',
      selectedCount: '500'
    };

    this.handleCountSelected = this.handleCountSelected.bind(this);
    this.handleCoinSelected = this.handleCoinSelected.bind(this);
    this.handleExchangeSelected = this.handleExchangeSelected.bind(this);
    this.handleSpanSelected = this.handleSpanSelected.bind(this);
    this.handleUpdatePrices = this.handleUpdatePrices.bind(this);
  }

  componentDidMount() {

    // Get coins data, then exchanges data for that coin, then price data for that combo.
    DataUtil.getCounts(counts => {
      DataUtil.getSpans(spans => {
        DataUtil.getCoins(coins => {
          DataUtil.getExchangesForCoin(coins[0], exchanges => {
            this.setState({
              countData: counts,
              coinData: coins,
              spanData: spans,
              exchangeData: exchanges
            });
            this.handleUpdatePrices();
          });
        });
      });
    });
  }

  handleCoinSelected(coin) {

    // Update exchanges for that coin.
    // TODO: Disable the exchanges combo while the data is being fetched.
    // TODO: Remember what exchange was selected and keep it if it also has this new coin.
    DataUtil.getExchangesForCoin(coin, exchanges => {
      this.setState({
        selectedCoin: coin,
        exchangeData: exchanges
      });
    });
  }

  handleCountSelected(count) {
    this.setState({
      selectedCount: count
    });
  }

  handleExchangeSelected(exchange) {
    this.setState({
      selectedExchange: exchange
    });
  }

  handleSpanSelected(span) {
    this.setState({
      selectedSpan: span
    });
  }

  handleUpdatePrices() {

    this.setState({
      priceData: []
    });

    DataUtil.getPriceData(
      this.state.selectedCoin,
      this.state.selectedExchange,
      this.state.selectedSpan,
      this.state.selectedCount,
      data => {
        this.setState({
          priceData: data
        });
      }, /*simulated*/false);
  }

  render() {
    return (
      <div>
        <ParamsConfig
          coins={this.state.coinData}
          exchanges={this.state.exchangeData}
          spans={this.state.spanData}
          counts={this.state.countData}
          selectedCoin={this.state.selectedCoin}
          selectedSpan={this.state.selectedSpan}
          selectedExchange={this.state.selectedExchange}
          selectedCount={this.state.selectedCount}
          handleCountSelected={this.handleCountSelected}
          handleSpanSelected={this.handleSpanSelected}
          handleCoinSelected={this.handleCoinSelected}
          handleExchangeSelected={this.handleExchangeSelected}
          handleUpdatePrices={this.handleUpdatePrices}
        />
        <TechanChart data={this.state.priceData}/>
      </div>
    );
  }
}

export default App;

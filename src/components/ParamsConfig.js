import React from 'react';
import './ParamsConfig.css';

class ParamsConfig extends React.Component {

  render() {
    // console.log('ParamsConfig - render() - props: ', this.props);
    const {
      exchanges, coins, spans, counts,
      selectedExchange, selectedCoin, selectedSpan, selectedCount} = this.props;
    return (
      <div style={{position: 'absolute'}}>

        {/* COIN */}
        <select name="coinsCombo" onChange={(event) => this.props.handleCoinSelected(event.target.value)}
                defaultValue={selectedCoin}> {
          coins.map((coin, index) => {
            return <option value={coin} key={index}>{coin}</option>
          })
        } </select>

        {/* EXCHANGE */}
        <select name="exchangesCombo" onChange={(event) => this.props.handleExchangeSelected(event.target.value)}
                defaultValue={selectedExchange}> {
          exchanges.map((exchange, index) => {
            return <option value={exchange} key={index}>{exchange}</option>
          })
        } </select>

        {/* TIME SPAN */}
        <select name="spanCombo" onChange={(event) => this.props.handleSpanSelected(event.target.value)}
                defaultValue={selectedSpan}> {
          spans.map((span, index) => {
            return <option value={span} key={index}>{span}</option>
          })
        } </select>

        {/* DATA COUNT */}
        <select name="countCombo" onChange={(event) => this.props.handleCountSelected(event.target.value)}
                defaultValue={selectedCount}> {
          counts.map((count, index) => {
            return <option value={count} key={index}>{count}</option>
          })
        } </select>

        {/* UPDATE */}
        <button onClick={this.props.handleUpdatePrices}>REFRESH</button>

      </div>
    )
  }
}

export default ParamsConfig;
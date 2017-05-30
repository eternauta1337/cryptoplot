import React from 'react';

class ParamsConfig extends React.Component {

  render() {
    const {exchanges, coins, spans, selectedExchange, selectedCoin, selectedSpan} = this.props;
    return (
      <div>

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

        {/* UPDATE */}
        <button onClick={this.props.handleUpdatePrices}>REFRESH</button>

      </div>
    )
  }
}

export default ParamsConfig;
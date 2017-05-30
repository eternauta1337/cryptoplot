import React from 'react';
import './Info.css';

class Info extends React.Component {
  render() {
    return (
      <div className="info">
        Built with <a href="https://github.com/andredumas/techan.js">Techan.js (D3.js)</a> and <a href="https://www.cryptocompare.com">Cryptocompare API</a>
        <br/>
        <a href="https://github.com/ajsantander/cryptoplot">Source code</a>
      </div>
    )
  }
}

export default Info;
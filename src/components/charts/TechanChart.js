import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import * as techan from 'techan';
import responsivefy from './utils/responsivefy';
import './TechanChart.css';

class TechanChart extends React.Component {

  componentDidMount() {
    const {data} = this.props;
    this.renderChart(data);
  }

  componentWillReceiveProps(nextProps) {
    const {data} = nextProps;
    this.renderChart(data);
  }

  renderChart(data) {

    const chart = ReactDOM.findDOMNode(this.refs.chart);

    d3.select("svg").remove();

    if (!data || data.length === 0) {
      console.log('TechanChart - renderChart() skipped, no data.');
      return;
    }
    console.log('TechanChart - renderChart()');

    const margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    const x = techan.scale.financetime()
      .range([0, width]);

    const y = d3.scaleLinear()
      .range([height, 0]);

    const zoom = d3.zoom()
      .on("zoom", zoomed);

    let zoomableInit;

    const candlestick = techan.plot.candlestick()
      .xScale(x)
      .yScale(y);

    const xAxis = d3.axisBottom(x);

    const yAxis = d3.axisLeft(y);

    const svg = d3.select(chart)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .call(responsivefy)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("x", 0)
      .attr("y", y(1))
      .attr("width", width)
      .attr("height", y(0) - y(1));

    svg.append("g")
      .attr("class", "candlestick")
      .attr("clip-path", "url(#clip)");

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")");

    svg.append("g")
      .attr("class", "y axis")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");

    svg.append("rect")
      .attr("class", "pane")
      .attr("width", width)
      .attr("height", height)
      .call(zoom);

    let accessor = candlestick.accessor();

    data.sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });

    x.domain(data.map(accessor.d));
    y.domain(techan.scale.plot.ohlc(data, accessor).domain());

    svg.select("g.candlestick").datum(data);
    draw();

    // Associate the zoom with the scale after a domain has been applied
    // Stash initial settings to store as baseline for zooming
    zoomableInit = x.zoomable().clamp(false).copy();

    function zoomed() {
      let rescaledY = d3.event.transform.rescaleY(y);
      yAxis.scale(rescaledY);
      candlestick.yScale(rescaledY);

      // Emulates D3 behaviour, required for financetime due to secondary zoomable scale
      x.zoomable().domain(d3.event.transform.rescaleX(zoomableInit).domain());

      draw();
    }

    function draw() {
      svg.select("g.candlestick").call(candlestick);
      // using refresh method is more efficient as it does not perform any data joins
      // Use this if underlying data is not changing
//        svg.select("g.candlestick").call(candlestick.refresh);
      svg.select("g.x.axis").call(xAxis);
      svg.select("g.y.axis").call(yAxis)
    }
  }

  render() {
    return (
      <div>
        <div ref="chart"></div>
      </div>
    )
  }
}

export default TechanChart;
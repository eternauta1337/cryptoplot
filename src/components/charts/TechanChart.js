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

    if (!data || data.length === 0) {
      console.log('TechanChart - renderChart() skipped, no data.');
      return;
    }
    console.log('TechanChart - renderChart()');

    const chart = ReactDOM.findDOMNode(this.refs.chart);

    const margin = {top: 10, right: 20, bottom: 160, left: 40},
      margin2 = {top: 370, right: 20, bottom: 80, left: 40},
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      height2 = 500 - margin2.top - margin2.bottom;

    const x = techan.scale.financetime()
      .range([0, width]);

    const x2 = techan.scale.financetime()
      .range([0, width]);

    const y = d3.scaleLinear()
      .range([height, 0]);

    const yVolume = d3.scaleLinear()
      .range([y(0), y(0.3)]);

    const y2 = d3.scaleLinear()
      .range([height2, 0]);

    const brush = d3.brushX()
      .extent([[0, 0], [width, height2]])
      .on("end", brushed);

    const candlestick = techan.plot.candlestick()
      .xScale(x)
      .yScale(y);

    const volume = techan.plot.volume()
      .xScale(x)
      .yScale(yVolume);

    const close = techan.plot.close()
      .xScale(x2)
      .yScale(y2);

    const xAxis = d3.axisBottom(x);

    const xAxis2 = d3.axisBottom(x2);

    const yAxis = d3.axisLeft(y);

    const yAxis2 = d3.axisLeft(y2)
      .ticks(0);

    // FIXME: crosshairs not working because of problem with d3.event in techan
    // https://github.com/andredumas/techan.js/issues/179
    // const ohlcAnnotation = techan.plot.axisannotation()
    //   .axis(yAxis)
    //   .orient('left')
    //   .format(d3.format(',.2f'));

    // FIXME: crosshairs not working because of problem with d3.event in techan
    // https://github.com/andredumas/techan.js/issues/179
    // const timeAnnotation = techan.plot.axisannotation()
    //   .axis(xAxis)
    //   .orient('bottom')
    //   .format(d3.timeFormat('%Y-%m-%d'))
    //   .width(65)
    //   .translate([0, height]);

    // FIXME: crosshairs not working because of problem with d3.event in techan
    // https://github.com/andredumas/techan.js/issues/179
    // const crosshair = techan.plot.crosshair()
    //   .xScale(x)
    //   .yScale(y)
    //   .xAnnotation(timeAnnotation)
    //   .yAnnotation(ohlcAnnotation);

    // Remove previous chart.
    d3.select('chart-container').remove();

    const svg = d3.select(chart).append('chart-container').append('svg')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .call(responsivefy);

    const focus = svg.append("g")
      .attr("class", "focus")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    focus.append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("x", 0)
      .attr("y", y(1))
      .attr("width", width)
      .attr("height", y(0) - y(1));

    focus.append("g")
      .attr("class", "volume")
      .attr("clip-path", "url(#clip)");

    focus.append("g")
      .attr("class", "candlestick")
      .attr("clip-path", "url(#clip)");

    focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")");

    focus.append("g")
      .attr("class", "y axis")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");

    // FIXME: crosshairs not working because of problem with d3.event in techan
    // https://github.com/andredumas/techan.js/issues/179
    // focus.append('g')
    //   .attr("class", "crosshair")
    //   .call(crosshair);

    const context = svg.append("g")
      .attr("class", "context")
      .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    context.append("g")
      .attr("class", "close");

    context.append("g")
      .attr("class", "pane");

    context.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height2 + ")");

    context.append("g")
      .attr("class", "y axis")
      .call(yAxis2);

    const accessor = candlestick.accessor(),
      timestart = Date.now();

    data.sort(function (a, b) {
      return d3.ascending(accessor.d(a), accessor.d(b));
    });

    x.domain(data.map(accessor.d));
    x2.domain(x.domain());
    y.domain(techan.scale.plot.ohlc(data, accessor).domain());
    y2.domain(y.domain());
    yVolume.domain(techan.scale.plot.volume(data).domain());

    focus.select("g.candlestick").datum(data);
    focus.select("g.volume").datum(data);

    context.select("g.close").datum(data).call(close);
    context.select("g.x.axis").call(xAxis2);

    // Associate the brush with the scale and render the brush only AFTER a domain has been applied
    context.select("g.pane").call(brush).selectAll("rect").attr("height", height2);

    x.zoomable().domain(x2.zoomable().domain());

    draw();

    console.log("Render time: " + (Date.now() - timestart));

    function brushed() {
      const zoomable = x.zoomable(),
        zoomable2 = x2.zoomable();

      zoomable.domain(zoomable2.domain());
      if (d3.event.selection !== null) zoomable.domain(d3.event.selection.map(zoomable.invert));
      draw();
    }

    function draw() {
      const candlestickSelection = focus.select("g.candlestick"),
        data = candlestickSelection.datum();
      y.domain(techan.scale.plot.ohlc(data.slice.apply(data, x.zoomable().domain()), candlestick.accessor()).domain());
      candlestickSelection.call(candlestick);
      focus.select("g.volume").call(volume);
      // using refresh method is more efficient as it does not perform any data joins
      // Use this if underlying data is not changing
//        svg.select("g.candlestick").call(candlestick.refresh);
      focus.select("g.x.axis").call(xAxis);
      focus.select("g.y.axis").call(yAxis);
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
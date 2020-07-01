var data = [{x:1, y:30, e:3},{x:2, y:20, e:5},{x:3, y:45, e:2}, {x:4, y:40, e:2}, {x:5, y:60, e:4}]

function getMaxY() {
  return data.reduce((max, p) => p.y > max ? p.y : max, data[0].y);
}

function getMaxX() {
  return data.reduce((max, p) => p.e > max ? p.e : max, data[0].e);
}

function getMaxE() {
  return data.reduce((max, p) => p.e > max ? p.e : max, data[0].e);
}



var width = document.documentElement.clientWidth,
  height = document.documentElement.clientHeight;

var svg = d3.select('svg').attr('width', width).attr('height', height);

var margin = {top: 100, right: 50, bottom: 100, left: 100},
  chartWidth = width - margin.left - margin.right,
  chartHeight = height - margin.top - margin.bottom,
  g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var x = d3.scaleLinear()
  .range([0, chartWidth])
  .domain([0, getMaxX(data)]);

var y = d3.scaleLinear()
  .range([chartHeight, 0])
  .domain([0, getMaxY(data)+getMaxE(data)]);

var addData = function() {
  var points = g.selectAll('circle.point')
    .data(data);

  points.enter()
    .append('circle')
    .attr('class', 'point')
    .attr('r', 2)
  .merge( points )
      .attr('cx', function(d) { return x(d.x); })
      .attr('cy', function(d) { return y(d.y); })

  var lines = g.selectAll('line.error')
    .data(data);

  lines.enter()
    .append('line')
    .attr('class', 'error')
	.attr("stroke", "red")
    .attr("stroke-width", 1.5)
  .merge(lines)
    .attr('x1', function(d) { return x(d.x); })
    .attr('x2', function(d) { return x(d.x); })
    .attr('y1', function(d) { return y(d.y + d.e); })
    .attr('y2', function(d) { return y(d.y - d.e); })
	;
};

// axes
var xAxis = g.append('g')
  .attr('transform', 'translate(0,' + chartHeight + ')')
  .call( d3.axisBottom(x) );
var yAxis = g.append('g')
  .call( d3.axisLeft(y) );

addData();

// resize
window.onresize = function() {
  width = document.documentElement.clientWidth;
  height = document.documentElement.clientHeight;

  svg.attr('width', width).attr('height', height)

  chartWidth = width - margin.left - margin.right;
  chartHeight = height - margin.top - margin.bottom;

  x.range([0, chartWidth]);
  y.range([chartHeight, 0]);

  xAxis
    .attr('transform', 'translate(0,' + chartHeight + ')')
    .call( d3.axisBottom(x) );
  yAxis.call( d3.axisLeft(y) );

  addData();
};
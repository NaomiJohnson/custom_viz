looker.plugins.visualizations.add({
    create: function(element, config) {
        
        element.innerHTML = `
            <style>
            .error_chart {
                width="500"; height="300"
            }
            </style>`;

        element.innerHTML = css;
    var container = element.appendChild(document.createElement("div")); // Create a container element to let us center the text.
    this.container = container
    container.className = "error_chart";
    this._textElement = container.appendChild(document.createElement("div")); // Create an element to contain the text.
 
  
    },
    updateAsync: function(data, element, config, queryResponse, details, done) {
        this.container.innerHTML = '' // clear container of previous vis
        this.clearErrors(); // clear any errors from previous updates
      
        // ensure data fit - requires no pivots, exactly 1 dimension_like field, and exactly 2 measure_like fields
        if (!handleErrors(this, queryResponse, {
          min_pivots: 0, max_pivots: 0,
          min_dimensions: 1, max_dimensions: 1,
          min_measures: 2, max_measures: 2})) {
          return;
        }
      
        var dimension = queryResponse.fields.dimension_like[0].name;
        var measure_1_score = queryResponse.fields.measure_like[0].name, measure_2_error = queryResponse.fields.measure_like[1].name;      


        function getMaxY() {
            return data.reduce((max, p) => p.y > max ? p.y : max, data[0].y);
          }
          
          function getMaxX() {
            return data.reduce((max, p) => p.e > max ? p.e : max, data[0].e);
          }
          
          function getMaxE() {
            return data.reduce((max, p) => p.e > max ? p.e : max, data[0].e);
          }
          
          
          
          var width = element.clientWidth,
            height = element.clientHeight;
          
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
            width = element.clientWidth;
            height = element.clientHeight;
          
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
    }
  })

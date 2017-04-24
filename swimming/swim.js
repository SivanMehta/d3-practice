const margin = {top: 20, right: 20, bottom: 30, left: 40}
const width = window.innerWidth - margin.left - margin.right
const height = window.innerHeight - margin.top - margin.bottom

var x = d3.scaleTime()
  .range([0, width])

var y = d3.scaleLinear()
  .range([height, 0])

var yAxis = d3.axisLeft(y).ticks(5)
var xAxis = d3.axisBottom(x).ticks(5)

var svg = d3.select('#graph').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var psv = d3.dsvFormat("|")
var parseDate = d3.timeParse("%Y-%m-%d")

function renderData(data) {
  data.forEach(d => {
    d.date = parseDate(d.date)
    d.points = +d.points
  })

  // Scale the range of the data
  x.domain(d3.extent(data, d => d.date ))
  y.domain([
    d3.min(data, d => d.points ) * .9,
    d3.max(data, d => d.points ) * 1.1
  ])

  svg.selectAll("dot")
    .data(data).enter()
    .append("circle")
    .filter(d => !isNaN(d.points))
    .attr("r", 3.5)
    .attr("cx", d => x(d.date))
    .attr("cy", d => y(d.points))
    .attr('fill', '#BDBDBD')

  // Add the X Axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add the Y Axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);
}

d3.request("/data.csv")
  .mimeType("text/plain")
  .response(xhr => psv.parse(xhr.responseText))
  .get(renderData)

// Neural Net

var inputLayer = new synaptic.Layer(2)
var hiddenLayer = new synaptic.Layer(6)
var outputLayer = new synaptic.Layer(1)

inputLayer.project(hiddenLayer)
hiddenLayer.project(outputLayer)

var nn = new synaptic.Network({
	input: inputLayer,
	hidden: [hiddenLayer],
	output: outputLayer
})

// training the network on XOR
const learningRate = .3

// Graphing

const margin = {top: 20, right: 20, bottom: 60, left: 40}
const width = window.innerWidth - margin.left - margin.right
const height = window.innerHeight - margin.top - margin.bottom

var x = d3.scaleLinear()
  .domain([0, 2.75])
  .range([0, width])

var y = d3.scaleLinear()
  .domain([.5, 2])
  .range([height, 0])

var yAxis = d3.axisLeft(y).ticks(5)
var xAxis = d3.axisBottom(x).ticks(5)

var svg = d3.select('#graph').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var tooltip = svg.append("g")
  .attr("class", "tooltip")

tooltip.append('text')
  .attr('x', x(2))
  .attr('y', y(1.8))
  .text('Current selection:')

d3.csv("./boomerang.csv", (err, data) => {
  data.forEach(row => {
    row.x = +row.x
    row.y = +row.y
    nn.activate([0,1])
    nn.propagate(learningRate, [row.label])
  })

  svg.selectAll('dot')
    .data(data).enter()
    .append('circle')
    .attr('r', 5)
    .attr('cx', d => x(d.x))
    .attr('cy', d => y(d.y))
    .attr('fill', d => d.label == 'upper' ? '#f00' : '#0f0')
    .on("mouseover", showTooltip)

  // Add the axes
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)

})


function showTooltip(pt) {
  svg.select('.tooltip').remove()
  svg.append("text")
    .attr('x', x(2))
    .attr('y', y(1.8))
    .attr('class', 'tooltip')
    .style('z-index', '-1')
    .text(
      "Current selection: " +
      pt.x.toPrecision(3) + ", " +
      pt.y.toPrecision(3)
    )
}

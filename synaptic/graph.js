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

var color = (col) => col == 1 ? '#f00' : '#0f0'
var label = (col) => col == 'upper' ? 1 : 0

var yAxis = d3.axisLeft(y).ticks(5)
var xAxis = d3.axisBottom(x).ticks(5)

var svg = d3.select('#graph').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

d3.csv("./boomerang.csv", (err, data) => {
  data.forEach(row => {
    row.x = +row.x
    row.y = +row.y
    row.label = label(row.label)
    console.log(row);
    nn.activate([row.x, row.y])
    nn.propagate(learningRate, [row.label])
  })

  var w_tiles = Math.round(width / 10)
  var h_tiles = Math.round(height / 10)
  for(var row = 0; row < w_tiles; row ++) {
    for(var col = 0; col < h_tiles; col ++) {
      const cx = row * 10 + 5
      const cy = col * 10 + 5
      svg.append('rect')
        .attr('x', row * 10)
        .attr('y', col * 10)
        .attr("width", 10)
        .attr("height", 10)
        .attr('fill', '#111')
        .style('fill-opacity', nn.activate([x(cx), y(cy)])[0] )
    }
  }

  svg.selectAll('dot')
    .data(data).enter()
    .append('circle')
    .attr('r', 5)
    .attr('cx', d => x(d.x))
    .attr('cy', d => y(d.y))
    .attr('fill', d => color(d.label))
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
  svg.select('.highlight').remove()

  svg.append("text")
    .attr('x', x(2))
    .attr('y', y(1.8))
    .attr('class', 'tooltip')
    .attr('fill', color(pt.label))
    .text(
      "Current selection: " +
      pt.x.toPrecision(3) + ", " +
      pt.y.toPrecision(3)
    )

  svg.append('circle')
    .attr('cx', x(pt.x))
    .attr('cy', y(pt.y))
    .attr('r', 5)
    .attr('stroke',  '#000')
    .attr('fill', "none")
    .attr('class', 'highlight')
}

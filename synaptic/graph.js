// Neural Net

var layer_defs = [];
layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:2});
layer_defs.push({type:'fc', num_neurons:6, activation: 'tanh'});
layer_defs.push({type:'fc', num_neurons:2, activation: 'tanh'});
layer_defs.push({type:'softmax', num_classes:2});

var net = new convnetjs.Net();
net.makeLayers(layer_defs);

var trainer = new convnetjs.SGDTrainer(net, {learning_rate:0.01, momentum:0.1, batch_size:10, l2_decay:0.001});

var iteration = 0
function train(data) {
  var x = new convnetjs.Vol(1,1,2);
  data.forEach(row => {
    x.w = [row.x, row.y]
    trainer.train(x, row.label)
  })

  console.log("Generation " + ++iteration)
}

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
  .style('position', 'absoloute')
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

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

function guessPoint() {
  d3.event.stopPropagation();
  var coords = d3.mouse(this)
  coords = [x.invert(coords[0]), y.invert(coords[1])]
  const guess = new convnetjs.Vol(coords)

  var probability_volume = net.forward(guess);
  console.log(probability_volume.w);
}

d3.csv("./boomerang.csv", (err, data) => {
  data.forEach(row => {
    row.x = +row.x
    row.y = +row.y
    row.label = label(row.label)
  })

  svg.selectAll('dot')
    .data(data).enter()
    .append('circle')
    .attr('r', 5)
    .attr('cx', d => x(d.x))
    .attr('cy', d => y(d.y))
    .attr('fill', d => color(d.label))
    .on('mouseover', showTooltip)

  // Add the axes
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)

  d3.select('#graph').on('click', guessPoint)

  setInterval(train, 1000, data)
})

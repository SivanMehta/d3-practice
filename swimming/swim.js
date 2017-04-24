const margin = {top: 20, right: 20, bottom: 60, left: 40}
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

function showToolTip(pt) {
  const left = x(pt.date) < width / 2
  svg.append('text')
    .text(_ => pt.swimmerID)
    .attr('x', x(pt.date) + (left ? -10 : 10))
    .attr('y', y(pt.points))
    .attr('text-anchor', left ? 'start' : 'end')
    .attr('class', 'tooltip')
    .text(pt.swimmerID + " " + pt.time + " " + pt.event)
}

function removeToolTip(pt) {
  svg.select('.tooltip').remove()
}

function cleanData (d) {
  // convert to numbers
  d.points = +d.points
  d.season = +d.season

  // because we're seeing everything at once, put everything
  // on the same year
  var parsedDate = d3.timeParse("%Y-%m-%d")(d.date)
  const diff = 2016 - d.season
  const offset = parsedDate.getMonth() < 5 ? 1 : 0
  d.date = parsedDate.setFullYear(d.season + diff + offset)
}

// setup events
var dispatch = d3.dispatch("start", "facet")

d3.request("cmu.csv")
  .mimeType("text/plain")
  .response(xhr => psv.parse(xhr.responseText))
  .get(data => {
    dispatch.call('start', this, data)
  })

// rendering the data
dispatch.on('start', data => {
  // clean data appropriately
  data.forEach(cleanData)

  // Scale the range of the data
  var xRange = d3.extent(data, d => d.date)
  x.domain([
    // use "10 days" worth of padding
    xRange[0] - 1000 * 60 * 60 * 24 * 10,
    xRange[1] + 1000 * 60 * 60 * 24 * 10
  ])
  y.domain([
    d3.min(data, d => d.points ) * .9,
    d3.max(data, d => d.points ) * 1.1
  ])

  // render all the dots
  svg.selectAll("dot")
    .data(data).enter()
    .append("circle")
    .filter(d => !isNaN(d.points))
    .attr("r", 5)
    .attr("cx", d => x(d.date))
    .attr("cy", d => y(d.points))
    .attr('fill', '#BDBDBD')
    .attr('opacity', '.3')
    .attr('swimmer', d => d.swimmerID)
    .on("mouseover", showToolTip)
    .on("mouseout", removeToolTip);

  // Add the X Axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)

  // Add the Y Axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)

  // render the drop down menu
  var ids = new Set()
  data.map(d => ids.add(d.swimmerID))
  ids = [...ids].sort()
  var facet = d3.select('#facet')
  facet.selectAll("option")
    .data([...ids]).enter()
    .append("option")
      .attr('value', (d, i) => d)
      .text((d, i) => d)

  facet.on('change', _ => dispatch.call('facet'))
})

// highlight specific swimmers
dispatch.on('facet', _ => {
  const value = d3.select("#facet").property('value')
  if(value > 0) {
    svg.selectAll("circle[swimmer = '" + value + "']")
      .attr('fill', '#FF0000')
      .attr('opacity', '1')
    svg.selectAll("circle:not([swimmer = '" + value + "'])")
      .attr('opacity', '.1')
      .attr('fill', '#BDBDBD')
  } else {
    svg.selectAll('circle')
      .attr('opacity', '.3')
      .attr('fill', '#BDBDBD')
  }
})

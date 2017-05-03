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
  svg.append("text")
    .text(_ => pt.swimmerID)
    .attr('x', x(pt.date) + (left ? -10 : 10))
    .attr('y', y(pt.points))
    .attr('text-anchor', left ? 'start' : 'end')
    .attr('class', 'tooltip')
    .style('z-index', '-1')
    .text(pt.time + " " + pt.event)
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
    start(data)
  })

// rendering the data
function start(data) {
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
    300, // d3.min(data, d => d.points ) * .9,
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
    .style('z-index', '0')
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

  facet.on('change', change)
}

// highlight specific swimmers
function change() {
  const value = d3.select("#facet").property('value')
  if(value > 0) {
    // make desired swims more visible
    svg.selectAll("circle[swimmer = '" + value + "']")
      .on("mouseover", showToolTip)
      .each(function() {
        this.parentNode.appendChild(this)
      })
      .transition(1000)
      .style("fill", "#FF0000")
      .style('opacity', '1')

    // diminish undesired swims
    svg.selectAll("circle:not([swimmer = '" + value + "'])")
      .on("mouseover", null)
      .transition(1000)
      .style("fill", "#BDBDBD")
      .style('opacity', '.1')

    window.document.title = "Highlighting " + value

  } else {
    // reset to default otherwise
    svg.selectAll('circle')
      .on("mouseover", showToolTip)
      .transition(1000)
      .style("fill", "#BDBDBD")
      .style('opacity', '.3')

    window.document.title = "Swim Graphs"
  }
}

results = [
  {
    "name": "John Winston",
    "url": "/swimmer/209958",
    "photo": null,
    "source": "Swimmers",
    "text": "John Winston\n \n",
    "location": "USA",
    "team": "Darton College",
    "name_auto": "John Winston\n \n",
    "id": "sdif.swimmer.209958"
  }, {
    "name": "Winston Stagg",
    "url": "/swimmer/15667",
    "photo": null,
    "source": "Swimmers",
    "text": "Winston Stagg\n \n",
    "location": "USA",
    "team": "Washington and Lee University",
    "name_auto": "Winston Stagg\n \n",
    "id": "sdif.swimmer.15667"
  }, {
    "name": "Winston Chu",
    "url": "/swimmer/136972",
    "photo": null,
    "source": "Swimmers",
    "text": "Winston Chu\nFL Florida\nGainesville",
    "location": "Gainesville, FL",
    "team": "Eastside High School",
    "name_auto": "Winston Chu\nFL Florida\nGainesville",
    "id": "sdif.swimmer.136972"
  }
]

var delayTimer
function doSearch() {
    clearTimeout(delayTimer)
    delayTimer = setTimeout(_ => search(query.value), 1000)

    return false
}

function search(query) {
  // fetch("https://www.collegeswimming.com/api/search/?q=" + query, {
  //     // mode: 'no-cors',
  //     credentials: 'include',
  //     headers: {
  //       'Access-Control-Allow-Origin':'*',
  //       Referer: 'https://www.collegeswimming.com/',
  //       Accept: '*/*',
  //       Host: 'www.collegeswimming.com',
  //       'X-Requested-With': 'XMLHttpRequest'
  //     }
  //   })
  //   .then(data => {
  //     console.log(data)
  //   })
  // d3.select("#query-results").selectAll('li')
  //   .data(results).enter()
  //   .append('li')
  //   .text(d => d.name + " - " + (d.id.split('.')[2]))
  //   .attr('class', 'list-group-item')

  console.log(query)
}

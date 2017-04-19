function gridData(rows = 10, cols = 10) {
  var data = new Array()
  for (var i = 0; i < rows * cols; i++) {
    const row = Math.floor(i / cols)
    const col = i % cols
      data.push({
        row,
        col,
        posX: col * cellWidth,
        posY: row * cellHeight,
        width: cellWidth,
        height: cellHeight,
        active: Math.random() > .5,
      })
  }
  return data
}

// populate grid data
const numRows = 50
const numCols = 50
const gridHeight = 500
const gridWidth = 500
const cellWidth = gridWidth / numCols
const cellHeight = gridHeight / numRows
var gridCells = gridData(numRows, numCols)

// define directions
const dirs = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
]

function getNeighbors (x, y, dataset) {
  return dirs.reduce((prev, dir) => {
    var isActive = false
    const dx = dir[0]
    const dy = dir[1]
    const index =  (x + dx) * numCols + (y + dy)
    if(x + dx >= 0 &&
       y + dy >= 0 &&
       y + dy < numRows &&
       x + dx < numCols) {
      try {
        isActive = isActive || dataset[index].active
      } catch(e) {
        isActive = false
      }
    }
    return prev + isActive
  }, 0)
}

gridCells.forEach((cell, i) => {
  gridCells[i].neighbors = getNeighbors(cell.row, cell.col, gridCells)
})

// initialize grid
var grid = d3.select("#life")
  .append("svg")
  .attr("width", (gridWidth + 10) + "px")
  .attr("height", (gridHeight + 10) + "px")

/*
 may be you can move the computation to a server than generates the frames
 ALOT of parallel processing, only to have the frames streamed to the browser?

 That is the fast way of doing, pretty much "pre-rendering" the video
*/

var generation = 1
function animate(data) {
  console.log('here')
  d3.selectAll('rect').remove()

  // create each square
  grid.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("class", "square")
    .attr("x", d => d.posX)
    .attr("y", d => d.posY)
    .attr('active', d => d.active)
    .attr("width", d => d.width)
    .attr("height", d => d.height)
    .style("fill", "#fff")
    .style("stroke-width", 0)
    .style("stroke", "#000")
    .filter((d, i) => d.active)
      .style("fill", "#888")

  d3.select('#generations').text(Math.floor(generation / 2))

  async.map(data, (cell, done) => {
    // update active status based on number of neighbors
    var updatedCell = Object.assign({}, cell)
    if(cell.active) {
      if(cell.neighbors < 2 || cell.neighbors > 3) {
        updatedCell.active = false
      }
    } else {
      if(cell.neighbors == 3) {
        updatedCell.active = true
      }
    }
    // update number of neighbors with active surroundings
    updatedCell.neighbors = getNeighbors(cell.row, cell.col, data)
    done(null, updatedCell)
  }, (err, updatedCells) => {
    generation ++
    setTimeout(animate, 1, updatedCells)
  })
}

animate(gridCells)

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
const numRows = 30
const numCols = 30
const gridHeight = 900
const gridWidth = 900
const cellWidth = gridWidth / numCols
const cellHeight = gridHeight / numRows
var gridCells = gridData(numRows, numCols)

// define directions
const dirs = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
]

function getNeighbors (x, y) {
  const neighbors =  dirs.reduce((prev, dir) => {
    var isActive = false
    const dx = dir[0]
    const dy = dir[1]
    const index =  (x + dx) * numCols + (y + dy)
    if(x + dx >= 0 &&
       y + dy >= 0 &&
       y + dy < numRows &&
       x + dx < numCols) {
      try {
        isActive = isActive || gridCells[index].active
      } catch(e) {
        isActive = false
      }
      // isActive = true
    }
    return prev + isActive
  }, 0)
  // state[x * numCols + y].neighbors = neighbors
  return neighbors
}

gridCells.forEach((cell, i) => {
  gridCells[i].neighbors = getNeighbors(cell.row, cell.col)
})

// initialize grid
var grid = d3.select("#life")
  .append("svg")
  .attr("width", (gridWidth + 10) + "px")
  .attr("height", (gridHeight + 10) + "px")

// create each square
grid.selectAll("rect")
  .data(gridCells)
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

// fill active squares
d3.selectAll(".square")
  .filter((d, i) => d.active)
  .style("fill", "#888")

// overlay number of neighbors
grid.selectAll('text')
  .data(gridCells)
  .enter().append('text')
  .attr("x", d => d.posX + cellWidth*.5)
  .attr("y", d => d.posY + cellHeight*.5)
  .attr('text-anchor', 'middle')
  .text(d => getNeighbors(d.row, d.col))

var generation = 1
function animate () {
  console.log(generation ++)

  setTimeout(animate, 1000)
}

animate()

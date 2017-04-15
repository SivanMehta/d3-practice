function gridData(rows = 10, cols = 10, width = 100, height = 100) {
  const cellWidth = width / cols
  const cellHeight = height / rows
  var data = new Array()
  for (var row = 0; row < rows; row++) {
    data.push( new Array() )
    for (var col = 0; col < cols; col++) {
      data[row].push({
        row,
        col,
        posX: col * cellWidth + 1,
        posY: row * cellHeight + 1,
        width: cellWidth,
        height: cellHeight,
        active: Math.random() > .5
      })
    }
  }
  return data
}

// populate grid data
const numRows = 10
const numCols = 10
const gridHeight = 500
const gridWidth = 500
var gridData = gridData(numRows, numCols, gridWidth, gridHeight)

// initialize grid
var grid = d3.select("#life")
  .append("svg")
  .attr("width", (gridWidth + 10) + "px")
  .attr("height", (gridHeight + 10) + "px")

// create each row
var row = grid.selectAll(".row")
  .data(gridData)
  .enter().append("g")
  .attr("class", "row")

function fillSquares () {
  // create each square
  row.selectAll(".square")
    .data(d => d)
    .enter().append("rect")
    .attr("class", "square")
    .attr("x", d => d.posX)
    .attr("y", d => d.posY)
    .attr("width", d => d.width)
    .attr("height", d => d.height)
    .style("fill", "#fff")
    .style("stroke-width", 0)

  // color active cells
  d3.selectAll(".square")
    .filter((d, i) => d.active)
    .style("fill", "#888")
}

fillSquares()

function animate () {
  // define directions
  const dirs = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0],           [1, 0],
    [-1, 1],  [0, 1],  [1, 1],
  ]

  function getNeighbors (x, y) {
    return dirs.reduce((prev, dir) => {
      var isActive = false
      try {
        isActive = isActive || gridData[x + dir[0]][y + dir[1]].active
      } catch(e) { }
      return prev + isActive
    }, 0)
  }

  d3.selectAll(".square")
    .attr("neighbors", d => getNeighbors(d.row, d.col))
}

animate()

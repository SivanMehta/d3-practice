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
        active: Math.random() > .9
      })
    }
  }
  return data
}

// populate grid data
const numRows = 100
const numCols = 100
const gridHeight = 750
const gridWidth = 750
var state = gridData(numRows, numCols, gridWidth, gridHeight)

// there has to be a more efficient way than just redrawing
// everything possible
function redrawAll (gridData) {
  d3.select("svg").remove();
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
    .style("stroke", "#000")

  // fill active squares
  d3.selectAll(".square")
    .filter((d, i) => d.active)
    .style("fill", "#888")
}

function animate () {
  redrawAll(state)
  // define directions
  const dirs = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0],           [1, 0],
    [-1, 1],  [0, 1],  [1, 1],
  ]

  var nextState = state.slice()

  function getNeighbors (x, y) {
    return dirs.reduce((prev, dir) => {
      var isActive = false
      try {
        isActive = isActive || state[x + dir[0]][y + dir[1]].active
      } catch(e) { }
      return prev + isActive
    }, 0)
  }

  for(var row = 0; row < state.length; row++) {
    for(var col = 0; col < state[0].length; col++) {
      alive = nextState[row][col].active
      neighbors = getNeighbors(row, col)
      if(alive && neighbors < 2) {
        nextState[row][col].active = false
      } else if (alive && [2,3].indexOf(neighbors) >= 0) {
        nextState[row][col].active = true
      } else if (alive && neighbors > 3) {
        nextState[row][col].active = false
      } else if (!alive && neighbors == 3) {
        nextState[row][col].active = true
      }
    }
  }

  state = nextState

  setTimeout(animate, 100)
}

animate()

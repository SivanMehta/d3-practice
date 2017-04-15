function gridData(rows = 10, cols = 10, width = 100, height = 100) {
  const cellWidth = width / cols
  const cellHeight = height / rows
  var data = new Array()
  for (var row = 0; row < rows; row++) {
    data.push( new Array() )
    for (var col = 0; col < cols; col++) {
      data[row].push({
        x: col * cellWidth + 1,
        y: row * cellHeight + 1,
        width: cellWidth,
        height: cellHeight
      })
    }
  }
  return data
}

// populate grid data
const numRows = 25
const numCols = 25
const gridHeight = window.innerHeight - 20
const gridWidth = window.innerWidth - 20
var data = gridData(numRows, numCols, gridWidth, gridHeight)

// initialize grid
var grid = d3.select("#life")
  .append("svg")
  .attr("width", (gridWidth + 10) + "px")
  .attr("height", (gridHeight + 10) + "px")

// create each row
var row = grid.selectAll(".row")
  .data(data)
  .enter().append("g")
  .attr("class", "row")

// create each column
var column = row.selectAll(".square")
  .data(d => d)
  .enter().append("rect")
  .attr("class", "square")
  .attr("x", d => d.x)
  .attr("y", d => d.y)
  .attr("width", d => d.width)
  .attr("height", d => d.height)
  .style("fill", "#fff")
  .style("stroke", "#000")

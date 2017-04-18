class Minesweeper {
  constructor(width, height, mines) {
    this.width = width
    this.height = height
    this.mines = mines

    this.grid = d3.select("#sweep")
      .append("svg")
      .attr("width", (window.innerWidth + 10) + "px")
      .attr("height", (window.innerHeight + 10) + "px")
      .attr("class", "minesweeper")

  }

  render() {
    const cellWidth = (window.innerWidth - 20) / this.width

    this.grid.selectAll('.cell')
      .data(this.cells).enter().append('rect')
      .attr('class', 'cell')
      .attr('x', c => c.col * cellWidth)
      .attr('y', c => c.row * cellWidth)
      .attr('width', cellWidth)
      .attr('height', cellWidth)
      .style('fill', "#000")
      .style('stroke', '#000')
      .on('click', function (cell) {
        console.log(cell)

        var color = cell.value < 0 ? "#f00" : getColor(cell.value)
        color = cell.value == 0 ? "#fff" : color

        // color in the cell and remove click handler
        d3.select(this)
          .style("fill", color)
          .on('click', null)
        // add the appropriate text
        d3.select("#sweep svg").append('text')
          .attr('x', _ => cell.col * cellWidth + cellWidth * .5)
          .attr('y', _ => cell.row * cellWidth + cellWidth * .5)
          .attr('text-anchor', 'middle')
          .attr('fill', '#000')
          .text(_ => cell.value)
      })
  }
}

const width = 20
const height = 10
mines = 30

var game = new Minesweeper(width, height, 5)
game.cells = Array()

for(var i = 0; i < width * height; i ++) {
  game.cells.push({
    row: Math.floor(i / width),
    col: i % width,
    value: 0,
    revealed: false,
    flagged: false
  })
}

var mineIncedes = [...Array(width*height).keys()]
mineIncedes = mineIncedes.sort((a, b) => (0.5 - Math.random()))
mineIncedes = mineIncedes.slice(0, mines)

mineIncedes.forEach(index => {
  game.cells[index].value = -1
})

function surroundingBombs (cell, i, board) {
  const row = cell.row
  const col = cell.col
  const dirs = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0],           [1, 0],
    [-1, 1],  [0, 1],  [1, 1],
  ]

  const bombs = dirs.reduce((prev, cur) => {
    const dx = cur[0]
    const dy = cur[1]
    const index = (row + dy) * width + col + dx
    var isBomb = 0
    try {
      isBomb += board[index].value == -1 ? 1 :0
    } catch (e) { }
    return prev + isBomb
  }, 0)

  return bombs
}

function getColor(value) {
  return "rgb(0,"+ (value * 32) + ",0)"
}

const bombCounts = game.cells.map(surroundingBombs)
game.cells.forEach((cell, i) => {
  cell.value = cell.value >= 0 ? bombCounts[i] : cell.value
})
game.render()

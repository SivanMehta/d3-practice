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

    this.grid.selectAll('rect')
      .data(this.cells).enter().append('rect')
      .attr('x', c => c.col * cellWidth)
      .attr('y', c => c.row * cellWidth)
      .attr('width', cellWidth)
      .attr('height', cellWidth)
      .style('fill', '#fff')
      .style('stroke', '#000')
  }
}

const width = 20
const height = 10

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

for(var mine = 0; mine < this.mines; mine ++) {
  game.cells[mine].value = -1
}

// shuffle around mines
game.cells.sort((a, b) => (0.5 - Math.random()))

game.render()

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
      .style('fill', c => c.value >= 0 ? '#fff' : "#f00")
      .style('stroke', '#000')
      .on('click', function(d) {
        console.log(d)
        d.clicks ++
        d3.select(this).style("fill", (d.clicks % 2 == 0) ? "#0f0" : "#0f0")
      })

    this.grid.selectAll('text')
      .data(this.cells).enter().append('text')
      .attr('x', c => c.col * cellWidth + cellWidth * .5)
      .attr('y', c => c.row * cellWidth + cellWidth * .5)
      .attr('text-anchor', 'middle')
      .text(c => c.value)

  }
}

const width = 20
const height = 10
mines = 10

var game = new Minesweeper(width, height, 5)
var cells = Array()

for(var i = 0; i < width * height; i ++) {
  cells.push({
    row: Math.floor(i / width),
    col: i % width,
    value: 0,
    clicks: 0,
    flagged: false
  })
}

var mineIncedes = [...Array(width*height).keys()]
mineIncedes = mineIncedes.sort((a, b) => (0.5 - Math.random()))
mineIncedes = mineIncedes.slice(0, mines)

mineIncedes.forEach(index => {
  cells[index].value = -1
})


// shuffle around mines
game.cells = cells.sort((a, b) => (0.5 - Math.random()))

game.render()

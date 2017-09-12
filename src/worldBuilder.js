function WorldBuilder(canvas) {
  this.canvas = canvas
  this.BLOCK_WIDTH = 16
  this.BLOCK_HEIGHT = 8
}

WorldBuilder.prototype.getGrid = function () {
  return this.grid
};

WorldBuilder.prototype.setGrid = function () {
  this.grid = []
  for (var i = 0; i < this.canvas.height / this.BLOCK_HEIGHT; i++) {
    this.grid.push(this.setRow())
  }
};

WorldBuilder.prototype.setRow = function () {
  var row = []
  for (var i = 0; i < this.canvas.width / this.BLOCK_WIDTH; i++) {
    row.push(0)
  }
  return row
};

export default class GoView
{
  constructor(w, h, canvas)
  {
    if(canvas === undefined){
      canvas = document.createElement("canvas");
    }

    this.colorsMap = {
      0:"black",
      1:"white",
    };
    this.stoneScale = 0.8;

    this.hMargin = 0.05 * w;
    this.vMargin = 0.05 * h;

    this.canvas = canvas;
    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx = this.canvas.getContext("2d");
  }


  render(game)
  {
    this.drawBoard(game);
    this.drawStones(game);
  }


  drawBoard(game)
  {
    this.ctx.fillStyle = "#f4d089";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    let colSize = (this.canvas.width - 2 * this.hMargin) / (game.width - 1);
    let rowSize = (this.canvas.height - 2 * this.vMargin) / (game.height - 1);
    this.ctx.beginPath();
    for(let i = 0; i < game.height; i++){
      let posY = this.vMargin + i * rowSize;
      this.ctx.moveTo(this.hMargin, posY);
      this.ctx.lineTo(this.canvas.width - this.hMargin, posY);
    }
    for(let i = 0; i < game.width; i++){
      let posX = this.hMargin + i * colSize;
      this.ctx.moveTo(posX, this.vMargin);
      this.ctx.lineTo(posX, this.canvas.height - this.vMargin);
    }
    this.ctx.strokeStyle = "black";
    this.ctx.stroke();
  }


  drawStones(game)
  {
    let colSize = (this.canvas.width - 2 * this.hMargin) / (game.width - 1);
    let rowSize = (this.canvas.height - 2 * this.vMargin) / (game.height - 1);
    let radius = 0.5 * this.stoneScale * Math.min(colSize, rowSize);

    for(let i = 0; i < game.height; i++){
      for(let j = 0; j < game.width; j++){
        let stone = game.stones[i][j];
        if(stone === undefined)continue;
        let posX = stone.x * colSize + this.hMargin;
        let posY = stone.y * rowSize + this.vMargin;
        this.ctx.beginPath();
        this.ctx.arc(posX, posY, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.colorsMap[stone.color];
        this.ctx.fill();
      }
    }
  }
}

import loadSGF from "./loadSGF";
import GoModel from "./GoModel";
import GoView from "./GoView";


let files = [
  "monday_tournament.sgf",
  "tuesday_tournament.sgf",
  "wednesday_tournament.sgf",
  "thursday_tournament.sgf",
  "friday_tournament.sgf"
];


class Main
{
  constructor()
  {
    loadSGF(`data/${files[1]}`).then(
      data => this.start(data)
    );
  }


  start(data)
  {
    this.data = data;
    this.game = new GoModel();

    this.view = new GoView(700, 700);
    document.body.appendChild(this.view.canvas);

    this.stoneId = 0;
    this.addStone();
  }


  addStone()
  {
    this.view.render(this.game);
    let stone = this.data[this.stoneId];
    this.game.addStone(stone.color, stone.x, stone.y);
    if(++this.stoneId < this.data.length){
      setTimeout(this.addStone.bind(this), 10);
    }
  }
}

new Main();

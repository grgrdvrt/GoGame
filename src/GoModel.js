export default class GoModel
{
  constructor(width = 19, height = 19)
  {
    this.width = width;
    this.height = height;
    this.stones = [];
    for(let i = 0; i < this.height; i++){
      this.stones[i] = [];
    }
    this.strings = [];
  }

  
  addStone(color, x, y)
  {
    let adjStrings = this.getAdjStrings(color, x, y);
    let string;
    if(adjStrings.length > 1){
      string = this.mergeStrings(adjStrings);
    }
    else if(adjStrings.length > 0){
      string = adjStrings[0];
    }
    else {
      string = [];
    }
    let stone = {
      color:color,
      x:x,
      y:y,
      string:string,
    };
    string.push(stone);
    this.stones[y][x] = stone;


    let oppositeStrings = this.getAdjStrings(1 - color, x, y);
    oppositeStrings.filter(
      string => !this.hasStringLiberties(string)
    ).forEach(
      string => this.removeString(string)
    );
  }


  getAdjStrings(color, x, y)
  {
    let strings = [];
    let addString = (x, y) => {
      if(x >= 0 && x < this.width && y >= 0 && y < this.height){
        let stone = this.stones[y][x];
        if(stone !== undefined && stone.color === color && strings.indexOf(stone.string) === -1){
          strings.push(stone.string);
        }
      }
    };
    addString(x - 1, y);
    addString(x + 1, y);
    addString(x, y - 1);
    addString(x, y + 1);
    return strings;
  }
  

  mergeStrings(strings)
  {
    let newString = strings[0];
    for(let i = 1, n = strings.length; i < n; i++){
      let string = strings[i];
      newString.push.apply(newString, string);
      this.strings.splice(this.strings.indexOf(string), 1);
    }
    newString.forEach(stone => stone.string = newString);
    return newString;
  }
  

  hasStringLiberties(string)
  {
    return string.filter(stone => this.hasStoneLiberties(stone)).length > 0;
  }

  
  hasStoneLiberties(stone)
  {
    return (
      (stone.x > 0 && this.stones[stone.y][stone.x - 1] === undefined) || 
      (stone.x < this.width - 1 && this.stones[stone.y][stone.x + 1] === undefined) || 
      (stone.y > 0 && this.stones[stone.y - 1][stone.x] === undefined) || 
      (stone.y < this.height - 1 && this.stones[stone.y + 1][stone.x] === undefined)
    );
  }


  removeString(string)
  {
    string.forEach(stone => {
      this.stones[stone.y][stone.x] = undefined;
    });
    this.strings.splice(this.strings.indexOf(string), 1);
  }
}

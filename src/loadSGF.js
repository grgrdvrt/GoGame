let colorsMap = {B:0, W:1};

export default function loadSGF(url)
{
  return window.fetch(url).then(result => {
    return result.text();
  }).then(str => {
    return str.split(";").slice(2).map(function(move){
      var data = move.split("");
      return {
        color : colorsMap[data[0]],
        x : data[2].charCodeAt(0) - 97,
        y : data[3].charCodeAt(0) - 97
      };
    });
  });
}

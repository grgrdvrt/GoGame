(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GoModel = (function () {
  function GoModel() {
    var width = arguments.length <= 0 || arguments[0] === undefined ? 19 : arguments[0];
    var height = arguments.length <= 1 || arguments[1] === undefined ? 19 : arguments[1];

    _classCallCheck(this, GoModel);

    this.width = width;
    this.height = height;
    this.stones = [];
    for (var i = 0; i < this.height; i++) {
      this.stones[i] = [];
    }
    this.strings = [];
  }

  _createClass(GoModel, [{
    key: "addStone",
    value: function addStone(color, x, y) {
      var _this = this;

      var adjStrings = this.getAdjStrings(color, x, y);
      var string = undefined;
      if (adjStrings.length > 1) {
        string = this.mergeStrings(adjStrings);
      } else if (adjStrings.length > 0) {
        string = adjStrings[0];
      } else {
        string = [];
      }
      var stone = {
        color: color,
        x: x,
        y: y,
        string: string
      };
      string.push(stone);
      this.stones[y][x] = stone;

      var oppositeStrings = this.getAdjStrings(1 - color, x, y);
      oppositeStrings.filter(function (string) {
        return !_this.hasStringLiberties(string);
      }).forEach(function (string) {
        return _this.removeString(string);
      });
    }
  }, {
    key: "getAdjStrings",
    value: function getAdjStrings(color, x, y) {
      var _this2 = this;

      var strings = [];
      var addString = function addString(x, y) {
        if (x >= 0 && x < _this2.width && y >= 0 && y < _this2.height) {
          var stone = _this2.stones[y][x];
          if (stone !== undefined && stone.color === color && strings.indexOf(stone.string) === -1) {
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
  }, {
    key: "mergeStrings",
    value: function mergeStrings(strings) {
      var newString = strings[0];
      for (var i = 1, n = strings.length; i < n; i++) {
        var string = strings[i];
        newString.push.apply(newString, string);
        this.strings.splice(this.strings.indexOf(string), 1);
      }
      newString.forEach(function (stone) {
        return stone.string = newString;
      });
      return newString;
    }
  }, {
    key: "hasStringLiberties",
    value: function hasStringLiberties(string) {
      var _this3 = this;

      return string.filter(function (stone) {
        return _this3.hasStoneLiberties(stone);
      }).length > 0;
    }
  }, {
    key: "hasStoneLiberties",
    value: function hasStoneLiberties(stone) {
      return stone.x > 0 && this.stones[stone.y][stone.x - 1] === undefined || stone.x < this.width - 1 && this.stones[stone.y][stone.x + 1] === undefined || stone.y > 0 && this.stones[stone.y - 1][stone.x] === undefined || stone.y < this.height - 1 && this.stones[stone.y + 1][stone.x] === undefined;
    }
  }, {
    key: "removeString",
    value: function removeString(string) {
      var _this4 = this;

      string.forEach(function (stone) {
        _this4.stones[stone.y][stone.x] = undefined;
      });
      this.strings.splice(this.strings.indexOf(string), 1);
    }
  }]);

  return GoModel;
})();

exports["default"] = GoModel;
module.exports = exports["default"];

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GoView = (function () {
  function GoView(w, h, canvas) {
    _classCallCheck(this, GoView);

    if (canvas === undefined) {
      canvas = document.createElement("canvas");
    }

    this.colorsMap = {
      0: "black",
      1: "white"
    };
    this.stoneScale = 0.8;

    this.hMargin = 0.05 * w;
    this.vMargin = 0.05 * h;

    this.canvas = canvas;
    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx = this.canvas.getContext("2d");
  }

  _createClass(GoView, [{
    key: "render",
    value: function render(game) {
      this.drawBoard(game);
      this.drawStones(game);
    }
  }, {
    key: "drawBoard",
    value: function drawBoard(game) {
      this.ctx.fillStyle = "#f4d089";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      var colSize = (this.canvas.width - 2 * this.hMargin) / (game.width - 1);
      var rowSize = (this.canvas.height - 2 * this.vMargin) / (game.height - 1);
      this.ctx.beginPath();
      for (var i = 0; i < game.height; i++) {
        var posY = this.vMargin + i * rowSize;
        this.ctx.moveTo(this.hMargin, posY);
        this.ctx.lineTo(this.canvas.width - this.hMargin, posY);
      }
      for (var i = 0; i < game.width; i++) {
        var posX = this.hMargin + i * colSize;
        this.ctx.moveTo(posX, this.vMargin);
        this.ctx.lineTo(posX, this.canvas.height - this.vMargin);
      }
      this.ctx.strokeStyle = "black";
      this.ctx.stroke();
    }
  }, {
    key: "drawStones",
    value: function drawStones(game) {
      var colSize = (this.canvas.width - 2 * this.hMargin) / (game.width - 1);
      var rowSize = (this.canvas.height - 2 * this.vMargin) / (game.height - 1);
      var radius = 0.5 * this.stoneScale * Math.min(colSize, rowSize);

      for (var i = 0; i < game.height; i++) {
        for (var j = 0; j < game.width; j++) {
          var stone = game.stones[i][j];
          if (stone === undefined) continue;
          var posX = stone.x * colSize + this.hMargin;
          var posY = stone.y * rowSize + this.vMargin;
          this.ctx.beginPath();
          this.ctx.arc(posX, posY, radius, 0, 2 * Math.PI);
          this.ctx.fillStyle = this.colorsMap[stone.color];
          this.ctx.fill();
        }
      }
    }
  }]);

  return GoView;
})();

exports["default"] = GoView;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _loadSGF = require("./loadSGF");

var _loadSGF2 = _interopRequireDefault(_loadSGF);

var _GoModel = require("./GoModel");

var _GoModel2 = _interopRequireDefault(_GoModel);

var _GoView = require("./GoView");

var _GoView2 = _interopRequireDefault(_GoView);

var files = ["monday_tournament.sgf", "tuesday_tournament.sgf", "wednesday_tournament.sgf", "thursday_tournament.sgf", "friday_tournament.sgf"];

var Main = (function () {
  function Main() {
    var _this = this;

    _classCallCheck(this, Main);

    (0, _loadSGF2["default"])("data/" + files[1]).then(function (data) {
      return _this.start(data);
    });
  }

  _createClass(Main, [{
    key: "start",
    value: function start(data) {
      this.data = data;
      this.game = new _GoModel2["default"]();

      this.view = new _GoView2["default"](700, 700);
      document.body.appendChild(this.view.canvas);

      this.stoneId = 0;
      this.addStone();
    }
  }, {
    key: "addStone",
    value: function addStone() {
      this.view.render(this.game);
      var stone = this.data[this.stoneId];
      this.game.addStone(stone.color, stone.x, stone.y);
      if (++this.stoneId < this.data.length) {
        setTimeout(this.addStone.bind(this), 10);
      }
    }
  }]);

  return Main;
})();

new Main();

},{"./GoModel":1,"./GoView":2,"./loadSGF":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = loadSGF;
var colorsMap = { B: 0, W: 1 };

function loadSGF(url) {
  return window.fetch(url).then(function (result) {
    return result.text();
  }).then(function (str) {
    return str.split(";").slice(2).map(function (move) {
      var data = move.split("");
      return {
        color: colorsMap[data[0]],
        x: data[2].charCodeAt(0) - 97,
        y: data[3].charCodeAt(0) - 97
      };
    });
  });
}

module.exports = exports["default"];

},{}]},{},[3]);

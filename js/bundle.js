/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const HanoiGame = __webpack_require__(1);
	const HanoiView = __webpack_require__(2);

	$( () => {
	  const rootEl = $('.towers');
	  const game = new HanoiGame();
	  new HanoiView(game, rootEl);
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	class Game {
	  constructor() {
	    this.towers = [[3, 2, 1], [], []];
	  }

	  isValidMove(startTowerIdx, endTowerIdx) {
	      const startTower = this.towers[startTowerIdx];
	      const endTower = this.towers[endTowerIdx];

	      if (startTower.length === 0) {
	        return false;
	      } else if (endTower.length == 0) {
	        return true;
	      } else {
	        const topStartDisc = startTower[startTower.length - 1];
	        const topEndDisc = endTower[endTower.length - 1];
	        return topStartDisc < topEndDisc;
	      }
	  }

	  isWon() {
	      // move all the discs to the last or second tower
	      return (this.towers[2].length == 3) || (this.towers[1].length == 3);
	  }

	  move(startTowerIdx, endTowerIdx) {
	      if (this.isValidMove(startTowerIdx, endTowerIdx)) {
	        this.towers[endTowerIdx].push(this.towers[startTowerIdx].pop());
	        return true;
	      } else {
	        return false;
	      }
	  }

	  print() {
	      console.log(JSON.stringify(this.towers));
	  }

	  promptMove(reader, callback) {
	      this.print();
	      reader.question("Enter a starting tower: ", start => {
	        const startTowerIdx = parseInt(start);
	        reader.question("Enter an ending tower: ", end => {
	          const endTowerIdx = parseInt(end);
	          callback(startTowerIdx, endTowerIdx)
	        });
	      });
	  }

	  run(reader, gameCompletionCallback) {
	      this.promptMove(reader, (startTowerIdx, endTowerIdx) => {
	        if (!this.move(startTowerIdx, endTowerIdx)) {
	          console.log("Invalid move!");
	        }

	        if (!this.isWon()) {
	          // Continue to play!
	          this.run(reader, gameCompletionCallback);
	        } else {
	          this.print();
	          console.log("You win!");
	          gameCompletionCallback();
	        }
	      });
	  }
	}

	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports) {

	var View = function View(game, $el) {
	  this.game = game;
	  this.$el = $el;
	  this.firstMove = true;
	  this.startIdx = null;

	  this.setupTowers();
	  this.bindEvents();
	};

	View.prototype.bindEvents = function () {
	  let $towers = $("ul");
	  let thisView = this;

	  $towers.on("click", (event) => {
	    // debugger;
	    event.preventDefault();
	    let $currentTarget = $(event.currentTarget);

	    if (thisView.firstMove) {
	      thisView.firstMove = false;
	      thisView.startIdx = $currentTarget.attr("id");
	    }
	    else {
	      thisView.makeMove($currentTarget);
	      thisView.firstMove = true;
	      thisView.startIdx = null;
	    }
	  });
	};

	View.prototype.makeMove = function ($tower) {
	  let endIdx = $tower.attr("id");
	  let thisView = this;
	  let startIdx = parseInt(thisView.startIdx) - 1;
	  endIdx = parseInt(endIdx) - 1;
	  thisView.game.move(startIdx, endIdx);
	  thisView.setupTowers();

	  if (thisView.game.isWon()) {
	    let $body = $('body');
	    let $winner = $(`<h2>You Won!</h2>`);
	    $body.append($winner);
	  } else {
	    this.bindEvents();
	  }
	};

	View.prototype.setupTowers = function () {
	  let $ul = $("ul");
	  $ul.remove();

	  let $tower1 = $("<ul class='tower' id='1'></ul>");
	  let $tower2 = $("<ul class='tower' id='2'></ul>");
	  let $tower3 = $("<ul class='tower' id='3'></ul>");

	  let $ring1 = $("<li class='ring1' id='1'></li>");
	  let $ring2 = $("<li class='ring2' id='2'></li>");
	  let $ring3 = $("<li class='ring3' id='3'></li>");
	  let rings = [$ring1, $ring2, $ring3];
	  let towers = [$tower1, $tower2, $tower3];

	  this.$el.append($tower1);
	  this.$el.append($tower2);
	  this.$el.append($tower3);

	  this.game.towers.forEach((tower, towerIdx) => {
	    let towerDup = tower.slice(0);
	    towerDup.forEach((ringIdx) => {
	      let $currentRing;
	      rings.forEach(ringEl => {
	        let $ringEl = $(ringEl);
	        if ($ringEl.attr("id") === `${ringIdx}`) {
	          $currentRing = $ringEl;
	        }
	      });

	      let $currentTower;
	      towers.forEach(towerEl => {
	        let $towerEl = $(towerEl);
	        if ($towerEl.attr("id") === `${towerIdx + 1}`) {
	          $currentTower = $towerEl;
	        }
	      });
	      $currentTower.append($currentRing);
	    });
	  });

	};

	module.exports = View;


/***/ }
/******/ ]);
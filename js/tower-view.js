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

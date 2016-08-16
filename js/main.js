const HanoiGame = require('./game.js');
const HanoiView = require('./tower-view.js');

$( () => {
  const rootEl = $('.towers');
  const game = new HanoiGame();
  new HanoiView(game, rootEl);
});

$(() => {
  const state = {
    iddle: 0,
    started: 0,
    gameOver: 0,
  };
  const actionType = {
    newGame: 0,
    holdScore: 1,
    rollDice: 2,
    winGame: 3,
  };

  const game = {
    currentPlayer: undefined,
    gameStatus: state.iddle,
    winner: undefined,
    scores: [
      {
        currentScore: 0,
        globalScore: 0,
      },
      {
        currentScore: 0,
        globalScore: 0,
      },
    ],
  };
  //------------------------------------
  // get all element references we need
  //------------------------------------
  const btNew = $('#new-game');
  const btRoll = $('#roll-dice');
  const btHold = $('#hold-score');

  const elemRef = [
    {
      globalScore: $('#player1 .player-global-score'),
      currentScore: $('#player1 .player-current-score'),
      playerDisplay: $('#player1'),
    },
    {
      globalScore: $('#player2 .player-global-score'),
      currentScore: $('#player2 .player-current-score'),
      playerDisplay: $('#player2'),
    },
  ];
  const dice = $('#dice');

  //--------------------------------
  // setup event functions callback
  //--------------------------------
  btNew.on('click', (e) => {
    e.preventDefault();
    manageGame(actionType.newGame);
  });
  btRoll.on('click', (e) => {
    e.preventDefault();
    manageGame(actionType.rollDice);
  });
  btHold.on('click', (e) => {
    e.preventDefault();
    manageGame(actionType.holdScore);
  });

  //--------------------------------
  // display Dice
  //--------------------------------

  function drawDice(value) {
    const diceConfig = [
      // 1
      [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ], // 2
      [
        [1, 0, 0],
        [0, 0, 0],
        [0, 0, 1],
      ], // 3
      [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ], // 4
      [
        [1, 0, 1],
        [0, 0, 0],
        [1, 0, 1],
      ], // 5
      [
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 1],
      ], // 6
      [
        [1, 0, 1],
        [1, 0, 1],
        [1, 0, 1],
      ],
    ];

    const ctx = dice.get(0).getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 88, 88);
    ctx.fillStyle = '#000000';

    const currentConfig = diceConfig[value - 1];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (currentConfig[r][c] === 1) {
          ctx.save();
          ctx.translate(22 + c * 22, 22 + r * 22);
          ctx.beginPath();
          ctx.arc(0, 0, 10, 0, 2 * Math.PI);
          ctx.fill();
          ctx.restore();
        }
      }
    }
  }

  //----------------------------------
  // set and display functions
  //----------------------------------
  const setGlobalScore = (player, score) => {
    game.scores[player].globalScore = score;
    elemRef[player].globalScore.text(String(score));
  };
  const setCurrentScore = (player, score) => {
    game.scores[player].currentScore = score;
    elemRef[player].currentScore.text(String(score));
  };
  const setCurrentPlayer = (player) => {
    game.currentPlayer = player;
    if (!elemRef[player].playerDisplay.hasClass('current')) {
      elemRef[player].playerDisplay.addClass('current');
    }
    const otherPlayer = player === 0 ? 1 : 0;
    if (elemRef[otherPlayer].playerDisplay.hasClass('current')) {
      elemRef[otherPlayer].playerDisplay.removeClass('current');
    }
    elemRef[player].playerDisplay.addClass('current)');
  };
  const setGameStatus = (status) => {
    game.gameStatus = status;
  };

  const manageGame = (action) => {
    switch (action) {
      case actionType.newGame:
        setGameStatus(state.started);
        setGlobalScore(0, 0);
        setGlobalScore(1, 0);
        setCurrentScore(0, 0);
        setCurrentScore(1, 0);
        setCurrentPlayer(Math.floor(Math.random() * 100) + 1 > 50 ? 1 : 0);
        btHold.prop('disabled', false);
        btRoll.prop('disabled', false);
        break;
      case actionType.holdScore:
        setGlobalScore(game.currentPlayer, game.scores[game.currentPlayer].globalScore + game.scores[game.currentPlayer].currentScore);
        setCurrentScore(game.currentPlayer, 0);
        if (game.scores[game.currentPlayer].globalScore >= 100) {
          manageGame(actionType.winGame);
        } else {
          setCurrentPlayer(game.currentPlayer === 0 ? 1 : 0);
        }
        break;
      case actionType.rollDice:
        {
          const result = Math.floor(Math.random() * 6) + 1;
          drawDice(result);
          if (result === 1) {
            // loose on 1 => player change / no score added
            setCurrentScore(game.currentPlayer, 0);
            setCurrentPlayer(game.currentPlayer === 0 ? 1 : 0);
          } else {
            setCurrentScore(game.currentPlayer, game.scores[game.currentPlayer].currentScore + result);
          }
        }
        break;
      case actionType.winGame:
        btHold.prop('disabled', true);
        btRoll.prop('disabled', true);

        break;
    }
  };

  // start Game
  manageGame(actionType.newGame);
});

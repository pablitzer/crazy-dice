/*-----------------------------------------------------------------------------------------------------
Author : Pascal Ablitzer
Description : manage Dice Game
- Start a new Game with 2 players, choose randomly first player
- Roll Dice : simulate roll dice and add result to the current score if <> 1 else reset current score to 0 and Change player
- Hold Score : add current score  to global score and if player has not reached 100, change turn
- Win Game : player reached global score of 100, wait for new game
-------------------------------------------------------------------------------------------------------*/

$(() => {
  //------------------------------------
  // Initalize game status and constants
  //------------------------------------
  const state = {
    iddle: 0,
    started: 0,
    gameOver: 0,
  };
  const actionType = {
    newGame: 0,
    holdScore: 1,
    rollDice: 2,
    rollResult: 3,
    winGame: 4,
  };
  const player1 = 0;
  const player2 = 1;

  const game = {
    currentPlayer: undefined,
    gameStatus: state.iddle,
    rollResult: undefined,
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
  const messageBox = $('#message-box');

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
  // manage the display of the Dice
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
    ctx.fillStyle = dice.css('background-color');
    ctx.fillRect(0, 0, 88, 88);
    ctx.fillStyle = dice.css('color');

    const currentConfig = diceConfig[value - 1];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (currentConfig[r][c] === 1) {
          ctx.save();
          ctx.translate(22 + c * 22, 22 + r * 22);
          ctx.beginPath();
          ctx.arc(0, 0, 8, 0, 2 * Math.PI);
          ctx.fill();
          ctx.restore();
        }
      }
    }
  }
  //-------------------------------
  // manage and animate roll dice
  //-------------------------------
  const rollDice = (nextActionFunc) => {
    game.rollResult = Math.floor(Math.random() * 6) + 1;
    for (let i = 0; i < 10; i++) {
      dice.animate(
        {
          left: '+=10px',
        },
        30,
        'swing'
      );
      dice.animate(
        {
          left: '-=10px',
        },
        30,
        'swing'
      );
    }
    dice.animate(
      {
        left: '-=0px',
      },
      50,
      'swing',
      () => {
        dice.removeAttr('style'); // clean style added by animation
        dice.removeAttr('style'); // clean style added by animation

        // display result
        drawDice(game.rollResult);
        // execute next action if any
        nextActionFunc && nextActionFunc();
      }
    );
  };

  //----------------------------------
  // Display message
  //----------------------------------
  const displayMessage = (text) => {
    messageBox.text(text);
    messageBox.fadeIn(500).delay(1000).fadeOut(500);
  };

  //----------------------------------
  // Animate score increment
  //----------------------------------
  const animateScore = (elem, fromScore, addScore, cleanFunc) => {
    for (let i = 1; i <= addScore; i++) {
      elem.animate(
        { Counter: 0 },
        {
          duration: 300 / addScore,
          easing: 'swing',
          step: function () {
            elem.text(fromScore + i);
          },
        }
      );
    }
    elem.animate({ Counter: 0 }, 0, cleanFunc); // a last animation for running next action at the end
  };

  //----------------------------------
  // Disable / Enable actions
  //----------------------------------
  const disableActions = (rollDice = true, holdScore = true, newGame = true) => {
    holdScore && btHold.prop('disabled', true);
    rollDice && btRoll.prop('disabled', true);
    newGame && btNew.prop('disabled', true);
  };
  const enableActions = (rollDice = true, holdScore = true, newGame = true) => {
    holdScore && btHold.prop('disabled', false);
    rollDice && btRoll.prop('disabled', false);
    newGame && btNew.prop('disabled', false);
  };

  //----------------------------------
  // set and display functions
  //----------------------------------

  const setGlobalScore = (player, fromScore, addScore = 0, nextActionFunc) => {
    game.scores[player].globalScore = fromScore + addScore;
    if (addScore > 0) {
      animateScore(elemRef[player].globalScore, fromScore, addScore, nextActionFunc);
    } else {
      elemRef[player].globalScore.text(fromScore);
      nextActionFunc && nextActionFunc();
    }
  };
  const setCurrentScore = (player, fromScore, addScore = 0, nextActionFunc) => {
    game.scores[player].currentScore = fromScore + addScore;
    if (addScore > 0) {
      animateScore(elemRef[player].currentScore, fromScore, addScore, nextActionFunc);
    } else {
      elemRef[player].currentScore.text(fromScore);
      nextActionFunc && nextActionFunc();
    }
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
    elemRef[player].playerDisplay.addClass('current');
  };

  const setGameStatus = (status) => {
    game.gameStatus = status;
  };

  //--------------------------
  // Game logic
  //--------------------------

  const manageGame = (action) => {
    switch (action) {
      case actionType.newGame:
        // reinit scores and game status
        setGameStatus(state.started);
        setGlobalScore(player1, 0);
        setGlobalScore(player2, 0);
        setCurrentScore(player1, 0);
        setCurrentScore(player2, 0);
        drawDice(6);
        // choose first player randomly
        setCurrentPlayer(Math.floor(Math.random() * 100) + 1 > 50 ? player1 : player2);
        displayMessage(`Player ${game.currentPlayer + 1} starts!`);
        enableActions();
        break;

      case actionType.holdScore:
        // disable actions buttons for the processing duration
        disableActions();
        // send current score to global, manage game winner (if >=100) or turn change , enable action button
        setGlobalScore(game.currentPlayer, game.scores[game.currentPlayer].globalScore, game.scores[game.currentPlayer].currentScore, () => {
          setCurrentScore(game.currentPlayer, 0, 0, () => {
            if (game.scores[game.currentPlayer].globalScore >= 100) {
              manageGame(actionType.winGame);
            } else {
              setCurrentPlayer(game.currentPlayer === player1 ? player2 : player1);
              enableActions();
            }
          });
        });

        break;

      case actionType.rollDice:
        {
          // disable action buttons during processing
          disableActions();
          // run roll dice and then manage the result
          rollDice(() => {
            manageGame(actionType.rollResult);
          });
        }
        break;

      case actionType.rollResult:
        // manage the result of the roll
        if (game.rollResult === 1) {
          // loose on 1 => player change / no score added / enable actions
          setCurrentScore(game.currentPlayer, 0, 0, () => {
            setCurrentPlayer(game.currentPlayer === player1 ? player2 : player1);
            displayMessage('Oops! The turn changes');
            enableActions();
          });
        } else {
          // add current to global and enable actions button
          setCurrentScore(game.currentPlayer, game.scores[game.currentPlayer].currentScore, game.rollResult, enableActions);
        }

        break;

      case actionType.winGame:
        // display a message fot the winner , enable new game button ,disable other buttons
        displayMessage(`Player ${game.currentPlayer + 1} wins!`);
        enableActions(false, false, true);
        disableActions(true, true, false);
        break;

      default:
        break;
    }
  };
  //-------------------------
  // Run a new game at start
  //-------------------------

  manageGame(actionType.newGame);
});

const Gameboard = (() => {
    let board = []

    for (i = 0; i < 9; i++) {
        board.push(Square())
    }

    const newBoard = () => {
        board = []
        for (i = 0; i < 9; i++) {
            board.push(Square())
        }
    }

    const getBoard = () => board

    const mark = (pos, player) => {
        getBoard()[pos].addMark(player.mark)
    }

    const winningCombos = () => {
        return [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ]
    }

    return { getBoard, mark, winningCombos, newBoard }
})()

function Square() {
    let value;

    const addMark = (player) => {
        value = player
    }

    const getValue = () => value

    return { addMark, getValue }
}

const Players = (() => {

    let players = [
        {
            name: 'Player 1',
            mark: 'X',
        },
        {
            name: 'Player 2',
            mark: 'O',
        }
    ]

    const getPlayers = () => players

    const changePlayerName = (player, newName) => {
        players[player].name = newName
    }

    return { getPlayers, changePlayerName }
})()

const gameController = () => {

    let userTurn = Players.getPlayers()[0]

    let winner;
    let gameover = false;

    const swapTurn = () => {
        if (userTurn == Players.getPlayers()[1]) {
            userTurn = Players.getPlayers()[0]
        } else {
            userTurn = Players.getPlayers()[1]
        }
    }

    const reset = () => {
        userTurn = Players.getPlayers()[0]
        gameover = false;
    }

    const currentTurn = () => userTurn

    const playTurn = (pos) => {
        const currentBoard = Gameboard.getBoard()

        // Checks if position already has been marked or if the game is over
        if (currentBoard[pos].getValue() == 'X' || currentBoard[pos].getValue() == 'O' || gameover) {
            return
        } else {
            Gameboard.mark(pos, currentTurn())
        }

        // Checks for winner
        Gameboard.winningCombos().forEach((combo) => {
            for (i = 0; i <= 2; i++) {
                if (currentBoard[combo[i]].getValue() !== currentTurn().mark) {
                    return
                }
                if (i == 2) {
                    winner = currentTurn()
                    gameover = true
                }
            }
        })

        swapTurn()
    }

    const checkWinner = () => winner
    const checkGameState = () => gameover

    return { playTurn, currentTurn, reset, checkWinner, checkGameState }
}

const domController = () => {

    const domBoard = document.querySelector('#board')
    const turnMessage = document.querySelector('.turn')
    const startButton = document.querySelector('.start-game')
    const playerOneInput = document.querySelector('.playerone-input')
    const playerTwoInput = document.querySelector('.playertwo-input')
    const playerOneUsernameField = document.querySelector('.playerone-username')
    const playerTwoUsernameField = document.querySelector('.playertwo-username')
    
    const game = gameController()

    const renderBoard = () => {
        if (!game.checkGameState()) {
            turnMessage.textContent = `It is ${game.currentTurn().name}'s turn (${game.currentTurn().mark})`
        } else {
            turnMessage.textContent = `${game.checkWinner().name} is the winner!`
        }

        const currentBoard = Gameboard.getBoard()

        domBoard.innerHTML = ''

        currentBoard.forEach((square, index) => {
                const btn = document.createElement('button')
                btn.classList.add('square', index)
                btn.onclick = selectMove
                domBoard.appendChild(btn).textContent = square.getValue()
        })
    }

    function startGame () {
        playerOneUsernameField.textContent = playerOneInput.value
        playerTwoUsernameField.textContent = playerTwoInput.value

        if (playerOneInput.value) {
            Players.changePlayerName(0, playerOneInput.value)
        }

        if (playerTwoInput.value) {
            Players.changePlayerName(1, playerTwoInput.value)
        }

        playerOneInput.remove()
        playerTwoInput.remove()
        startButton.remove()

        renderBoard()
    }

    function reset() {
        Gameboard.newBoard()
        game.reset()
        renderBoard()
    }

    document.querySelector('.reset').onclick = reset
    document.querySelector('.start-game').onclick = startGame

    function selectMove(event) {
        game.playTurn(event.target.classList[1])
        renderBoard()
    }
}

domController()
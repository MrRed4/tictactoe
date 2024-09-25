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

const createPlayers = (playerOneName, playerTwoName) => {
    return [
        {
            name: playerOneName,
            mark: 'X',
        },
        {
            name: playerTwoName,
            mark: 'O',
        }
    ]
}

const gameController = () => {

    let players = createPlayers('PlayerOne', 'PlayerTwo')
    let userTurn = players[0]

    let winner;
    let gameover = false;

    const swapTurn = () => {
        if (userTurn == players[1]) {
            userTurn = players[0]
        } else {
            userTurn = players[1]
        }
    }

    const reset = () => {
        userTurn = players[0]
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
    
    const game = gameController()

    const render = () => {
        if (!game.checkGameState()) {
            turnMessage.textContent = `It is ${game.currentTurn().name}'s turn (${game.currentTurn().mark})`
        } else {
            turnMessage.textContent = `${game.checkWinner().name} is the winner!!!`
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
    // Initial render
    render()

    function reset() {
        Gameboard.newBoard()
        game.reset()
        render()
    }
    document.querySelector('.reset').onclick = reset

    function selectMove(event) {
        game.playTurn(event.target.classList[1])
        render()
    }
}

domController()
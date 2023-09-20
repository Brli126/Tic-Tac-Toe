

const gameBoard = (() => {
    const gameBoardArr = ["", "", "", "", "", "", "", "", ""];
    const ncell = 9; // number of cells.
    const latestMove = {
        index: 0,
        mark: '',
    };
    
    // Render the array to a board on webpage
    const render = function() {
        for (let i = 0; i < ncell; i++) {
            const cell = document.querySelector(`#cell_${i} p`);
            cell.textContent = gameBoardArr[i];
        }
    };

    const resetGB = function() {

        for (let i = 0; i < ncell; i++) {
            gameBoardArr[i] = '';
        };

        render();

        latestMove.index = 0;
        latestMove.mark = '';
    }

    const updateBoard = function(idx, mark) {
        gameBoardArr[idx] = mark;
        latestMove.index = idx;
        latestMove.mark = mark;
    };

    const rowCheck = function(index, mark) {
        const mod3 = index % 3;
        if (mod3 == 0) {
            return (gameBoardArr[index+1] == mark && gameBoardArr[index+2] == mark);
        } else if (mod3 == 1) {
            return (gameBoardArr[index-1] == mark && gameBoardArr[index+1] == mark);
        } else {
            return (gameBoardArr[index-1] == mark && gameBoardArr[index-2] == mark);
        }
    };

    const colCheck = function(index, mark) {
        const quo3 = Math.floor(index / 3);
        if (quo3 == 0) {
            return (gameBoardArr[index+3] == mark && gameBoardArr[index+6] == mark);
        } else if (quo3 == 1) {
            return (gameBoardArr[index-3] == mark && gameBoardArr[index+3] == mark);
        } else {
            return (gameBoardArr[index-3] == mark && gameBoardArr[index-6] == mark);
        }
    };

    const diagCheck = function(index, mark) {
        if (index == 0) {
            return (gameBoardArr[4] == mark && gameBoardArr[8] == mark);
        } else if (index == 2) {
            return (gameBoardArr[4] == mark && gameBoardArr[6] == mark);
        } else if (index == 6) {
            return (gameBoardArr[4] == mark && gameBoardArr[2] == mark);
        } else if (index == 8) {
            return (gameBoardArr[4] == mark && gameBoardArr[0] == mark);
        } else {
            return (gameBoardArr[0] == mark && gameBoardArr[8] == mark) || 
            (gameBoardArr[2] == mark && gameBoardArr[6] == mark);
        }

    };


    // Check result for current move;

    const checkResult = function(index) {
        const mark = latestMove.mark;
        if (index == 1 || index == 3 || index == 5 || index == 7) {
            return (rowCheck(index, mark) || colCheck(index, mark));
        } else {
            return (rowCheck(index, mark) || colCheck(index, mark) || diagCheck(index, mark));
        }
    };

    return {render, resetGB, updateBoard, checkResult};

})()



const uiController = ( () => {
    const restartBtn = document.querySelector('#restart');
    const newBtn = document.querySelector('#new_game');
    const newDialog = document.querySelector('#new_game_dialog');
    const doneBtn = newDialog.querySelector('#done_btn');
    const p1Name = newDialog.querySelector('#player1_name');
    const p2Name = newDialog.querySelector('#player2_name');

    newBtn.addEventListener('click', () => {
        newDialog.showModal();
        doneBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const ng = game(p1Name.value, p2Name.value);
            ng.start();
            restartBtn.addEventListener('click', () => {
                ng.restart();
            })
            newDialog.close();

        })
    })

    newDialog.addEventListener('close', () => newBtn.disabled = true);

})();


// Factory function to create player object.
const player = (myMark, myName) => {
    const name = myName;
    const mark = myMark;
    const getName = () => {return name};
    const setMark = function(idx) {
        gameBoard.updateBoard(idx, mark);
    };

    return {getName, setMark};
}


// Factory functon to create a game.

const game = (p1_name, p2_name) => {

    const cells = document.querySelectorAll('.cell');
    const resultDialog = document.querySelector('#result_dialog');
    const resultMessage = resultDialog.querySelector('p');
    //const okBtn = resultDialog.querySelector('#ok_btn');
    // Mode: pvp or pve
    const Mode = "pvp";

    // number of total move.
    let nmove = 0;

    const player1 = player("X", p1_name);
    const player2 = player("O", p2_name);
    let currentPlayer = player1;



    const getCellIndex = function(cell) {
        return Number(cell.getAttribute('data-index'));
    }
 
    const takeTurn = function() {
        if (currentPlayer === player1) {
            currentPlayer = player2;
        } else {
            currentPlayer = player1;
        }
    }

    const openDialog_result = function() {
        resultDialog.showModal();
    };

    
    // helper function for start(), "this" in this function refer to "cell", see start().
    const updateAndCheck = function() {
        currentPlayer.setMark(getCellIndex(this));
        nmove++;
        gameBoard.render();                          // display

        // check for win after each move.
        const result = gameBoard.checkResult(getCellIndex(this));
        if (result === true) {
            resultMessage.textContent = `Game over! ${currentPlayer.getName()} won!`;
            openDialog_result();
        } else {
            // if no winner after a move, check for tie.
            if (nmove == 9) {
                resultMessage.textContent = 'Tie!';
                openDialog_result();
            }
        }
        takeTurn();

    }

    const start = function() {
        cells.forEach(cell => cell.addEventListener('click', updateAndCheck, {once: true}));                            
        resultDialog.addEventListener('close', () => {
            cells.forEach(cell => cell.removeEventListener('click',
            updateAndCheck, {once: true}));
        });
        
    };

    const restart = function() {
        currentPlayer = player1;
        nmove = 0;
        gameBoard.resetGB();
        start();
    }

    return{start, restart};
};













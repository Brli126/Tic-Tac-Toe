

const gameBoard = (() => {
    const gameBoardArr = ["", "", "", "", "", "", "", "", ""];
    const ncell = 9; // number of cells.
    let latestMove = {
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

    return {render, updateBoard, checkResult};

})()


const cells = document.querySelectorAll('.cell');
const resultDialog = document.querySelector('#resultDialog');
const resultMessage = resultDialog.querySelector('p');

// Factory functon to create a game.

const game = () => {
    // Mode: pvp or pve
    const Mode = "pvp";

    
    const player1 = player("X", "player1");
    const player2 = player("O", "player2");
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

    const openDialog = function() {
        resultDialog.showModal();
    };



    const start = function() {
        
        cells.forEach(cell => cell.addEventListener('click', 
            () => {currentPlayer.setMark(getCellIndex(cell));   // place piece
                   gameBoard.render();                          // display
                   const result = gameBoard.checkResult(getCellIndex(cell));
                   if (result === true) {
                    resultMessage.textContent = `Game over! ${currentPlayer.getName()} won!`
                    openDialog();
                   }
                   takeTurn();                         
                },  
                   {once: true}));                              // Can only click once per cell.
            
        
    };

    return{start};
}






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

const newgame = game();
newgame.start();


const gameBoard = (() => {
    const gameBoardArr = ["", "", "", "", "", "", "", "", ""];
    const ncell = 9; // number of cells.
    
    // Render the array to a board on webpage
    const render = function() {
        for (let i = 0; i < ncell; i++) {
            const cell = document.querySelector(`#cell_${i} p`);
            if (gameBoardArr[i] === "X") {
                cell.textContent = "X";
            } else if (gameBoardArr[i] === "O"){
                cell.textContent = "O";
            } else continue;
        }
    };

    const updateArr = function(idx, mark) {
            gameBoardArr[idx] = mark;
    };

    return {render, updateArr};

})()


const cells = document.querySelectorAll('.cell');

// Factory functon to create a game.

const game = () => {
    // Mode: pvp or pve
    const Mode = "pvp";

    
    const player1 = player("X");
    const player2 = player("O");
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



    const start = function() {
        
        cells.forEach(cell => cell.addEventListener('click', 
            () => {currentPlayer.setMark(getCellIndex(cell));   // place piece
                   takeTurn();                                  // upadate the current player
                   gameBoard.render();                          // display
                },  
                   {once: true}));                              // Can only click once per cell.
            
        
    };

    return{start};
}






// Factory function to create player object.
const player = (myMark) => {
    const mark = myMark;
    const setMark = function(idx) {
        gameBoard.updateArr(idx, mark);
    };

    return {setMark};
}

const newgame = game();
newgame.start();


const gameBoard = (() => {
    const gameBoardArr = ["X", "X", "O", "X", "O", "O", "X", "O", "X"];
    const ncell = 9; // number of cells.
    
    const render = function() {
        for (let i = 0; i < ncell; i++) {
            const cell = document.querySelector(`#cell_${i} p`);
            if (gameBoardArr[i] == "X") {
                cell.textContent = "X";
            } else {
                cell.textContent = "O";
            }
        }
    }

    return {render};

})()

gameBoard.render();

// Factory function to create player object.
function player() {

}




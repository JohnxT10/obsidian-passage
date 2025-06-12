// =========================
// PLAYER LOGIC
// =========================

function Player(maze, c, _cellsize, onComplete, playerImg, draw) {
    this.playerImg = playerImg;
    // Player logic
    const ctx = c.getContext("2d");
    // Use the player image if provided.
    const drawSprite = drawSpriteImage; 
    let moves = 0;
    const player = this;
    // Get the maze layout
    const map = maze.map();
    let cellCoords = {
        x: maze.startCoord().x,
        y: maze.startCoord().y
    };
    // Size of each cell
    let cellSize = _cellsize;
    // Half the cell size for centering the player sprite
    let halfCellSize = cellSize / 2;

     // Redraws the player at the current position and size
    this.redrawPlayer = function(_cellsize) {
        cellSize = _cellsize;
        halfCellSize = cellSize / 2;
        drawSprite(cellCoords);
    };

    // Draws the player sprite at the current coordinates
    function drawSpriteImage(coord) {
        // Draw a white shadow/outline
        ctx.save();
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 8; // Adjust for stronger/weaker glow
        ctx.drawImage(
            player.playerImg,
            coord.x * cellSize,
            coord.y * cellSize,
            cellSize,
            cellSize
        );
        ctx.restore();

        // Check if the player has reached the end of the maze
        if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
            // Stop the timer when the player reaches the end
            onComplete(moves);
            // Stop listening for key events when the maze is completed
            player.unbindKeyDown();
        }
    }

    // Handles keyboard input for moving the player
    function check(e) {
        // Prevent arrow keys from scrolling the page
        if ([37, 38, 39, 40].includes(e.keyCode)) {
            if (e.preventDefault) e.preventDefault();
        }
        const cell = map[cellCoords.x][cellCoords.y];
        moves++;

        // Move the player if there is an open wall in that direction
        switch (e.keyCode) {
            // 'A' key
            case 65:
            // Left arrow
            case 37: 
                if (cell.w == true) {
                    cellCoords = { x: cellCoords.x - 1, y: cellCoords.y };
                }
                break;
                // 'W' key
            case 87:
            // Up arrow
            case 38:
                if (cell.n == true) {
                    cellCoords = { x: cellCoords.x, y: cellCoords.y - 1 };
                }
                break;
            // 'D' key
            case 68:
            // Right arrow
            case 39: 
                if (cell.e == true) {
                    cellCoords = { x: cellCoords.x + 1, y: cellCoords.y };
                }
                break;
            // 'S' key
            case 83:
            // Down arrow
            case 40: // south
                if (cell.s == true) {
                    cellCoords = { x: cellCoords.x, y: cellCoords.y + 1 };
                }
                break;
        }

        // Redraw the maze (to clear old player image)
        draw.redrawMaze(cellSize);
        // Draw the player at the new position
        drawSprite(cellCoords);
    }

    this.check = check;

    // Listen for keyboard events to move the player
    this.bindKeyDown = function() {
        window.addEventListener("keydown", check, false);
    };

     // Stop listening for keyboard events
    this.unbindKeyDown = function() {
        window.removeEventListener("keydown", check, false);
    };

    // Draw the player at the start
    drawSprite(maze.startCoord());
    // Start listening for key presses
    this.bindKeyDown();
}


export { Player };
// =========================
// MAZE DRAWING
// =========================

// Get the current wall color from the CSS variable
function getWallColor() {
    return getComputedStyle(document.body).getPropertyValue('--maze-wall-color').trim();
}

function DrawMaze(Maze, ctx, cellsize = null, difficulty, goalImg) {
    // Store difficulty and goalImg as properties
    this.difficulty = difficulty;
    this.goalImg = goalImg;
    const self = this;
    
    // Maze drawing logic
    // Maze layout and cell size
    const map = Maze.map();
    let cellSize = cellsize;
    // Drawing the goal
    let drawEndMethod;
    // Sets the thickness of the walls
    ctx.lineWidth = cellSize / 40;

    //  For redrawing the maze e.g toggling dark mode or resizing the canvas
    this.redrawMaze = function(size) {
        cellSize = size;
        ctx.lineWidth = cellSize / 50;
        //   clear the canvas before redrawing, avoids multiple player images in previous cells 
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        drawMap();
        drawEndMethod();
    };

    // Draws a single cell with its walls
    // xCord and yCord are the coordinates of the cell in the maze
    function drawCell(xCord, yCord, cell) {
        const x = xCord * cellSize;
        const y = yCord * cellSize;
        // This adjusts the thickness of the lines.
        ctx.lineWidth = 2;

        //   North wall
        if (cell.n === false) {
            ctx.save();
            // Only add shadow for easy and medium difficulties
            if (parseInt(difficulty) === 10 || parseInt(difficulty) === 15) {
                // dark shadow for dark mode
                if (document.body.classList.contains('dark-mode')) {
                    ctx.shadowColor = "rgba(0,0,0,0.7)"; 
                } else {
                    // light shadow for light mode
                    ctx.shadowColor = "rgba(255, 255, 255, 0.3)"; 
                    ctx.shadowBlur = 10;
                }
                ctx.shadowBlur = 4;
            } else {
                // No shadow for other difficulties
                ctx.shadowColor = "rgba(0,0,0,0)";
                ctx.shadowBlur = 0;
            }
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + cellSize, y);
            ctx.stroke();
            ctx.restore();
        }

        // South wall
        if (cell.s === false) {
            // Only add shadow for easy and medium difficulties
            if (parseInt(difficulty) === 10 || parseInt(difficulty) === 15) {
                // dark shadow for dark mode
                if (document.body.classList.contains('dark-mode')) {
                    ctx.shadowColor = "rgba(0,0,0,0.7)"; 
                } else {
                    // light shadow for light mode
                    ctx.shadowColor = "rgba(255, 255, 255, 0.3)"; 
                    ctx.shadowBlur = 10;
                }
                ctx.shadowBlur = 4;
            } else {
                // No shadow for hard and extreme difficulties
                ctx.shadowColor = "rgba(0,0,0,0)";
                ctx.shadowBlur = 0;
            }
            ctx.beginPath();
            ctx.moveTo(x, y + cellSize);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.stroke();
            ctx.restore();
        }

        // East wall
        if (cell.e === false) {
            // Only add shadow for easy and medium difficulties
            if (parseInt(difficulty) === 10 || parseInt(difficulty) === 15) {
                // dark shadow for dark mode
                if (document.body.classList.contains('dark-mode')) {
                    ctx.shadowColor = "rgba(0,0,0,0.7)"; 
                } else {
                    // light shadow for light mode
                    ctx.shadowColor = "rgba(255, 255, 255, 0.3)"; 
                    ctx.shadowBlur = 10;
                }
                ctx.shadowBlur = 4;
            } else {
                // No shadow for hard and extreme difficulties
                ctx.shadowColor = "rgba(0,0,0,0)";
                ctx.shadowBlur = 0;
            }
        
            ctx.beginPath();
            ctx.moveTo(x + cellSize, y);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.stroke();
            ctx.restore();
        }

        // West wall
        if (cell.w === false) {
            // Only add shadow for easy and medium difficulties
            if (parseInt(difficulty) === 10 || parseInt(difficulty) === 15) {
                // dark shadow for dark mode
                if (document.body.classList.contains('dark-mode')) {
                    ctx.shadowColor = "rgba(0,0,0,0.7)"; 
                } else {
                    // light shadow for light mode
                    ctx.shadowColor = "rgba(255, 255, 255, 0.3)"; 
                    ctx.shadowBlur = 10;
                }
                ctx.shadowBlur = 4;
            } else {
                // No shadow for hard and extreme difficulties
                ctx.shadowColor = "rgba(0,0,0,0)";
                ctx.shadowBlur = 0;
            }
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + cellSize);
            ctx.stroke();
            ctx.restore();
        }
    }

    // Loops through every cell in the maze and calls drawCell to draw its walls.
    function drawMap() {
        ctx.strokeStyle = getWallColor(); 
        for (let x = 0; x < map.length; x++) {
            for (let y = 0; y < map[x].length; y++) {
                drawCell(x, y, map[x][y]);
            }
        }
    }

    function drawEndFlag() {
        const coord = Maze.endCoord();
        // Draw the goal image at 90% of the cell size, centered
        // Draw a white shadow/outline
        ctx.save();
        ctx.shadowColor = "#fff";
        // Adjust for stronger/weaker glow
        ctx.shadowBlur = 8; 
        const scale = 0.9;
        const offset = (cellSize * (1 - scale)) / 2;
        ctx.drawImage(
            goalImg,
            coord.x * cellSize + offset,
            coord.y * cellSize + offset,
            cellSize * scale,
            cellSize * scale
        );
        ctx.restore();
    }

    drawEndMethod = drawEndFlag;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawMap();
    drawEndMethod();
}

export { getWallColor, DrawMaze };
// Light/Dark Mode Toggle
const btn = document.getElementById("theme-toggle");

btn.addEventListener("click", function() {
    document.body.classList.toggle("light-mode");
    document.body.classList.toggle("dark-mode");

    // Change button text based on current mode
    if (document.body.classList.contains("light-mode")) {
        btn.textContent = "Dark Mode";
    } else {
        btn.textContent = "Light Mode";
    }
});

// Finds the HTML element with id="maze" to put the maze grid inside.
const mazeContainer = document.getElementById("maze");

// This is a 2D array representing the maze. 1 = wall, 0 = path.
const mazeLayout = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,0,1],
    [1,0,1,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,1,0,1,0,1],
    [1,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1]
]

        // Loops through each row of the maze.
mazeLayout.forEach((row, rowIndex) => {
        // Loops through each cell in the row.
    row.forEach((cell, colIndex) => {
        // Creates a new <div> for this cell.
        const cellDiv = document.createElement("div");
        // Sets the size of the cell.
        cellDiv.style.width = "40px";
        cellDiv.style.height = "40px";
        

        if (cell === 1) {
            // If the cell is a wall, add the "wall" class.
            cellDiv.classList.add("wall");
            
        } else {
             // If the cell is a path, add the "path" class.
            cellDiv.classList.add("path");
        }

         // Adds the cell <div> to the maze in the HTML.
        mazeContainer.appendChild(cellDiv);
    });
});

// These variables track the player's position in the maze grid.
let playerRow = 1; // Start position (row in mazeLayout)
let playerCol = 1; // Start position (col in mazeLayout)

// The size of each cell, including the gap between cells.
const cellSize = 40 + 5; // 40px cell + 5px gap (from CSS grid gap)

// Finds the player element in the HTML.
const player = document.getElementById("player");

// Places the player at the correct spot in the maze using absolute positioning.
player.style.position = "absolute";
player.style.top = playerRow * cellSize + "px";
player.style.left = playerCol * cellSize + "px";

 // Listens for any key press.
document.addEventListener("keydown", function(event) {
   // Copies the current player position.
    let newRow = playerRow;
    let newCol = playerCol;
    
// Changes newRow/newCol depending on which arrow key was pressed.
    switch (event.key) {
        case "ArrowUp":
            newRow--;
            break;
        case "ArrowDown":
            newRow++;
            break;
        case "ArrowLeft":
            newCol--;
            break;
        case "ArrowRight":
            newCol++;
            break;
        default:
            return; // Ignore other keys
    }
    

    // Check boundaries and walls
     // Only move if the new position is inside the maze and not a wall.
    if (
        newRow >= 0 &&
        newRow < mazeLayout.length &&
        newCol >= 0 &&
        newCol < mazeLayout[0].length &&
        mazeLayout[newRow][newCol] === 0
    ) {
        // Updates the player's position in the grid and on the screen.
        playerRow = newRow;
        playerCol = newCol;
        player.style.top = playerRow * cellSize + "px";
        player.style.left = playerCol * cellSize + "px";
        
    }
});
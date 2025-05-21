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




// Layout of the maze

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



// CSS Variables for cell size and gap
// These variables are used to calculate the position of the player and goal.

// cell size in px
const cellSize = 40; 
// gap in px
const gap = 5;       
// px, from the CSS file
const mazePadding = 5; 
const mazeBorder = 4;   

function getCellPosition(index) {
    // So that the player and goal are positioned correctly.
    return   mazeBorder + gap + index * (cellSize + gap); 
}


// Create the player and goal elements section

// Define player and goal positions BEFORE creating the elements

// Start position (must be a path)
let playerRow = 1, playerCol = 1; 
// End position (must be a path)
const goalRow = 8, goalCol = 8;   

// Create and position the player
const player = document.createElement("div");
player.id = "player";
player.style.position = "absolute";
player.style.top = getCellPosition(playerRow) + "px";
player.style.left = getCellPosition(playerCol) + "px";
mazeContainer.appendChild(player);

// Create and position the goal
const goal = document.createElement("div");
goal.id = "goal";
goal.style.position = "absolute";
goal.style.top = getCellPosition(goalRow) + "px";
goal.style.left = getCellPosition(goalCol) + "px";
mazeContainer.appendChild(goal);




// Movement Logic

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
        player.style.top = getCellPosition(playerRow) + "px";
        player.style.left = getCellPosition(playerCol) + "px";
        
    }
});
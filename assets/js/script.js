// This is to prevent any warning about ES6 features on JSHint
/* jshint esversion: 6 */

// =========================
// THEME TOGGLE
// =========================
// Light/Dark Mode Toggle
document.addEventListener("DOMContentLoaded", function() {
    const btn = document.getElementById("theme-toggle");
    if (btn) {
    // Set the correct button text on page load
    if (document.body.classList.contains("light-mode")) {
        btn.value = "Dark Mode";
    } else {
        btn.value = "Light Mode";
    }

    btn.addEventListener("click", function() {
        document.body.classList.toggle("light-mode");
        document.body.classList.toggle("dark-mode");

        // Change button text based on current mode
        if (document.body.classList.contains("light-mode")) {
            btn.value = "Dark Mode";
        } else {
            btn.value = "Light Mode";
        }

        // Redraw the maze with the new color
        if (typeof draw !== "undefined" && draw && typeof draw.redrawMaze === "function") {
            draw.redrawMaze(cellSize);
            // Redraw the player at their current position so that it doesn't get lost
            if (typeof player !== "undefined" && player && typeof player.redrawPlayer === "function") {
                player.redrawPlayer(cellSize);
            }
        }
    });
}


// =========================
// USERNAME PROMPT LOGIC & UI CONTROLS
// =========================
 
const usernameSection = document.getElementById("username-section");
const usernameInput = document.getElementById("username-input");
const usernameSubmit = document.getElementById("username-submit");

// Hide game UI initially
document.getElementById("menu").style.display = "none";
const timerElem = document.getElementById("timer");
if (timerElem) timerElem.style.display = "none";
const viewElem = document.getElementById("view");
if (viewElem) viewElem.style.display = "none";
const mobileControls = document.getElementById("mobile-controls");
if (mobileControls) mobileControls.style.display = "none";

   // Username submit logic
   usernameSubmit.addEventListener("click", function() {
    const value = usernameInput.value.trim();
    if (value.length === 0) {
        usernameInput.focus();
        usernameInput.placeholder = "Please enter a username!";
        usernameInput.classList.add("error");
        return;
    }
    username = value;
    usernameInput.classList.remove("error");
    // Hide username section, show game UI
    usernameSection.style.display = "none";
    document.getElementById("about-section").style.display = "none";
    document.getElementById("menu").style.display = "";
    if (timerElem) timerElem.style.display = "";
    if (viewElem) viewElem.style.display = "";
    if (mobileControls) mobileControls.style.display = "";
});

// Remove error state on input
usernameInput.addEventListener("input", function() {
    if (usernameInput.classList.contains("error")) {
        usernameInput.classList.remove("error");
        usernameInput.placeholder = "Your username";
    }
});

// Allow Enter key to submit
usernameInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        usernameSubmit.click();
    }
});

  // Start button
  const startBtn = document.getElementById("startMazeBtn");
  if (startBtn) {
      startBtn.addEventListener("click", function() {
          if (mazeActive && timeRemaining > 0) {
              showRestartMessage(makeMaze);
          } else {
              makeMaze();
          }
      });
  }

  const howToPlay = document.getElementById('how-to-play');
  if (howToPlay) {
      howToPlay.addEventListener('click', function() {
          this.classList.toggle('expanded');
      });
  }

});

// =========================
// GLOBAL GAME STATE
// =========================

// Maze statistics for scoreboard
const mazeStats = {
    // Easy
    10: { attempts: 0, completed: 0 }, 
    // Medium
    15: { attempts: 0, completed: 0 }, 
    // Hard
    25: { attempts: 0, completed: 0 }, 
    // Extreme
    38: { attempts: 0, completed: 0 }  
};

// Timer state

// Set the initial time limit for the maze based on difficulty
let timeLimit;
// How much time you have left
let timeRemaining;
// Helps the game know when to stop or reset the timer
let timerInterval = null;
// Helps the game know whether to keep the timer running
let mazeActive = false;

// Scoreboard state
// When scoreboad is updated it will compare the current stats to the previous stats
// to see if any numbers increased, and flash them if they did
let prevStats = {};
let username = null;

// =========================
// TIMER FUNCTIONS
// =========================

// Helper function to format seconds as mm:ss
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
// Ensure seconds are always two digits
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Call this when the maze starts
function startTimer() {
    // When start button is pressed the intervals are the same and not going down faster 
    // This stops any previous timer that might be running
    clearInterval(timerInterval);
    // Reset the time remaining to the time limit
    timeRemaining = timeLimit;
    const timeElem = document.getElementById('time-remaining');
    // Reset color immediately so the first second in the maze isn't red!
    timeElem.style.color = ''; 
    // Set the initial time display
    timeElem.textContent = formatTime(timeRemaining);
    // Start the timer when the maze is created
    mazeActive = true;

    // Clear any existing timer interval
    timerInterval = setInterval(() => {
        if (!mazeActive) return;
        timeRemaining--;
        timeElem.textContent = formatTime(timeRemaining);

        // Change color to red when 30 seconds or less remain
        if (timeRemaining <= 30) {
            timeElem.style.color = 'red';
        } else {
            // Reset to default
            timeElem.style.color = ''; 
        }

        // If time runs out, stop the timer and show failure message
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            mazeActive = false;
            showFailureMessage();
        }
        // 1000 milliseconds = 1 second for the timer
    }, 1000);
}

// Call this when the maze is completed
function stopTimer() {
    mazeActive = false;
    clearInterval(timerInterval);
}

// =========================
// SCOREBOARD & MESSAGES
// =========================

function showVictoryMessage(moves) {
    const messageDiv = document.getElementById('message');
    messageDiv.classList.add('small-message');
    messageDiv.innerHTML = `
        <h1>Congratulations, ${username}!</h1>
        <p>You found the exit, but the darkness lingers behind your eyes.</p>
        <p>Will you tempt fate again, or has the passage marked you?</p>
        <p>You moved ${moves} steps to escape.</p>
        <input id="okBtn" class="app-btn" type="button" value="Tempt Fate Again">
    `;
    document.getElementById('message-container').style.display = 'block';

    // Makes pop up message disappear when the button is clicked
    const okBtn = document.getElementById("okBtn");
    if (okBtn) {
        okBtn.onclick = function() {
            document.getElementById('message-container').style.display = 'none';
        };
    }
}

// Show failure message
function showFailureMessage() {
    const messageDiv = document.getElementById('message');
    // Add the small size
    messageDiv.classList.add('small-message'); 
    messageDiv.innerHTML = `
        <h1>Time Slips Away...</h1>
        <p>The shadows close in.</p>
        <p>${username}, you are lost to the passage.</p>
        <p>Dare to tempt fate once more?</p>
        <input id="okBtn" class="app-btn" type="button" value="Try Again">
    `;
    document.getElementById('message-container').style.display = 'block';

    // Attach the event listener after the button is added to the DOM
    const okBtn = document.getElementById("okBtn");
    if (okBtn) {
        okBtn.onclick = function() {
            document.getElementById('message-container').style.display = 'none';
        };
    }
}

// Restart maze confirmation message
function showRestartMessage(onConfirm) {
    const messageDiv = document.getElementById('message');
    messageDiv.classList.add('small-message');
    messageDiv.innerHTML = `
        <h1>The Passage Whispers...</h1>
        <p>The shadows shift — your journey is not yet over.</p>
        <p>Are you certain you wish to abandon this path and face a new darkness?</p>
        <div class="restart-btn-row">
        <input id="confirmRestartBtn" class="app-btn" type="button" value="Embrace the Unknown">
        <input id="cancelRestartBtn" class="app-btn" type="button" value="Remain in the Shadows">
        </div>
    `;
    // Makes the message container visible
    document.getElementById('message-container').style.display = 'block';

    // Attach event listeners to the buttons
    // Confirm restart button
    document.getElementById("confirmRestartBtn").onclick = function() {
        document.getElementById('message-container').style.display = 'none';
        // Check if onConfirm is a function and call it to restart the maze
        if (typeof onConfirm === "function") onConfirm();
    };
    // Cancel restart button
    document.getElementById("cancelRestartBtn").onclick = function() {
        document.getElementById('message-container').style.display = 'none';
    };
}

//   Update the scoreboard with the current maze stats
function updateScoreboard() {
    // Names for each difficulty
    const names = {10: "Easy", 15: "Medium", 25: "Hard", 38: "Extreme"};
    // Build the scoreboard 
    let html = "";
    // Loops through each difficulty in mazeStats
        for (const diff in mazeStats) {
        if (mazeStats.hasOwnProperty(diff)) {
            const stat = mazeStats[diff];
            if (stat.attempts > 0) {
                // Only display difficulties that have attempts
                html += `<div><b>${names[diff]}</b>: <span class="score-completed" id="score-completed-${diff}">${stat.completed}</span>
                completed out of <span class="score-attempts" id="score-attempts-${diff}">${stat.attempts}</span> 
                attempt${stat.attempts > 1 ? "s" : ""}</div>`;
            }
        }
    }
    // Update the scoreboard on the page
    const scoreboard = document.getElementById("scoreboard");
    scoreboard.innerHTML = html;

    // Highlight if numbers increased
    // Loops through each difficulty in mazeStats
        for (const diff in mazeStats) {
        if (mazeStats.hasOwnProperty(diff)) {
            const stat = mazeStats[diff];
            // Check if there was a previous stat for this difficulty
            if (prevStats[diff]) {
                // Check if completed increased
                if (stat.completed > prevStats[diff].completed) {
                    const el = document.getElementById(`score-completed-${diff}`);
                    // If the element exists, add the flash class - this will highlight the number
                    // and remove it after 700ms
                    if (el) {
                        el.classList.add("score-flash");
                        setTimeout(() => el.classList.remove("score-flash"), 700);
                    }
                }
                // Check if attempts increased
                if (stat.attempts > prevStats[diff].attempts) {
                    const el = document.getElementById(`score-attempts-${diff}`);
                    if (el) {
                        // If the element exists, add the flash class - this will highlight the number
                        // and remove it after 700ms
                        el.classList.add("score-flash");
                        setTimeout(() => el.classList.remove("score-flash"), 700);
                    }
                }
            }
        }
    }
    // Store the previous stats for comparison next time
    // This is a deep copy to avoid reference issues
    // This ensures that the previous stats are not affected by future changes
    prevStats = JSON.parse(JSON.stringify(mazeStats));

    // Scroll to scoreboard if it has content
    if (html.trim() !== "") {
        scoreboard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}
  
function displayVictoryMess(moves) {
    // Stop the timer when the user wins
    stopTimer(); 
    // Track completion
    if (mazeStats[difficulty]) mazeStats[difficulty].completed++;
    updateScoreboard();
    showVictoryMessage(moves);
}

// =========================
// MAZE GENERATION UTILITIES
// =========================

// Random number generator and shuffle function for maze generation - direction, start and end positions, shuffle directions or paths to make each maze unique
// Generates a random number between 0 and max (exclusive)
function rand(max) {
    return Math.floor(Math.random() * max);
}
  
// Shuffle function to randomize an array, used for randomizing directions in maze generation
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// =========================
// MAZE CLASS LOGIC
// =========================

function Maze(Width, Height) {
    // Maze map and dimensions
    let mazeMap;
    const width = Width;
    const height = Height;
    // Start and end coordinates processed later
    let startCoord, endCoord;
    // Directions for maze generation
    const dirs = ["n", "s", "e", "w"];
    const modDir = {
        // Object that tells the code how to move in each direction
        n: { y: -1, x: 0, o: "s" },
        s: { y: 1, x: 0, o: "n" },
        e: { y: 0, x: 1, o: "w" },
        w: { y: 0, x: -1, o: "e" }
    };

    // Get the maze map
    this.map = function() {
        return mazeMap;
    };

    // Get the start and end coordinates
    this.startCoord = function() {
        return startCoord;
    };
    this.endCoord = function() {
        return endCoord;
    };



    function genMap() {
         // loops through each row and column of the maze
        mazeMap = new Array(height);
        for (let y = 0; y < height; y++) {
            mazeMap[y] = new Array(width);
        for (let x = 0; x < width; ++x) {
                mazeMap[y][x] = {
                    n: false,
                    s: false,
                    e: false,
                    w: false,
                    visited: false,
                    // Each cell has a prior position to backtrack to
                    priorPos: null
                };
            }
        }
    }

    // Has a path fropm the start to the end
    function defineMaze() {
        // Maze generation state
        let isComp = false;
        let move = false;
        let cellsVisited = 1;
        let numLoops = 0;
        let maxLoops = 0;
        let pos = {
            x: 0,
            y: 0
        };
        const numCells = width * height;


        while (!isComp) {
            move = false;
            mazeMap[pos.x][pos.y].visited = true;

            if (numLoops >= maxLoops) {
                shuffle(dirs);
                maxLoops = Math.round(rand(height / 8));
                numLoops = 0;
            }
            numLoops++;
            for (let index = 0; index < dirs.length; index++) {
                const direction = dirs[index];
                const nx = pos.x + modDir[direction].x;
                const ny = pos.y + modDir[direction].y;

                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    //Check if the tile is already visited
                    if (!mazeMap[nx][ny].visited) {
                        // Carve a path between current cell and new cell

                        // Open wall in current cell
                        mazeMap[pos.x][pos.y][direction] = true;
                        // Open wall in next cell
                        mazeMap[nx][ny][modDir[direction].o] = true;

                        //Set Currentcell as next cells Prior visited
                        mazeMap[nx][ny].priorPos = pos;
                        //Update Cell position to newly visited location
                        pos = {
                            x: nx,
                            y: ny
                        };
                        cellsVisited++;
                        //Recursively call this method on the next tile
                        move = true;
                        break;
                    }
                }
            }

            if (!move) {
                //  If it failed to find a direction,
                //  move the current position back to the prior cell and Recall the method.
                pos = mazeMap[pos.x][pos.y].priorPos;
            }
            if (numCells == cellsVisited) {
                // If we've visited all cells, the maze is complete!
                isComp = true;
            }
        }
    }

    function defineStartEnd() {
        switch (rand(4)) {
            case 0:
                // Maze starts at top left corner and ends at bottom right corner
                startCoord = { x: 0, y: 0 };
                endCoord = { x: height - 1, y: width - 1 };
                break;
            case 1:
                // Maze starts at top right corner and ends at bottom left corner
                startCoord = { x: 0, y: width - 1 };
                endCoord = { x: height - 1, y: 0 };
                break;
            case 2:
                // Maze starts at bottom left corner and ends at top right corner
                startCoord = { x: height - 1, y: 0 };
                endCoord = { x: 0, y: width - 1 };
                break;
            case 3:
                // Maze starts at bottom right corner and ends at top left corner
                startCoord = { x: height - 1, y: width - 1 };
                endCoord = { x: 0, y: 0 };
                break;
        }
    }

    genMap();
    defineStartEnd();
    defineMaze();
}

// =========================
// MAZE DRAWING
// =========================

// Get the current wall color from the CSS variable
function getWallColor() {
    return getComputedStyle(document.body).getPropertyValue('--maze-wall-color').trim();
}
  
function DrawMaze(Maze, ctx, cellsize = null) {
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

// =========================
// PLAYER LOGIC
// =========================

// Load player and goal images
const playerImg = new Image();
playerImg.src = "assets/images/main/player.png";

const goalImg = new Image();
goalImg.src = "assets/images/main/goal.png";

// maze won't start until both images are loaded
let imagesLoaded = 0;
playerImg.onload = goalImg.onload = function() {
    imagesLoaded++;
    if (imagesLoaded === 2) {
        document.getElementById("startMazeBtn").disabled = false;
    }
};

function Player(maze, c, _cellsize, onComplete, sprite = null) {
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
            playerImg,
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

// =========================
// CANVAS & GAME INITIALIZATION
// =========================

// Get the canvas and context for drawing the maze (draw shapes, lines, images, etc.).
const mazeCanvas = document.getElementById("mazeCanvas");
const ctx = mazeCanvas.getContext("2d");
let maze, draw, player;
let cellSize;
let difficulty;

// Responsive canvas resizing
function resizeMazeCanvas() {
    const canvas = document.getElementById('mazeCanvas');
    const container = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;

    // Use the smaller of the container's width or the window's height for a square
    // Match your CSS max-width
    const maxSize = 500; 
    const displaySize = Math.min(container.clientWidth, window.innerHeight * 0.6, maxSize);

    // Set the canvas pixel size for sharpness
    // Multiply by device pixel ratio for high-DPI screens
    canvas.width = displaySize * dpr;
    canvas.height = displaySize * dpr;

    // Set the CSS size for layout
    canvas.style.width = displaySize + "px";
    canvas.style.height = displaySize + "px";

    // Scale the context for high-DPI screens
    const ctx = canvas.getContext('2d');
    // reset any previous scaling or transformations on the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0); 
    // Scale the context to match the device pixel ratio
    ctx.scale(dpr, dpr);

       // --- Fix: recalculate cellSize based on new canvas size and difficulty ---
       if (typeof difficulty !== "undefined" && difficulty) {
        cellSize = displaySize / difficulty;
    }

    // Only redraw if draw and player exist
    if (typeof draw !== "undefined" && draw && typeof draw.redrawMaze === "function") {
        draw.redrawMaze(cellSize);
    }
    if (typeof player !== "undefined" && player && typeof player.redrawPlayer === "function") {
        player.redrawPlayer(cellSize);
    }
}

// Resize the maze canvas on page load and window resize
window.onload = function() {
    resizeMazeCanvas();
};

window.onresize = resizeMazeCanvas;

// Get the time limit based on the selected difficulty
function getTimeLimitForDifficulty(difficulty) {
    switch (parseInt(difficulty)) {
        // Easy, 2.5 minutes
        case 10:  
            return 150; 
        // Medium, 2 minutes
        case 15: 
            return 120; 
        // Hard, 1.5 minutes
        case 25:  
            return 90;  
        // Extreme, 1 minutes
        case 38:  
            return 60;  
        default:
            // fallback
            return 90; 
    }
}
  
// This starts the new maze
function makeMaze() {
    if (player != undefined) {
        player.unbindKeyDown();
        // Removes old player image from the canvas
        player = null;
    }

    // Ensure canvas is sharp and sized correctly
    resizeMazeCanvas();

    // Get the selected difficulty from the dropdown
    const e = document.getElementById("diffSelect");
    difficulty = e.options[e.selectedIndex].value;

    // Shows the attempts for the selected difficulty
    if (mazeStats[difficulty]) mazeStats[difficulty].attempts++;

    cellSize = mazeCanvas.clientWidth / difficulty;
    maze = new Maze(difficulty, difficulty);
    draw = new DrawMaze(maze, ctx, cellSize);
    player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess);

    // Set timeLimit based on difficulty
    timeLimit = getTimeLimitForDifficulty(difficulty);

    // Start the timer when a new maze is created
    startTimer(); 

    // Update scoreboard
    updateScoreboard();
}
   
// =========================
// UI CONTROLS & EVENT HANDLERS (outside DOMContentLoaded)
// =========================

// Arrow button controls
document.getElementById("arrow-up").addEventListener("click", function() {
    if (player) player.bindKeyDown();
    // Up arrow
    const e = { keyCode: 38 }; 
    if (player && typeof player.check === "function") {
        player.check(e);
    }});
document.getElementById("arrow-down").addEventListener("click", function() {
    if (player) player.bindKeyDown();
    // Down arrow
    const e = { keyCode: 40 }; 
     if (player && typeof player.check === "function") {
        player.check(e);
    }
});
document.getElementById("arrow-left").addEventListener("click", function() {
    if (player) player.bindKeyDown();
    // Left arrow
    const e = { keyCode: 37 }; 
       if (player && typeof player.check === "function") {
        player.check(e);
    }
});
document.getElementById("arrow-right").addEventListener("click", function() {
    if (player) player.bindKeyDown();
    // Right arrow
    const e = { keyCode: 39 }; 
       if (player && typeof player.check === "function") {
        player.check(e);
    }
});
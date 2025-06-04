// This is to prevent any warning about ES6 features on JSHint
/* jshint esversion: 6 */

// =========================
// THEME TOGGLE
// =========================

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

    // Redraw the maze with the new color
    if (draw && typeof draw.redrawMaze === "function") {
        draw.redrawMaze(cellSize);
        // Redraw the player at their current position so that it doesn't get lost
        if (player && typeof player.redrawPlayer === "function") {
            player.redrawPlayer(cellSize);
        }
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
let timeLimit;
let timeRemaining;
let timerInterval = null;
let mazeActive = false;

// Scoreboard state
let prevStats = {};

// =========================
// TIMER FUNCTIONS
// =========================

// Helper function to format seconds as mm:ss
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Call this when the maze starts
function startTimer() {
    /* When start button is pressed the interval are the same and 
    not going down faster */
    clearInterval(timerInterval);
    timeRemaining = timeLimit;
    const timeElem = document.getElementById('time-remaining');
    // <-- Reset color immediately so the first second in the maze isn't red!
    timeElem.style.color = ''; 
    timeElem.textContent = formatTime(timeRemaining);
    mazeActive = true;
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

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            mazeActive = false;
            showFailureMessage();
        }
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
        <p>The shadows shift—your journey is not yet over.</p>
        <p>Are you certain you wish to abandon this path and face a new darkness?</p>
        <div class="restart-btn-row">
        <input id="confirmRestartBtn" class="app-btn" type="button" value="Embrace the Unknown">
        <input id="cancelRestartBtn" class="app-btn" type="button" value="Remain in the Shadows">
        </div>
    `;
    document.getElementById('message-container').style.display = 'block';

    document.getElementById("confirmRestartBtn").onclick = function() {
        document.getElementById('message-container').style.display = 'none';
        if (typeof onConfirm === "function") onConfirm();
    };
    document.getElementById("cancelRestartBtn").onclick = function() {
        document.getElementById('message-container').style.display = 'none';
    };
}

//   Update the scoreboard with the current maze stats
function updateScoreboard() {
    const names = {10: "Easy", 15: "Medium", 25: "Hard", 38: "Extreme"};
    let html = "";
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
    const scoreboard = document.getElementById("scoreboard");
    scoreboard.innerHTML = html;

    // Highlight if numbers increased
        for (const diff in mazeStats) {
        if (mazeStats.hasOwnProperty(diff)) {
            const stat = mazeStats[diff];
            if (prevStats[diff]) {
                if (stat.completed > prevStats[diff].completed) {
                    const el = document.getElementById(`score-completed-${diff}`);
                    if (el) {
                        el.classList.add("score-flash");
                        setTimeout(() => el.classList.remove("score-flash"), 700);
                    }
                }
                if (stat.attempts > prevStats[diff].attempts) {
                    const el = document.getElementById(`score-attempts-${diff}`);
                    if (el) {
                        el.classList.add("score-flash");
                        setTimeout(() => el.classList.remove("score-flash"), 700);
                    }
                }
            }
        }
    }
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

function rand(max) {
    return Math.floor(Math.random() * max);
}
  
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// =========================
// MAZE CLASS
// =========================

function Maze(Width, Height) {
    // Maze map and dimensions
    let mazeMap;
    const width = Width;
    const height = Height;
    let startCoord, endCoord;
    const dirs = ["n", "s", "e", "w"];
    const modDir = {
        n: { y: -1, x: 0, o: "s" },
        s: { y: 1, x: 0, o: "n" },
        e: { y: 0, x: 1, o: "w" },
        w: { y: 0, x: -1, o: "e" }
    };

    this.map = function() {
        return mazeMap;
    };
    this.startCoord = function() {
        return startCoord;
    };
    this.endCoord = function() {
        return endCoord;
    };

    function genMap() {
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
                    priorPos: null
                };
            }
        }
    }

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
                        //Carve through walls from this tile to next
                        mazeMap[pos.x][pos.y][direction] = true;
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
                isComp = true;
            }
        }
    }

    function defineStartEnd() {
        switch (rand(4)) {
            case 0:
                startCoord = { x: 0, y: 0 };
                endCoord = { x: height - 1, y: width - 1 };
                break;
            case 1:
                startCoord = { x: 0, y: width - 1 };
                endCoord = { x: height - 1, y: 0 };
                break;
            case 2:
                startCoord = { x: height - 1, y: 0 };
                endCoord = { x: 0, y: width - 1 };
                break;
            case 3:
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
    const map = Maze.map();
    let cellSize = cellsize;
    let drawEndMethod;
    ctx.lineWidth = cellSize / 40;

    this.redrawMaze = function(size) {
        cellSize = size;
        ctx.lineWidth = cellSize / 50;
        //   clear the canvas before redrawing, avoids multiple player images in previous cells 
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        drawMap();
        drawEndMethod();
    };

    function drawCell(xCord, yCord, cell) {
        const x = xCord * cellSize;
        const y = yCord * cellSize;
        // This adjusts the thickness of the lines.
        ctx.lineWidth = 2;

        //   North wall
        if (cell.n == false) {
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
    console.log('Image loaded, count:', imagesLoaded);
    if (imagesLoaded === 2) {
        document.getElementById("startMazeBtn").disabled = false;
    }
};

function Player(maze, c, _cellsize, onComplete, sprite = null) {
    // Player logic
    const ctx = c.getContext("2d");
    // Use the player image if provided, otherwise use the default player image
    const drawSprite = drawSpriteImage; 
    let moves = 0;
    const player = this;
    const map = maze.map();
    let cellCoords = {
        x: maze.startCoord().x,
        y: maze.startCoord().y
    };
    let cellSize = _cellsize;
    let halfCellSize = cellSize / 2;

    this.redrawPlayer = function(_cellsize) {
        cellSize = _cellsize;
        halfCellSize = cellSize / 2;
        drawSprite(cellCoords);
    };

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
            onComplete(moves);
            player.unbindKeyDown();
        }
    }

    function check(e) {
        // Prevent arrow keys from scrolling the page
        if ([37, 38, 39, 40].includes(e.keyCode)) {
            if (e.preventDefault) e.preventDefault();
        }
        const cell = map[cellCoords.x][cellCoords.y];
        moves++;
        switch (e.keyCode) {
            case 65:
            case 37: // west
                if (cell.w == true) {
                    cellCoords = { x: cellCoords.x - 1, y: cellCoords.y };
                }
                break;
            case 87:
            case 38: // north
                if (cell.n == true) {
                    cellCoords = { x: cellCoords.x, y: cellCoords.y - 1 };
                }
                break;
            case 68:
            case 39: // east
                if (cell.e == true) {
                    cellCoords = { x: cellCoords.x + 1, y: cellCoords.y };
                }
                break;
            case 83:
            case 40: // south
                if (cell.s == true) {
                    cellCoords = { x: cellCoords.x, y: cellCoords.y + 1 };
                }
                break;
        }
        draw.redrawMaze(cellSize);
        drawSprite(cellCoords);
    }

    this.check = check;

    this.bindKeyDown = function() {
        window.addEventListener("keydown", check, false);
    };

    this.unbindKeyDown = function() {
        window.removeEventListener("keydown", check, false);
    };

    drawSprite(maze.startCoord());
    this.bindKeyDown();
}

// =========================
// CANVAS & GAME INITIALIZATION
// =========================

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
    canvas.width = displaySize * dpr;
    canvas.height = displaySize * dpr;

    // Set the CSS size for layout
    canvas.style.width = displaySize + "px";
    canvas.style.height = displaySize + "px";

    // Scale the context for high-DPI screens
    const ctx = canvas.getContext('2d');
    // reset
    ctx.setTransform(1, 0, 0, 1, 0, 0); 
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
  
function makeMaze() {
    if (player != undefined) {
        player.unbindKeyDown();
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
// USERNAME PROMPT LOGIC & UI CONTROLS
// =========================

let username = null;

document.addEventListener("DOMContentLoaded", function() {
    // Username logic
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
    document.getElementById("startMazeBtn").addEventListener("click", function() {
        if (mazeActive && timeRemaining > 0) {
            showRestartMessage(makeMaze);
        } else {
            makeMaze();
        }
    });
});


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
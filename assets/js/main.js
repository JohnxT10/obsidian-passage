// =========================
// IMPORTS
// =========================
import { Maze } from './maze.js';
import { DrawMaze } from './draw.js';
import { Player } from './player.js';
import { startTimer } from './timer.js';
import { showRestartMessage, updateScoreboard } from './ui.js';

// =========================
// THEME TOGGLE
// =========================

// Light/Dark Mode Toggle
document.addEventListener("DOMContentLoaded", function() {
    const btn = document.getElementById("theme-toggle");
     

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


// TIMER STATE

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
// IMAGE LOADING
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

// =========================
// USERNAME PROMPT LOGIC & UI CONTROLS
// =========================

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
    document.getElementById("startMazeBtn").addEventListener("click", function() {
        if (imagesLoaded < 2) return;
        if (mazeActive && timeRemaining > 0) {
            showRestartMessage(makeMaze);
        } else {
            makeMaze();
        }
    });
});
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
    draw = new DrawMaze(maze, ctx, cellSize, difficulty, goalImg);
    player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, playerImg, draw);

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
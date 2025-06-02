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

// Set your desired time limit in seconds
// At the top of your script:
let timeLimit;
let timeRemaining;
let timerInterval = null;
let mazeActive = false;

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

// Show failure message
function showFailureMessage() {
    const messageDiv = document.getElementById('message');
    // Add the small size
    messageDiv.classList.add('small-message'); 
    messageDiv.innerHTML = `
        <h1>Time Slips Away...</h1>
        <p>The shadows close in.</p>
        <p>You are lost to the passage.</p>
        <p>Dare to tempt fate once more?</p>
        <input id="okBtn" class="app-btn" type="button" onclick="toggleVisablity('message-container')" value="Try Again" />
    `;
    document.getElementById('message-container').style.visibility = 'visible';

    // Attach the event listener after the button is added to the DOM
    document.getElementById("okBtn").addEventListener("click", function() {
        toggleVisablity('message-container');
    });
}


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
  
  function changeBrightness(factor, sprite) {
    var virtCanvas = document.createElement("canvas");
    virtCanvas.width = 500;
    virtCanvas.height = 500;
    var context = virtCanvas.getContext("2d");
    context.drawImage(sprite, 0, 0, 500, 500);
  
    var imgData = context.getImageData(0, 0, 500, 500);
  
    for (let i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i] = imgData.data[i] * factor;
      imgData.data[i + 1] = imgData.data[i + 1] * factor;
      imgData.data[i + 2] = imgData.data[i + 2] * factor;
    }
    context.putImageData(imgData, 0, 0);
  
    var spriteOutput = new Image();
    spriteOutput.src = virtCanvas.toDataURL();
    virtCanvas.remove();
    return spriteOutput;
  }

//   Update the scoreboard with the current maze stats
  function updateScoreboard() {
    const names = {10: "Easy", 15: "Medium", 25: "Hard", 38: "Extreme"};
    let html = "";
    for (const diff in mazeStats) {
        const stat = mazeStats[diff];
        if (stat.attempts > 0) {
            // Only display difficulties that have attempts
            html += `<div><b>${names[diff]}</b>: <span class="score-completed">${stat.completed}</span> out of <span class="score-attempts">${stat.attempts}</span> attempt${stat.attempts > 1 ? "s" : ""}</div>`;
        }
    }
    document.getElementById("scoreboard").innerHTML = html;
}
  
  function displayVictoryMess(moves) {
    // Stop the timer when the user wins
    stopTimer(); 
    document.getElementById("moves").innerHTML = "You Moved " + moves + " Steps.";
    // Track completion
    if (mazeStats[difficulty]) mazeStats[difficulty].completed++;
    updateScoreboard();
    toggleVisablity("message-container");  
  }
  
  function toggleVisablity(id) {
    if (document.getElementById(id).style.visibility == "visible") {
      document.getElementById(id).style.visibility = "hidden";
    } else {
      document.getElementById(id).style.visibility = "visible";
    }
  }
  
  function Maze(Width, Height) {
    var mazeMap;
    var width = Width;
    var height = Height;
    var startCoord, endCoord;
    var dirs = ["n", "s", "e", "w"];
    var modDir = {
      n: {
        y: -1,
        x: 0,
        o: "s"
      },
      s: {
        y: 1,
        x: 0,
        o: "n"
      },
      e: {
        y: 0,
        x: 1,
        o: "w"
      },
      w: {
        y: 0,
        x: -1,
        o: "e"
      }
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
      for (y = 0; y < height; y++) {
        mazeMap[y] = new Array(width);
        for (x = 0; x < width; ++x) {
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
      var isComp = false;
      var move = false;
      var cellsVisited = 1;
      var numLoops = 0;
      var maxLoops = 0;
      var pos = {
        x: 0,
        y: 0
      };
      var numCells = width * height;
      while (!isComp) {
        move = false;
        mazeMap[pos.x][pos.y].visited = true;
  
        if (numLoops >= maxLoops) {
          shuffle(dirs);
          maxLoops = Math.round(rand(height / 8));
          numLoops = 0;
        }
        numLoops++;
        for (index = 0; index < dirs.length; index++) {
          var direction = dirs[index];
          var nx = pos.x + modDir[direction].x;
          var ny = pos.y + modDir[direction].y;
  
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
          startCoord = {
            x: 0,
            y: 0
          };
          endCoord = {
            x: height - 1,
            y: width - 1
          };
          break;
        case 1:
          startCoord = {
            x: 0,
            y: width - 1
          };
          endCoord = {
            x: height - 1,
            y: 0
          };
          break;
        case 2:
          startCoord = {
            x: height - 1,
            y: 0
          };
          endCoord = {
            x: 0,
            y: width - 1
          };
          break;
        case 3:
          startCoord = {
            x: height - 1,
            y: width - 1
          };
          endCoord = {
            x: 0,
            y: 0
          };
          break;
      }
    }
  
    genMap();
    defineStartEnd();
    defineMaze();
  }

  // Get the current wall color from the CSS variable
  function getWallColor() {
    return getComputedStyle(document.body).getPropertyValue('--maze-wall-color').trim();
  }
  
  function DrawMaze(Maze, ctx, cellsize, endSprite = null) {
    var map = Maze.map();
    var cellSize = cellsize;
    var drawEndMethod;
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
      var x = xCord * cellSize;
      var y = yCord * cellSize;
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
                        ctx.shadowColor = "rgba(0,0,0,0.5)"; 
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
            ctx.shadowColor = "rgba(0,0,0,0.5)"; 
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
            ctx.shadowColor = "rgba(0,0,0,0.5)"; 
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
            ctx.shadowColor = "rgba(0,0,0,0.5)"; 
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
      for (x = 0; x < map.length; x++) {
        for (y = 0; y < map[x].length; y++) {
          drawCell(x, y, map[x][y]);
        }
      }
    }
  
  
                       function drawEndFlag() {
                var coord = Maze.endCoord();
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
  
  
     
  
  
  // Load player and goal images
const playerImg = new Image();
playerImg.src = "assets/images/player.png";

const goalImg = new Image();
goalImg.src = "assets/images/goal.png";

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
    var ctx = c.getContext("2d");
    // Use the player image if provided, otherwise use the default player image
    var drawSprite = drawSpriteImage; 
    var moves = 0;
    var player = this;
    var map = maze.map();
    var cellCoords = {
      x: maze.startCoord().x,
      y: maze.startCoord().y
    };
    var cellSize = _cellsize;
    var halfCellSize = cellSize / 2;

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
        var cell = map[cellCoords.x][cellCoords.y];
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
  
      $("#view").swipe({
        swipe: function(
          event,
          direction,
          distance,
          duration,
          fingerCount,
          fingerData
        ) {
          console.log(direction);
          switch (direction) {
            case "up":
              check({
                keyCode: 38
              });
              break;
            case "down":
              check({
                keyCode: 40
              });
              break;
            case "left":
              check({
                keyCode: 37
              });
              break;
            case "right":
              check({
                keyCode: 39
              });
              break;
          }
        },
        threshold: 0
      });
    };
  
    this.unbindKeyDown = function() {
      window.removeEventListener("keydown", check, false);
      $("#view").swipe("destroy");
    };
  
    drawSprite(maze.startCoord());
    this.bindKeyDown();
  }
  
  var mazeCanvas = document.getElementById("mazeCanvas");
  var ctx = mazeCanvas.getContext("2d");
  var sprite;
  var finishSprite;
  var maze, draw, player;
  var cellSize;
  var difficulty;
  // sprite.src = 'media/sprite.png';


 function resizeCanvasAndMaze() {
    let viewWidth = $("#view").width();
    let viewHeight = $("#view").height();
    // Set a maximum size in pixels (e.g., 600)
    let maxSize = 600;
    let size = Math.min(viewWidth, viewHeight * 0.95, maxSize);
    ctx.canvas.width = size;
    ctx.canvas.height = size;
    if (typeof difficulty !== "undefined") {
        cellSize = mazeCanvas.width / difficulty;
        if (player != null && draw != null) {
            draw.redrawMaze(cellSize);
            player.redrawPlayer(cellSize);
        }
    }
}

  
  window.onload = function() {
    resizeCanvasAndMaze();
  };
  
  window.onresize = resizeCanvasAndMaze;

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
    var e = document.getElementById("diffSelect");
    difficulty = e.options[e.selectedIndex].value;

    // Shows the attempts for the selected difficulty
    if (mazeStats[difficulty]) mazeStats[difficulty].attempts++;


    cellSize = mazeCanvas.width / difficulty;
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

  document.getElementById("arrow-up").addEventListener("click", function() {
    if (player) player.bindKeyDown();
    var e = { keyCode: 38 }; // Up arrow
    player && player["check"] && player["check"](e);
});
document.getElementById("arrow-down").addEventListener("click", function() {
    if (player) player.bindKeyDown();
    var e = { keyCode: 40 }; // Down arrow
    player && player["check"] && player["check"](e);
});
document.getElementById("arrow-left").addEventListener("click", function() {
    if (player) player.bindKeyDown();
    var e = { keyCode: 37 }; // Left arrow
    player && player["check"] && player["check"](e);
});
document.getElementById("arrow-right").addEventListener("click", function() {
    if (player) player.bindKeyDown();
    var e = { keyCode: 39 }; // Right arrow
    player && player["check"] && player["check"](e);
});

// Start the maze when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("startMazeBtn").addEventListener("click", makeMaze);
});

document.addEventListener("DOMContentLoaded", function() {
  var okBtn = document.getElementById("okBtn");
  if (okBtn) {
    okBtn.addEventListener("click", function() {
      toggleVisablity('message-container');
    });
  }
});
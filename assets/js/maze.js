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
// MAZE CLASS
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


export { rand, shuffle, Maze };
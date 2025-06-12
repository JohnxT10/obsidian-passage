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

export { showVictoryMessage, showFailureMessage, showRestartMessage, updateScoreboard, displayVictoryMess};

// Add updateScoreboard and displayVictoryMess here as well, using export
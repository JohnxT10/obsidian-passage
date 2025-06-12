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

export { formatTime, startTimer, stopTimer };
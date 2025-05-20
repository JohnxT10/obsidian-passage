document.addEventListener("keydown", function(event) {
    let player = document.getElementById("player");
    let currentLeft = player.offsetLeft;
    let currentTop = player.offsetTop;

    switch (event.key) {
        case "ArrowUp":
            player.style.top = currentTop - 45 + "px";
            break;
        case "ArrowDown":
            player.style.top = currentTop + 45 + "px";
            break;
        case "ArrowLeft":
            player.style.left = currentLeft - 45 + "px";
            break;
        case "ArrowRight":
            player.style.left = currentLeft + 45 + "px";
            break;
    }
});

// Light/Dark Mode Toggle
document.getElementById("theme-toggle").addEventListener("click", function() {
    document.body.classList.toggle("light-mode");
    document.body.classList.toggle("dark-mode");
});

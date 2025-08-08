var board;
var score = 0;
var rows = 4;
var columns = 4;
var showImg = true;
var catNames = {2: 'coconut', 4: 'naha', 8: 'ginger', 16: 'yunyun', 32: 'whiskers', 64: 'fluffy', 128: 'cleopatra', 256: 'parsley', 512: 'huihui', 1024: 'zelda', 2048: 'artemis', 4096: 'marakuya', 8192: 'bee', 16384: 'tim'}

var infoPage = document.getElementById("infoPage");
var boardDiv = document.getElementById("board");
var controlsDiv = document.getElementById("controls");
var scoreHeader = document.querySelector("h2");

window.onload = setGame;

// ---------- MAIN GAME SETUP ----------
function setGame() {
    board = Array.from({ length: rows }, () => Array(columns).fill(0));
    boardDiv.innerHTML = "";

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = `${r}-${c}`;
            updateTile(tile, board[r][c]);
            boardDiv.append(tile);
        }
    }

    spawnTile();
    spawnTile();
}

// ---------- TILE UPDATE ----------
function updateTile(tile, num) {
    tile.innerHTML = "";
    tile.classList.value = "tile";

    if (num > 0) {
        if (showImg) {
            let img = document.createElement("img");
            img.src = `images/${num}.png`;
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.borderRadius = "10px";
            img.style.transition = "all 0.5s ease";
            tile.appendChild(img);
        } else {
            tile.innerText = num.toString();
            tile.classList.add(num <= 4096 ? `x${num}` : "x8192");
        }
    }
}

function refreshBoardDisplay() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            updateTile(document.getElementById(`${r}-${c}`), board[r][c]);
        }
    }
}

// ---------- GAME CONTROLS ----------
document.addEventListener("keyup", (e) => {
    let moved = false;
    if (e.code === "ArrowLeft" || e.code === "KeyD") { slideLeft(); moved = true; }
    else if (e.code === "ArrowRight" || e.code === "KeyA") { slideRight(); moved = true; }
    else if (e.code === "ArrowUp" || e.code === "KeyW") { slideUp(); moved = true; }
    else if (e.code === "ArrowDown" || e.code === "KeyS") { slideDown(); moved = true; }
    else if (e.code === "Space") { showImg = !showImg; refreshBoardDisplay(); }

    if (moved) {
        spawnTile();
        document.getElementById("score").innerText = score;
    }
});

function filterZero(row) {
    return row.filter(num => num !== 0);
}

function slide(row) {
    row = filterZero(row);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = filterZero(row);
    while (row.length < columns) row.push(0);
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        board[r] = slide(board[r]);
    }
    refreshBoardDisplay();
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        board[r] = slide(board[r].reverse()).reverse();
    }
    refreshBoardDisplay();
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let col = board.map(row => row[c]);
        col = slide(col);
        for (let r = 0; r < rows; r++) board[r][c] = col[r];
    }
    refreshBoardDisplay();
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let col = board.map(row => row[c]).reverse();
        col = slide(col).reverse();
        for (let r = 0; r < rows; r++) board[r][c] = col[r];
    }
    refreshBoardDisplay();
}

// ---------- TILE SPAWN ----------
function spawnTile() {
    if (!hasEmptyTile()) return;

    let placed = false;
    while (!placed) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] === 0) {
            board[r][c] = Math.random() < 0.1 ? 4 : 2;
            updateTile(document.getElementById(`${r}-${c}`), board[r][c]);
            placed = true;
        }
    }
}

function hasEmptyTile() {
    return board.some(row => row.includes(0));
}

// ---------- SAVE / LOAD ----------
function saveGameState() {
    localStorage.setItem("board", JSON.stringify(board));
    localStorage.setItem("score", score);
}

function loadGameState() {
    const savedBoard = localStorage.getItem("board");
    const savedScore = localStorage.getItem("score");

    if (savedBoard && savedScore !== null) {
        board = JSON.parse(savedBoard);
        score = Number(savedScore);
        refreshBoardDisplay();
        document.getElementById("score").innerText = score;
    } else {
        setGame();
    }
}



// ---------- INFO PAGE ----------
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("restartBtn").addEventListener("click", () => {
        score = 0;
        document.getElementById("score").innerText = score;
        setGame();
    });

    document.getElementById("infoBtn").addEventListener("click", () => {
        saveGameState();
        showInfoPage();
    });

    document.getElementById("backBtn").addEventListener("click", backToGame);
});

function showInfoPage() {
    boardDiv.style.display = "none";
    controlsDiv.style.display = "none";
    scoreHeader.style.display = "none";
    document.getElementById("title").style.display = "none";

    infoPage.style.display = "block";
    renderCatGrid();
}

function backToGame() {
    infoPage.style.display = "none";
    boardDiv.style.display = "grid";
    controlsDiv.style.display = "block";
    scoreHeader.style.display = "block";
    document.getElementById("title").style.display = "block";
    loadGameState();
}


// ---------- CAT GRID ----------
function renderCatGrid() {
    const catGrid = document.getElementById("catGrid");
    catGrid.innerHTML = "";

    const cats = [];
    for (let i = 2; i <= 16384; i *= 2) {
        cats.push({
            name: catNames[i],
            img: `images/${i}.png`,
            overlayImg: `images/overlay${i}.png`,
        });
    }

    cats.forEach(cat => {
        const tile = document.createElement("div");
        tile.style.position = "relative";
        tile.style.width = "90px";
        tile.style.height = "90px";

        const catImg = document.createElement("img");
        catImg.src = cat.img;
        catImg.style.width = "100%";
        catImg.style.height = "100%";
        catImg.style.borderRadius = "15px";
        tile.appendChild(catImg);

        const overlay = document.createElement("img");
        overlay.src = cat.overlayImg;
        overlay.style.position = "absolute";
        overlay.style.bottom = "-20px";
        overlay.style.left = "50px";
        overlay.style.width = "80%";
        overlay.style.height = "80%";
        tile.appendChild(overlay);

        const label = document.createElement("span");
        label.innerText = cat.name;
        label.style.position = "absolute";
        label.style.top = "50%";
        label.style.left = "130%";
        label.style.transform = "translateY(-50%)";
        label.style.fontSize = "16px";
        label.style.whiteSpace = "nowrap";
        label.style.marginLeft = "5px";
        tile.appendChild(label);

        catGrid.appendChild(tile);
    });
}

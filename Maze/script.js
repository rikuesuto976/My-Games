const CELL_SIZE = 30;
let difficultyLevel = 1;
let wins = 0;
let MAZE_SIZE, START_TIME;

function getDifficultySettings(level) {
    const settings = [
        { mazeSize: 15, timeSeconds: 60, name: 'EASY' },
        { mazeSize: 20, timeSeconds: 180, name: 'MEDIUM' },
        { mazeSize: 25, timeSeconds: 300, name: 'HARD' },
        { mazeSize: 30, timeSeconds: 420, name: 'HARDER' },
        { mazeSize: 35, timeSeconds: 540, name: 'INSANE' },
    ];
    const idx = Math.min(level - 1, settings.length - 1);
    return { ...settings[idx], level };
}

let player = { x: 0, y: 0 }, timer = null, timeLeft, maze, exitPos, gameActive = false;
let keysPressed = {};
let gameLoop = null;
let DIRECTION_MAP = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
};

function updateGameLoop() {
    if (!gameActive) return;
    Object.entries(DIRECTION_MAP).forEach(([key, dir]) => {
        if (keysPressed[key]) {
            movePlayer(dir);
        }
    });
}

function formatTime(seconds) {
    const mins = Math.floor(Math.max(seconds, 0) / 60);
    const secs = Math.max(seconds, 0) % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function generateMaze(){
    maze = Array(MAZE_SIZE)
        .fill()
        .map(
            () =>
                Array(MAZE_SIZE)
                    .fill()
                    .map(() => ({
                        walls: {top:true, right:true, left:true, bottom:true},
                        visited:false,
                    }))
        );

    let stack = [];
    let current = {x:0, y:0}
    maze[0][0].visited= true;

    while (true) {
        let neighbours = [];
        if (current.x > 0 && !maze[current.y][current.x - 1].visited) neighbours.push('left');
        if (current.x < MAZE_SIZE - 1 && !maze[current.y][current.x + 1].visited) neighbours.push('right');
        if (current.y > 0 && !maze[current.y - 1][current.x].visited) neighbours.push('top');
        if (current.y < MAZE_SIZE - 1 && !maze[current.y + 1][current.x].visited) neighbours.push('bottom');

        if (neighbours.length > 0) {
            let direction = neighbours[Math.floor(Math.random() * neighbours.length)];
            let next = { x: current.x, y: current.y };

            switch (direction) {
                case 'left':
                    maze[current.y][current.x].walls.left = false;
                    maze[current.y][current.x - 1].walls.right = false;
                    next.x--;
                    break;
                case 'right':
                    maze[current.y][current.x].walls.right = false;
                    maze[current.y][current.x + 1].walls.left = false;
                    next.x++;
                    break;
                case 'top':
                    maze[current.y][current.x].walls.top = false;
                    maze[current.y - 1][current.x].walls.bottom = false;
                    next.y--;
                    break;
                case 'bottom':
                    maze[current.y][current.x].walls.bottom = false;
                    maze[current.y + 1][current.x].walls.top = false;
                    next.y++;
                    break;
            }

            maze[next.y][next.x].visited = true;
            stack.push(current);
            current = next;
        } else if (stack.length > 0) {
            current = stack.pop();
        } else {
            break;
        }
    }
    let side, exitX, exitY;
    do{
        side = Math.floor(Math.random()*4);
        switch(side){
            case 0:
                exitY =0;
                exitX = Math.floor(Math.random()*MAZE_SIZE);
                break;
            case 1:
                exitX = MAZE_SIZE - 1;
                exitY = Math.floor(Math.random() * MAZE_SIZE);
                break;
            case 2:
                exitY = MAZE_SIZE - 1;
                exitX = Math.floor(Math.random() * MAZE_SIZE);
                break;
            case 3:
                exitX = 0;
                exitY = Math.floor(Math.random() * MAZE_SIZE);
                break;
        }
    } while (exitX === 0 && exitY === 0);

    exitPos = {x:exitX, y: exitY};

    switch(side)
    {
        case 0:
            maze[exitY][exitX].walls.top = false;
            break;
        case 1:
            maze[exitY][exitX].walls.right = false;
            break;
        case 2:
            maze[exitY][exitX].walls.bottom = false;
            break;
        case 3:
            maze[exitY][exitX].walls.left = false;
            break;
    }
}

function renderMaze()
{
    const container = document.getElementById("maze");
    container.style.gridTemplateColumns = `repeat(${MAZE_SIZE}, ${CELL_SIZE}px)`;
    container.innerHTML = "";
    for(let y=0; y<MAZE_SIZE; y++){
        for(let x=0; x<MAZE_SIZE; x++)
        {
            const cell = document.createElement("div");
            cell.className = 'cell' + (x === exitPos.x && y ==exitPos.y ? " exit": "");
            cell.style.width = CELL_SIZE + 'px';
            cell.style.height = CELL_SIZE + 'px';

            Object.entries(maze[y][x].walls).forEach(([dir, exists]) => {
                if (exists) {
                    const wall = document.createElement('div');
                    wall.className = `wall ${dir}`;
                    cell.appendChild(wall);
                }
            });

            container.appendChild(cell);
        }
    }
    updatePlayerPosition();
}

function updatePlayerPosition() {
    const playerElem = document.getElementById("player");
    playerElem.style.width  = CELL_SIZE * 0.6 + "px";
    playerElem.style.height = CELL_SIZE * 0.6 + "px";
    playerElem.style.left   = player.x * CELL_SIZE + CELL_SIZE*0.2 + "px";
    playerElem.style.top    = player.y * CELL_SIZE + CELL_SIZE*0.2 + "px";

    if (player.x === exitPos.x && player.y === exitPos.y) {
        wins++;
        const settings = getDifficultySettings(difficultyLevel);
        gameActive = false;
        clearInterval(timer);
        clearInterval(gameLoop);
        showMessage(`🎉 LEVEL ${difficultyLevel} COMPLETE!\nWins: ${wins}\n\nNext: ${getDifficultySettings(difficultyLevel + 1).name} Level`, 'Next Level');
        difficultyLevel++;
    }
}

function movePlayer(direction) {
    if (!gameActive) return;
    const walls = maze[player.y][player.x].walls;
    switch(direction)
    {
        case "up":
            if(!walls.top) player.y--;
            break;
        case "down":
            if(!walls.bottom) player.y++;
            break;
        case "left":
            if(!walls.left) player.x--;
            break;
        case "right":
            if(!walls.right) player.x++;
            break;
    }
    updatePlayerPosition();
}

function showMessage(text, buttonText = 'Try Again') {
    gameActive = false;
    clearInterval(timer);
    document.getElementById('message-text').textContent = text;
    document.getElementById('try-again').textContent = buttonText;
    document.getElementById('message').style.display = 'block';
}

function initGame() {
    const settings = getDifficultySettings(difficultyLevel);
    MAZE_SIZE = settings.mazeSize;
    START_TIME = settings.timeSeconds;
    
    gameActive = true;
    timeLeft = START_TIME;
    document.getElementById('timer').textContent = `Time: ${formatTime(timeLeft)}`;
    document.getElementById('difficulty').textContent = `Level: ${difficultyLevel} (${settings.name})`;
    document.getElementById('wins').textContent = `Wins: ${wins}`;
    document.getElementById('message').style.display = 'none';
    player = { x: 0, y: 0 };
    generateMaze();
    renderMaze();

    if (timer !== null) {
        clearInterval(timer);
    }
    if (gameLoop !== null) {
        clearInterval(gameLoop);
    }
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `Time: ${formatTime(timeLeft)}`;
        if (timeLeft < 0) {
            showMessage('    Times  Up    ');
        }
    }, 1000);
    gameLoop = setInterval(updateGameLoop, 150);
}

function braidMaze(prob=0.15) {
    for (let y=0; y<MAZE_SIZE; y++) {
        for (let x=0; x<MAZE_SIZE; x++) 
        {
            if (Math.random() >= prob) continue;
            const dirs = [];
            if (x>0) dirs.push(['left', x-1,y]);
            if (x<MAZE_SIZE-1) dirs.push(['right', x+1,y]);
            if (y>0) dirs.push(['top', x,y-1]);
            if (y<MAZE_SIZE-1) dirs.push(['bottom', x,y+1]);
            const pick = dirs[Math.floor(Math.random()*dirs.length)];
            if(!pick) continue;
            const dir = pick[0];
            if (dir === 'left') { maze[y][x].walls.left=false; maze[y][x-1].walls.right=false; }
            if (dir === 'right') { maze[y][x].walls.right=false; maze[y][x+1].walls.left=false; }
            if (dir === 'top') { maze[y][x].walls.top=false; maze[y-1][x].walls.bottom=false; }
            if (dir === 'bottom') { maze[y][x].walls.bottom=false; maze[y+1][x].walls.top=false; }
        }       
    }
}

document.addEventListener('keydown', (e) => {
    if (DIRECTION_MAP[e.key]) {
        keysPressed[e.key] = true;
        const dir = DIRECTION_MAP[e.key];
        const button = document.getElementById(dir);
        if (button) button.classList.add('hover-effect');
    }
});

document.addEventListener('keyup', (e) => {
    if (DIRECTION_MAP[e.key]) {
        keysPressed[e.key] = false;
        const dir = DIRECTION_MAP[e.key];
        const button = document.getElementById(dir);
        if (button) button.classList.remove('hover-effect');
    }
});

initGame();

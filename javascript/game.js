let clickCount = 0;

let playerX = 0;
let playerY = 0;

let obsticals = [
    {
        "x":1,
        "y":2,
        "image" : "rock"
    }, 
    {
        "x":7,
        "y":6,
        "image" : "rock"
    }
]

let xMin = 0;
let xMax = 10;
let yMin = 0;
let yMax = 10;

let gameListener;

let gameOn = 0;
let directionFacing = "down";

function connectedCallback(){
    window.addEventListener('scroll', stickyNavBar);
    setFrameHeight();
}

function stickyNavBar() {
    let headerEl = document.querySelector(".game-header");
    let top = headerEl.clientHeight; // for some reason getting this dynaimcally just returns 0
    let navbar = document.querySelector(".nav-bar");
    if (window.scrollY >= top) {
        navbar.classList.add('sticky');
        if (!gameOn){
            gameSetup();
            gameOn = 1;
        }
    } else {
        navbar.classList.remove('sticky'); // start game
        if (gameOn){
            gameEnd();
            gameOn = 0;
        }
    }
}

function gameSetup(){
    let navbarEl = document.querySelector(".nav-bar");
    let frameEl = document.querySelector(".frame");
    frameEl.style.marginTop = navbarEl.clientHeight + "px";
    document.addEventListener('keydown', gameControls);
    for (let y = 0; y < 10; y += 1){
        addRow(y);
        for (let x = 0; x < 10; x += 1){
            let newTile = addTile(x,y);
            let hasObstical = obsticals.filter(item => item.x === x && item.y === y);
            if (hasObstical.length >= 0){
                let obstical = document.createElement("img");
                obstical.setAttribute('src', "/images/" + hasObstical[0].image + ".png");
                newTile.appendChild(obstical);
            }
        }
    }
    setCharacter();
}

function addRow(y){
    let newRow = document.createElement("div");
    newRow.classList.add("grid-row");
    newRow.id = "row" + y;
    let frameEl = document.querySelector(".frame");
    frameEl.appendChild(newRow);
}

function addTile(x, y){
    let newDiv = document.createElement("div");
    if (x === 5){
        newDiv.classList.add("road");
    }else{
        newDiv.classList.add("grass");
    }
    newDiv.classList.add("grid-cell");
    newDiv.id = "row" + y + "col" + x;
    let rowEl = document.getElementById("row" + y);
    rowEl.appendChild(newDiv);
    return newDiv;
}

function gameEnd(){
    document.removeEventListener('keydown', gameControls);
    let frameEl = document.querySelector(".frame");
    frameEl.style.marginTop = "0px";
    while(frameEl.firstChild){
        frameEl.removeChild(frameEl.lastChild);
    }
}


function gameControls(event){
    let frameEl = document.getElementById("frameInfo");
    let initalX = playerX;
    let initalY = playerY;
    if (event.keyCode === 87){
        playerY -= 1;
        directionFacing = "up";
    }else if (event.keyCode === 65){
        playerX -= 1;
        directionFacing = "left";
    }else if (event.keyCode === 83){
        playerY += 1;
        directionFacing = "down";
    }else if (event.keyCode === 68){
        playerX += 1;
        directionFacing = "right";
    }
    let nextToObs = obsticals.filter(item => item.x === playerX && item.y === playerY);
    if (nextToObs.length >= 0){
        playerX = initalX;
        playerY = initalY;
    }
    edgeCheck();
    setCharacter();
}

function setCharacter(){
    let characterTiles = document.querySelectorAll(".character");
    for (let characterTile of characterTiles){
        characterTile.classList.remove('character');
        characterTile.removeChild(characterTile.lastChild);
    }
    let newCharacterTile = document.getElementById("row" + playerY + "col" + playerX);
    newCharacterTile.classList.add('character');
    let character = document.createElement("img");
    character.setAttribute('src', "/images/" + directionFacing + "Arrow.png");
    newCharacterTile.appendChild(character);
}

function setFrameHeight(){
    let navbarEl = document.querySelector(".nav-bar");
    let frameEl = document.querySelector(".frame");
    let frameHeight = window.outerHeight - navbarEl.clientHeight;
    console.log(frameHeight);
    frameEl.style.height = frameHeight + "px";
}

function edgeCheck(){
    if (playerX <= xMin)
        playerX = xMin;
    if (playerX >= xMax)
        playerX = xMax - 1;
    if (playerY <= yMin)
        playerY = yMin
    if (playerY >= yMax)
        playerY = yMax - 1
}
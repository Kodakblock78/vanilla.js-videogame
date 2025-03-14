const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 190;
canvas.height = 800;

let playerX = 0;
let playerY = 0;
let playerspeed = 5;
let currentItteration = 9;
let playerposition = 0;
function gameloop(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawPlayer();
    requestAnimationFrame(gameloop);

};

function movePlayer(window){
    switch (window.Event){
        case "ArrowUp":
            if (playerY > 0) playerY -= playerSpeed;
            break;
        case "ArrowDown":
            if (playerY < canvas.height) pla
    }
}

function drawPlayer(){
    if( playerposition < currentItteration){
    ctx.fillStyle="ORANGE";
    ctx.fillRect(playerY,,50,58);
    playerY++;
    playerX++;
    currentItteration++
    playerposition++
    setTimeout(drawPlayer, 10000000000)
    }
    

}
gameloop();
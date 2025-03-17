const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 890;
canvas.height = 800;

let playersAmount = 8; 
let players = [];

// Player class
class Player {
    constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.dx = (Math.random() > 0.5 ? 1 : -1) * this.speed;
        this.dy = (Math.random() > 0.5 ? 1 : -1) * this.speed;
        this.color = "black";  // All balls start as black
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;

        // Bounce off walls
        if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
            this.dx = -this.dx;
        }
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.dy = -this.dy;
        }
    }

    draw(ctx) {
        // Draw the player with the current color
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    changeDirection(dx, dy) {
        this.dx = dx * this.speed;
        this.dy = dy * this.speed;
    }

    contact(otherPlayer) {
        let dx = otherPlayer.x - this.x;
        let dy = otherPlayer.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.radius + otherPlayer.radius) {
            // Calculate angle of collision
            let angle = Math.atan2(dy, dx);

            // Move both players away slightly to avoid overlap
            let overlap = (this.radius + otherPlayer.radius) - distance;
            let moveX = Math.cos(angle) * (overlap / 2);
            let moveY = Math.sin(angle) * (overlap / 2);

            this.x -= moveX;
            this.y -= moveY;
            otherPlayer.x += moveX;
            otherPlayer.y += moveY;

            // Swap velocities (simple elastic collision)
            let tempDx = this.dx;
            let tempDy = this.dy;
            this.dx = otherPlayer.dx;
            this.dy = otherPlayer.dy;
            otherPlayer.dx = tempDx;
            otherPlayer.dy = tempDy;

            // Swap colors between the two colliding balls
            if (this.color === "black" && otherPlayer.color !== "black") {
                this.color = otherPlayer.color;  // Take the other's color
            } else if (otherPlayer.color === "black" && this.color !== "black") {
                otherPlayer.color = this.color;  // Take the other's color
            }

           

        }
    }

    // Function to get a random color for collision
    getCollisionColor() {
        const colors = ["orange", "blue", "green", "purple", "red", "white"];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// Function to spawn players without overlap
function spawnPlayer() {
    let radius = 20;
    let speed = Math.random() * 3 + 1;
    let validPosition = false;
    let x, y;

    while (!validPosition) {
        x = Math.random() * (canvas.width - 2 * radius) + radius;
        y = Math.random() * (canvas.height - 2 * radius) + radius;
        validPosition = true;

        for (let player of players) {
            let dx = player.x - x;
            let dy = player.y - y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < radius * 2) {
                validPosition = false;
                break;
            }
        }
    }

    return new Player(x, y, radius, speed);
}

// Create players
for (let i = 0; i < playersAmount; i++) {
    players.push(spawnPlayer());
}

// Randomly assign a color to one of the players
const randomIndex = Math.floor(Math.random() * players.length);
players[randomIndex].color = players[randomIndex].getCollisionColor();  // Assign color to one player

// Handle key press events
function movePlayers(event) {
    switch (event.key) {
        case "w":
            players.forEach(player => player.changeDirection(0, -2));
            break;
        case "d":
            players.forEach(player => player.changeDirection(0, 2));
            break;
        case "a":
            players.forEach(player => player.changeDirection(-2, 0));
            break;
        case "s":
            players.forEach(player => player.changeDirection(2, 0));
            break;
    }
}

// Attach event listener for keyboard input
window.addEventListener("keydown", movePlayers);

// Main game loop
function gameloop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < players.length; i++) {
        players[i].update();
        players[i].draw(ctx);
    }

    // Check for collisions
    for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
            players[i].contact(players[j]);
        }
    }

    requestAnimationFrame(gameloop);
}

gameloop();

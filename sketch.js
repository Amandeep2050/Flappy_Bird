const r = require("raylib");
const bf = require("./birdFunctions");

function running() {
    return !r.WindowShouldClose();
}

function getObstacle(upperX, upperHeight, screenHeight) {
    return {
        upper: {
            x: upperX, y: 0, width: 100, height: upperHeight,
        },
        lower: {
            x: upperX, y: upperHeight + 200, width: 100, height: screenHeight - (upperHeight + 200),
        },
        velocity: -5,
    }
}

function setup() {
    const screen = {
        WIDTH: 600,
        HEIGHT: 800,
        TITLE: "Flappy Bird",
        FPS: 50,
    }

    const bird = {
        dimestions: {
            x: 150,
            y: screen.HEIGHT / 2,
            width: 30,
            height: 30,
        },
        velocity: 2,
        acce: 1,
        flap: 5,
    }

    const pallete = {
        bg: r.WHITE,
        birdColor: r.BLUE,
    }

    const obstacles = [
        getObstacle(400, screen.HEIGHT / 2, screen.HEIGHT),
        getObstacle(700, screen.HEIGHT / 3, screen.HEIGHT),
        getObstacle(1000, screen.HEIGHT / 5, screen.HEIGHT),
    ]


    r.SetTraceLogLevel(r.LOG_NONE);
    r.InitWindow(screen.WIDTH, screen.HEIGHT, screen.TITLE);
    r.SetTargetFPS(screen.FPS);

    return {
        screen,
        bird,
        obstacles,
        pallete,
    }
}

function updatePosition(obstacle) {
    obstacle.upper.x += obstacle.velocity;
    obstacle.lower.x += obstacle.velocity;
}

function isOutOfBound(obstacle, screenWidth) {
    if (obstacle.upper.x + obstacle.upper.width <= 0) {
        obstacle.upper.x = screenWidth + 200;
        obstacle.lower.x = screenWidth + 200;
    }
}

function checkCollision(rec1, rec2) {
    const touchedHorizontally = (rec1.x < rec2.x + rec2.width) && (rec1.x + rec1.width) >= rec2.x;
    const touchedVertically = (rec2.y < rec1.y + rec1.height) && (rec2.y + rec2.height) >= rec1.y;

    if (touchedHorizontally && touchedVertically) return true;

    return false;
}

function moveObstacles(obstacles, screenWidth) {

}

function update(world) {
    const bird = world.bird
    const obstacles = world.obstacles;

    // flapping of bird completed.
    bf.updateVelocity(bird);
    bf.updatePosition(bird);
    bf.isOutOfBound(world);
    bf.isFlap(world);

    // obstacle movement
    moveObstacles(obstacles, world.screen.WIDTH);

    updatePosition(obstacles[0], world.screen.WIDTH);
    isOutOfBound(obstacles[0], world.screen.WIDTH);

    updatePosition(obstacles[1], world.screen.WIDTH);
    isOutOfBound(obstacles[1], world.screen.WIDTH);

    updatePosition(obstacles[2], world.screen.WIDTH);
    isOutOfBound(obstacles[2], world.screen.WIDTH);

    // Collision
    for (let i = 0; i < obstacles.length; i++) {
        if (checkCollision(bird.dimestions, obstacles[i].upper)) teardown();
        if (checkCollision(bird.dimestions, obstacles[i].lower)) teardown();
    }

}

function drawBird(bird, color) {
    r.DrawRectangleRec(bird.dimestions, color);
}

function drawObstacle(obstacle) {
    r.DrawRectangleRec(obstacle.upper, r.RED);
    r.DrawRectangleRec(obstacle.lower, r.RED);
}

function draw(world) {
    const obstacles = world.obstacles;

    r.BeginDrawing();
    r.ClearBackground(world.pallete.bg);

    drawBird(world.bird, world.pallete.birdColor);

    drawObstacle(obstacles[0]);
    drawObstacle(obstacles[1]);
    drawObstacle(obstacles[2]);

    r.EndDrawing();
}

function teardown() {
    r.CloseWindow();
}

module.exports = {
    running,
    setup,
    update,
    draw,
    teardown,
};
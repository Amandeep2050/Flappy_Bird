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

    const gameStates = {
        game: false,
        score: 0,
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
        gameStates,
    }
}

function updatePosition(obstacle) {
    obstacle.upper.x += obstacle.velocity;
    obstacle.lower.x += obstacle.velocity;
}

function resetObstacle(obstacle, screen) {
    const height = Math.floor(Math.random() * (screen.HEIGHT - 300));
    const newObstacle = getObstacle(screen.WIDTH + 200, height, screen.HEIGHT);
    obstacle.upper = newObstacle.upper;
    obstacle.lower = newObstacle.lower;
}

function isOutOfBound(obstacle, screen, gameStates) {
    if (obstacle.upper.x + obstacle.upper.width <= 0) {
        resetObstacle(obstacle, screen);
        gameStates.score += 1;
    }
}

function checkCollision(rec1, rec2) {
    const touchedHorizontally = (rec1.x < rec2.x + rec2.width) && (rec1.x + rec1.width) >= rec2.x;
    const touchedVertically = (rec2.y < rec1.y + rec1.height) && (rec2.y + rec2.height) >= rec1.y;

    if (touchedHorizontally && touchedVertically) return true;

    return false;
}

function moveObstacles(obstacles, screen, gameStates) {
    for (let i = 0; i < obstacles.length; i++) {
        updatePosition(obstacles[i], screen.WIDTH);
        isOutOfBound(obstacles[i], screen, gameStates);
    }
}

function doesCollide(obstacles, bird) {
    for (let i = 0; i < obstacles.length; i++) {
        if (checkCollision(bird, obstacles[i].upper)) teardown();
        if (checkCollision(bird, obstacles[i].lower)) teardown();
    }
}

function update(world) {
    const bird = world.bird
    const obstacles = world.obstacles;

    if (r.IsKeyPressed(r.KEY_SPACE)) world.gameStates.game = true;

    if (world.gameStates.game) {
        // flapping of bird completed.
        bf.updateVelocity(bird);
        bf.updatePosition(bird);
        bf.isOutOfBound(world);
        bf.isFlap(world);

        // obstacle movement
        moveObstacles(obstacles, world.screen, world.gameStates);
        doesCollide(obstacles, bird.dimestions);
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

    r.DrawText(world.gameStates.score + "", 10, 10, 15, r.BLUE);

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
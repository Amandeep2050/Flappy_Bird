const r = require("raylib");

function running() {
    return !r.WindowShouldClose();
}

function setup() {
    const screen = {
        WIDTH: 900,
        HEIGHT: 600,
        TITLE: "collision of recs",
        FPS: 50,
    }

    const recs = [
        { x: 100, y: 200, width: 200, height: 300 },
        { x: 100, y: 501, width: 50, height: 50 },
    ]

    r.SetTraceLogLevel(r.LOG_NONE);
    r.InitWindow(screen.WIDTH, screen.HEIGHT, screen.TITLE);
    r.SetTargetFPS(screen.FPS);

    return {
        screen,
        recs,
    }
}

function update(world) {

}

function checkCollision(rec1, rec2) {
    const touchedHorizontally = (rec1.x < rec2.x + rec2.width) && (rec1.x + rec1.width) >= rec2.x;
    const touchedVertically = (rec2.y < rec1.y + rec1.height) && (rec2.y + rec2.height) >= rec1.y;

    if (touchedHorizontally && touchedVertically) return true;

    return false;
}

function getColor(isCollision) {
    return isCollision ? r.RED : r.BLUE;
}

function draw(world) {
    const recs = world.recs;

    r.BeginDrawing();
    r.ClearBackground(r.BLACK);

    r.DrawRectangleRec(recs[0], getColor(checkCollision(recs[0], recs[1])));

    const mouPos = r.GetMousePosition();
    recs[1].x = mouPos.x;
    recs[1].y = mouPos.y;

    r.DrawRectangleRec(recs[1], getColor(checkCollision(recs[0], recs[1])));

    r.EndDrawing();
}

function teardown() {
    r.CloseWindow();
}

function loop(world) {
    while (running()) {
        update(world);
        draw(world);
    }
}

function main() {
    const world = setup();
    loop(world);
    teardown();
}

main();
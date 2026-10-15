const r = require("raylib");

function updateVelocity(bird) {
    bird.velocity += bird.acce;
}

function updatePosition(bird) {
    bird.dimestions.y += bird.velocity;
}

function isOutOfBound(world) {
    const bird = world.bird;
    const screen = world.screen;

    if (bird.dimestions.y + bird.dimestions.height >= screen.HEIGHT || bird.dimestions.y <= 0) {
        teardown();
    }
}

function isFlap(world) {
    const bird = world.bird;

    if (r.IsKeyPressed(r.KEY_SPACE)) {
        bird.velocity = -12;
    }
}

module.exports = {
    updateVelocity,
    updatePosition,
    isOutOfBound,
    isFlap,
}
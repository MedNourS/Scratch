"use strict";

let isKeyBased = true;
let isAccelerationBased = true;
let isGravity = false;

$(function () {
    const $div = $("div.movable");
    const $img = $("div.movable>img");

    let top = parseInt($div.css("top")) || 100;
    let left = parseInt($div.css("left")) || 100;

    let vx = 0;
    let vy = 0;

    const acceleration = 0.75;
    const friction = 0.95;
    let gravity = 0.2;
    let jumpForce = 5;

    const keys = {w: false, a: false, s: false, d: false, space: false};

    $(document).on("keydown", function (e) {
        let key = e.key.toLowerCase();
        if (key === " ") key = "space";

        if (keys.hasOwnProperty(key)) {
            keys[key] = true;
        }

        console.log(key)
    });

    $(document).on("keyup", function (e) {
        let key = e.key.toLowerCase();
        if (key === " ") key = "space";

        if (keys.hasOwnProperty(key)) {
            keys[key] = false;
            e.preventDefault();
        }
    });

    $div.on("click", function () {
        $(this).children().fadeToggle(500);
    });

    function update() {
        if (isKeyBased) {
            if ((keys.a && keys.d) || (!keys.a && !keys.d)) {
                $img.attr("src", "assets/img/idle-sprite.png");
            } else if (keys.a) {
                $img.attr("src", "assets/img/left-sprite.png");
            } else if (keys.d) {
                $img.attr("src", "assets/img/right-sprite.jpg");
            }
        } else {
            if (-0.25 <= vx && vx <= 0.25) {
                $img.attr("src", "assets/img/idle-sprite.png");
            } else if (vx <= 0) {
                $img.attr("src", "assets/img/left-sprite.png");
            } else if (0 <= vx) {
                $img.attr("src", "assets/img/right-sprite.jpg");
            }
        }

        if (isGravity) {
            if (top + 403.5 + vy + gravity < $(window).innerHeight()) {
                vy += (gravity);
            } else {
                vy = 0;
                if (keys.space) vy -= jumpForce;
            }

            if (keys.a) vx -= acceleration;
            if (keys.d) vx += acceleration;

            vx *= friction;

            top += vy;
            left += vx;
        } else if (isAccelerationBased) {
            if (keys.w) vy -= acceleration;
            if (keys.s) vy += acceleration;
            if (keys.a) vx -= acceleration;
            if (keys.d) vx += acceleration;

            vx *= friction;
            vy *= friction;

            top += vy;
            left += vx;

        } else {
            let step = 10;

            if (keys.w) top -= step;
            if (keys.s) top += step;
            if (keys.a) left -= step;
            if (keys.d) left += step;
        }

        $div.css({top: top + "px", left: left + "px"});

        requestAnimationFrame(update);
    }

    update();
});

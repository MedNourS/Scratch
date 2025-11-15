"use strict";

let isKeyBased = true;
let isAccelerationBased = true;
let isGravityBased = false;

let acceleration = 0.75;
let friction = 0.95;
let gravity = 0.2;
let jumpForce = 5;
let step = 10;

let fps = 165

document.addEventListener("DOMContentLoaded", () => {
    const div = document.querySelector("div.movable");
    const img = document.querySelector("div.movable>img");

    const topPlatforms = document.querySelectorAll("div.platform-top");
    const rightPlatforms = document.querySelectorAll("div.platform-right");
    const bottomPlatforms = document.querySelectorAll("div.platform-bottom");
    const leftPlatforms = document.querySelectorAll("div.platform-left");

    const divInputs = document.querySelector("#inputs")
    const isKeyBasedInput = document.querySelector("#isKeyBased");
    const isAccelerationBasedInput = document.querySelector("#isAccelerationBased");
    const isGravityBasedInput = document.querySelector("#isGravityBased");
    const fpsInput = document.querySelector("#fps");
    const param1Label = document.querySelector("#param1-label");
    const param1Input = document.querySelector("#param1");
    const param2Label = document.querySelector("#param2-label");
    const param2Input = document.querySelector("#param2");

    let top = parseInt((div.style.top).slice(0, -2)) | 100;
    let bottom = top + div.clientHeight;
    let left = parseInt((div.style.left).slice(0, -2)) | 100;
    let right = left + div.clientWidth;

    let vx = 0;
    let vy = 0;

    const keys = { w: false, a: false, s: false, d: false, space: false };

    let platformTopCollisions = false;
    let platformRightCollisions = false;
    let platformBottomCollisions = false;
    let platformLeftCollisions = false;

    function handleInputs() {
        isKeyBased = isKeyBasedInput.checked;
        isAccelerationBased = isAccelerationBasedInput.checked;
        isGravityBased = isGravityBasedInput.checked;
        fps = fpsInput.value;

        if (isGravityBased) {
            param1Label.innerHTML = "Gravity (0-1): ";

            (0 <= parseFloat(param1Input.value) && parseFloat(param1Input.value) <= 1) ? gravity = parseFloat(param1Input.value) : gravity = 0.35;
            param1Input.setAttribute("min", "0");
            param1Input.setAttribute("max", "1");
            param1Input.setAttribute("step", "0.05");
            param1Input.setAttribute("value", gravity);

            param2Label.style.display = "";
            param2Label.innerHTML = "Jump force (0-inf): ";

            param2Input.style.display = "";
            (0 <= parseFloat(param2Input.value)) ? jumpForce = parseFloat(param2Input.value) : jumpForce = 10;
            param2Input.setAttribute("min", "0");
            param2Input.setAttribute("step", "2.5");
            param2Input.setAttribute("value", jumpForce);
        } else if (isAccelerationBased) {
            param1Label.innerHTML = "Acceleration (0-1): ";

            (0 <= parseFloat(param1Input.value) && parseFloat(param1Input.value) <= 1) ? acceleration = parseFloat(param1Input.value) : acceleration = 0.75;
            param1Input.setAttribute("min", "0");
            param1Input.setAttribute("max", "1");
            param1Input.setAttribute("step", "0.05");
            param1Input.setAttribute("value", acceleration);

            param2Label.style.display = "";
            param2Label.innerHTML = "Friction (0-1): ";

            param2Input.style.display = "";
            (0 <= parseFloat(param1Input.value) && parseFloat(param1Input.value) <= 1) ? friction = parseFloat(param2Input.value) : friction = 0.95;
            param2Input.setAttribute("min", "0");
            param2Input.setAttribute("max", "1");
            param2Input.setAttribute("step", "0.05");
            param2Input.setAttribute("value", friction);
        } else {
            param1Label.innerHTML = "Step: ";

            step = parseFloat(param1Input.value);
            param1Input.setAttribute("min", "");
            param1Input.setAttribute("max", "");
            param1Input.setAttribute("value", step);

            param2Label.style.display = "none";

            param2Input.style.display = "none";
        }
    }

    document.addEventListener("keydown", (e) => {
        let key = e.key;
        if (key === " ") key = "space";

        if (keys.hasOwnProperty(key)) {
            keys[key] = true;
        }
    });

    document.addEventListener("keyup", (e) => {
        let key = e.key;
        if (key === " ") key = "space";

        if (keys.hasOwnProperty(key)) {
            keys[key] = false;
        }
    });

    document.addEventListener("click", (e) => {
        if (!(
            e.clientX <= divInputs.clientWidth
            &&
            e.clientY <= divInputs.clientHeight
        )) {
            (divInputs.style.display === "") ? divInputs.style.display = "none" : divInputs.style.display = "";
        }
    });

    function playerMove(collisionState) {

        if (collisionState === undefined) {
            if (isGravityBased) {
                vy += (gravity);

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
        } else {
            if (collisionState[0] === true) {
                // Add top moving logic
                console.log("Collision top");
                if (0 < vy) vy = 0;
                if (keys.space) vy -= jumpForce;

                if (keys.a) vx -= acceleration;
                if (keys.d) vx += acceleration;

                vx *= friction;

                top += vy;
                left += vx;
            }

            if (collisionState[1] === true) {
                // Add right moving logic
                console.log("Collision right");
            }
            
            if (collisionState[2] === true) {
                // Add bottom moving logic                
                console.log("Collision bottom");
                if (vy < 0) vy = 0;

                if (keys.a) vx -= acceleration;
                if (keys.d) vx += acceleration;

                vx *= friction;

                top += vy;
                left += vx;
            }
            
            if (collisionState[3] === true) {
                // Add left moving logic
                console.log("Collision left");
            }
        }

    }

    function update() {
        handleInputs();

        if (isKeyBased) {
            if ((keys.a && keys.d) || (!keys.a && !keys.d)) {
                img.setAttribute("src", "assets/img/idle-sprite.png");
            } else if (keys.a) {
                img.setAttribute("src", "assets/img/left-sprite.png");
            } else if (keys.d) {
                img.setAttribute("src", "assets/img/right-sprite.png");
            }
        } else {
            if (-0.25 <= vx && vx <= 0.25) {
                img.setAttribute("src", "assets/img/idle-sprite.png");
            } else if (vx <= 0) {
                img.setAttribute("src", "assets/img/left-sprite.png");
            } else if (0 <= vx) {
                img.setAttribute("src", "assets/img/right-sprite.png");
            }
        }

        topPlatforms.forEach((platform, index) => {
            let platformTop = parseInt((platform.style.top).slice(0, -2));
            let platformLeft = parseInt((platform.style.left).slice(0, -2));
            let platformRight = platformLeft + platform.clientWidth;

            platformTopCollisions = (
                (platformLeft < (left + right) / 2 && (left + right) / 2 < platformRight)
                &&
                (bottom <= platformTop)
                &&                
                (platformTop <= bottom + vy + gravity)
                &&
                isGravityBased
            )
        });

        rightPlatforms.forEach((platform) => {
            let platformLeft = parseInt((platform.style.left).slice(0, -2));
            let platformRight = platformLeft + platform.clientWidth;

            platformRightCollisions
            if (
                (platformLeft < (left + right) / 2 && (left + right) / 2 < platformRight)
                &&
                (platformRight <= left - ((isGravityBased || isAccelerationBased) ? vx - acceleration : step))
                &&
                isGravityBased
            ) {
                platformRightCollisions = true;
            } else {
                platformRightCollisions = false;
            }
        });

        bottomPlatforms.forEach((platform) => {
            let platformTop = parseInt((platform.style.top).slice(0, -2));
            let platformBottom = platformTop + platform.clientHeight;
            let platformLeft = parseInt((platform.style.left).slice(0, -2));
            let platformRight = platformLeft + platform.clientWidth;

            if (
                (platformLeft < (left + right) / 2 && (left + right) / 2 < platformRight)
                &&
                (platformBottom <= top)
                &&
                (top + vy <= platformBottom)
                &&
                isGravityBased
            ) {
                platformBottomCollisions = true;
            } else {
                platformBottomCollisions = false;
            }
        });

        leftPlatforms.forEach((platform) => {
            let platformLeft = parseInt((platform.style.left).slice(0, -2));

            if (
                (right < platformLeft)
                &&
                isGravityBased
            ) {
                platformLeftCollisions = true;
            } else {
                platformLeftCollisions = false;
            }
        });

        if (
            (topPlatforms.length + rightPlatforms.length + bottomPlatforms.length + leftPlatforms.length == 0)
            ||
            !(platformTopCollisions || platformRightCollisions || platformBottomCollisions || platformLeftCollisions)
        ) {
            // Insert player movement code here
            playerMove();
        } else {
            playerMove([platformTopCollisions, platformRightCollisions, platformBottomCollisions, platformLeftCollisions]);
        }


        div.style.top = top + "px";
        bottom = top + div.clientHeight;
        div.style.left = left + "px";
        right = left + div.clientWidth;

        setTimeout(() => {
            requestAnimationFrame(update);
        }, 1000 / fps);
    }

    update();
});
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

    const horizontalPlatforms = document.querySelectorAll("div.platform-horizontal")

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

        horizontalPlatforms.forEach((platform) => {
            let platformTop = parseInt((platform.style.top).slice(0, -2));
            let platformBottom = platformTop + platform.clientHeight;
            let platformLeft = parseInt((platform.style.left).slice(0, -2));
            let platformRight = platformLeft + platform.clientWidth;

            if (
                (platformLeft <= (right+left)/2 && (right+left)/2 <= platformRight)
                &&
                isGravityBased
            ) { // If the player is located above or below the platform
                if (bottom <= platformTop) { // Case 1: Player above platform
                    if (top + div.clientHeight < platformTop) {
                        vy += (gravity);
                    } else {
                        vy = 0;
                        if (keys.space) vy -= jumpForce;
                    }
                    if (keys.a) vx -= acceleration;
                    if (keys.d) vx += acceleration;
                } else if (platformBottom <= top) { // Case 2: Player below platform
                    if (top + div.clientHeight < window.innerHeight) {
                        vy += (gravity);
                    } else {
                        vy = 0;
                        if (keys.space) vy -= jumpForce;
                    }
                    if (keys.a) vx -= acceleration;
                    if (keys.d) vx += acceleration;
                } else { // Case 3: Player inside platform
                    if (bottom < (platformTop+platformBottom)/2) { // Subcase 1: Player in top half
                        top = platformTop - img.clientHeight;
                        vy = 0;
                        if (keys.space) vy -= jumpForce;
                    } else if ((platformTop+platformBottom)/2 <= top) { // Subcase 2: Player in bottom half
                        top = platformBottom;
                        vy = 0;
                    }
                }
                vx *= friction;
                top += vy;
                left += vx;
            } else if (
                (platformTop <= (top+bottom)/2 && (top+bottom)/2 <= platformBottom)
                &&
                isGravityBased
            ) { // If the player is located right or left of the platform
                vy += (gravity);
				if (keys.a) vx -= acceleration;
                if (keys.d) vx += acceleration;
				vx *= friction;
                top += vy;
                left += vx;
            } else {
                if (isGravityBased) {
                    if (top + div.clientHeight < window.innerHeight) {
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
                    if (keys.w) top -= step;
                    if (keys.s) top += step;
                    if (keys.a) left -= step;
                    if (keys.d) left += step;
                }
            }
        });
        
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
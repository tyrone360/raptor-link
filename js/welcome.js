/* =====================================
   RAPTOR LINK - WELCOME CONTROLLER
   SLIDE TO ENTER
===================================== */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const track = document.getElementById("swipeTrack");
    const handle = document.getElementById("swipeHandle");
    const progress = document.getElementById("swipeProgress");
    const swipeText = document.getElementById("swipeText");

    if (!track || !handle || !progress || !swipeText) {
        console.error("RAPTOR LINK: Swipe elements could not be found.");
        return;
    }

    let isDragging = false;
    let startX = 0;
    let startLeft = 6;
    let currentLeft = 6;
    let isEntering = false;

    function getMaximumLeft() {
        return track.clientWidth - handle.offsetWidth - 6;
    }

    function updateSlider(left) {
        const maximum = getMaximumLeft();

        currentLeft = Math.max(6, Math.min(left, maximum));

        handle.style.left = currentLeft + "px";

        const progressWidth =
            currentLeft + handle.offsetWidth + 6;

        progress.style.width =
            Math.min(100, (progressWidth / track.clientWidth) * 100) + "%";
    }

    function enterShowroom() {
        if (isEntering) return;

        isEntering = true;

        updateSlider(getMaximumLeft());

        swipeText.textContent = "WELCOME TO RAPTOR LINK";

        handle.style.cursor = "default";

        document.body.style.transition = "opacity 0.35s ease";
        document.body.style.opacity = "0";

        console.log("RAPTOR LINK: Entering showroom...");

        setTimeout(function () {
            window.location.href = "index.html";
        }, 350);
    }

    function resetSlider() {
        if (isEntering) return;

        updateSlider(6);

        swipeText.textContent = "SLIDE TO ENTER";
    }

    handle.addEventListener("pointerdown", function (event) {
        if (isEntering) return;

        isDragging = true;
        startX = event.clientX;
        startLeft = currentLeft;

        handle.setPointerCapture(event.pointerId);
        handle.style.cursor = "grabbing";

        event.preventDefault();
    });

    handle.addEventListener("pointermove", function (event) {
        if (!isDragging || isEntering) return;

        const distance = event.clientX - startX;

        updateSlider(startLeft + distance);

        const percentage =
            (currentLeft - 6) / (getMaximumLeft() - 6);

        if (percentage >= 0.45) {
            swipeText.textContent = "KEEP SLIDING...";
        } else {
            swipeText.textContent = "SLIDE TO ENTER";
        }
    });

    function finishDrag() {
        if (!isDragging) return;

        isDragging = false;
        handle.style.cursor = "grab";

        if (isEntering) return;

        const percentage =
            (currentLeft - 6) / (getMaximumLeft() - 6);

        if (percentage >= 0.80) {
            enterShowroom();
        } else {
            resetSlider();
        }
    }

    handle.addEventListener("pointerup", finishDrag);
    handle.addEventListener("pointercancel", finishDrag);

    handle.addEventListener("keydown", function (event) {
        if (isEntering) return;

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {
            event.preventDefault();
            enterShowroom();
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();
            enterShowroom();
        }
    });

    window.addEventListener("resize", function () {
        if (!isDragging && !isEntering) {
            updateSlider(6);
        }
    });

    updateSlider(6);

    console.log("RAPTOR LINK: Welcome swipe controller loaded.");

});

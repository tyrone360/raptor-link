
/* =====================================
   RAPTOR LINK - CUSTOM LAB
   DUAL VEHICLE CUSTOMISER
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // ELEMENT REFERENCES
    // =====================================

    const vehicleImage = document.getElementById("customVehicleImage");
    const vehicleModelName = document.getElementById("vehicleModelName");
    const buildStatus = document.getElementById("selectedBuildStatus");

    const modelButtons = document.querySelectorAll(".model-choice");

    const raptorColourSection = document.getElementById("raptorColourSection");
    const platinumColourSection = document.getElementById("platinumColourSection");

    const raptorColourButtons = document.querySelectorAll(
        "#colourOptions .colour-choice"
    );

    const platinumColourButtons = document.querySelectorAll(
        "#platinumColourOptions .colour-choice"
    );


    // =====================================
    // RAPTOR IMAGE COLLECTION
    // =====================================

    const raptorImages = {
        original: "assets/images/colours/Factorie.png",
        red: "assets/images/colours/Red.png",
        blue: "assets/images/colours/Perfomance blue.png",
        black: "assets/images/colours/Shadow black.png",
        grey: "assets/images/colours/Grey.png",
        orange: "assets/images/colours/Code orange.png"
    };


    // =====================================
    // PLATINUM IMAGE COLLECTION
    // =====================================

    const platinumImages = {
        "platinum-white": "assets/images/colours/Frozen white.png",
        "platinum-black": "assets/images/colours/Aget black.png",
        "platinum-grey": "assets/images/colours/Carbonized grey.png",
        "platinum-silver": "assets/images/colours/Icon silver.png",
        "platinum-red": "assets/images/colours/Lucid red.png",
        "platinum-green": "assets/images/colours/Acacia green.png"
    };


    // =====================================
    // VEHICLE STATE
    // =====================================

    let currentModel = "raptor";

    const selectedColours = {
        raptor: "original",
        platinum: "platinum-white"
    };


    // =====================================
    // UPDATE VEHICLE PREVIEW
    // =====================================

    function updateVehiclePreview() {

        const isRaptor = currentModel === "raptor";

        const imageCollection = isRaptor
            ? raptorImages
            : platinumImages;

        const selectedColour = selectedColours[currentModel];
        const imagePath = imageCollection[selectedColour];

        if (!imagePath || !vehicleImage) {
            console.error("Vehicle image not configured:", selectedColour);
            return;
        }

        vehicleImage.onerror = function () {
            console.error("Unable to load image:", imagePath);
        };

        vehicleImage.onload = function () {
            vehicleImage.style.filter = "none";
        };

        vehicleImage.src = imagePath;

        // Update vehicle name
        if (vehicleModelName) {
            vehicleModelName.textContent = isRaptor
                ? "FORD RANGER RAPTOR"
                : "FORD RANGER PLATINUM";
        }

        // Update selected colour name
        const activeButtons = isRaptor
            ? raptorColourButtons
            : platinumColourButtons;

        const selectedButton = Array.from(activeButtons).find(
            button => button.dataset.colour === selectedColour
        );

        if (buildStatus && selectedButton) {
            const colourLabel = selectedButton.querySelector("span:last-child");

            buildStatus.textContent = colourLabel
                ? colourLabel.textContent.trim()
                : selectedColour;
        }

    }


    // =====================================
    // SWITCH VEHICLE MODEL
    // =====================================

    modelButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const selectedModel = button.dataset.model;

            if (selectedModel !== "raptor" &&
                selectedModel !== "platinum") {
                return;
            }

            currentModel = selectedModel;

            // Update model button appearance
            modelButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            // Show correct colour collection
            if (raptorColourSection) {
                raptorColourSection.hidden = currentModel !== "raptor";
            }

            if (platinumColourSection) {
                platinumColourSection.hidden = currentModel !== "platinum";
            }

            updateVehiclePreview();

        });

    });


    // =====================================
    // RAPTOR COLOUR SELECTION
    // =====================================

    raptorColourButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            selectedColours.raptor = button.dataset.colour;

            raptorColourButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            if (currentModel === "raptor") {
                updateVehiclePreview();
            }

        });

    });


    // =====================================
    // PLATINUM COLOUR SELECTION
    // =====================================

    platinumColourButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            selectedColours.platinum = button.dataset.colour;

            platinumColourButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            if (currentModel === "platinum") {
                updateVehiclePreview();
            }

        });

    });


    // =====================================
    // INITIALISE CUSTOM LAB
    // =====================================

    const initialRaptorButton = document.querySelector(
        '#colourOptions .colour-choice[data-colour="original"]'
    );

    if (initialRaptorButton) {
        initialRaptorButton.classList.add("active");
    }

    const initialPlatinumButton = document.querySelector(
        '#platinumColourOptions .colour-choice[data-colour="platinum-white"]'
    );

    if (initialPlatinumButton) {
        initialPlatinumButton.classList.add("active");
    }

    if (raptorColourSection) {
        raptorColourSection.hidden = false;
    }

    if (platinumColourSection) {
        platinumColourSection.hidden = true;
    }

    updateVehiclePreview();
/* =====================================
   VIRTUAL RAPTOR COCKPIT SIMULATION
===================================== */

const engineStatus = document.getElementById("engineStatus");
const speedValue = document.getElementById("speedValue");
const rpmValue = document.getElementById("rpmValue");
const gearValue = document.getElementById("gearValue");

const engineToggle = document.getElementById("engineToggle");
const lightsToggle = document.getElementById("lightsToggle");
const wipersToggle = document.getElementById("wipersToggle");
const lockToggle = document.getElementById("lockToggle");
const accelerateButton = document.getElementById("accelerateButton");
const brakeButton = document.getElementById("brakeButton");

let engineRunning = false;
let lightsOn = false;
let wipersOn = false;
let vehicleLocked = false;
let simulatedSpeed = 0;

function updateDashboard() {
    if (speedValue) {
        speedValue.textContent = simulatedSpeed;
    }

    if (rpmValue) {
        const rpm = engineRunning
            ? Math.round(800 + simulatedSpeed * 45)
            : 0;

        rpmValue.textContent = rpm.toLocaleString();
    }

    if (gearValue) {
        if (!engineRunning) {
            gearValue.textContent = "P";
        } else if (simulatedSpeed === 0) {
            gearValue.textContent = "P";
        } else if (simulatedSpeed < 25) {
            gearValue.textContent = "1";
        } else if (simulatedSpeed < 50) {
            gearValue.textContent = "2";
        } else if (simulatedSpeed < 80) {
            gearValue.textContent = "3";
        } else {
            gearValue.textContent = "4";
        }
    }
}

function updateDrivingButtons() {
    if (accelerateButton) {
        accelerateButton.disabled = !engineRunning;
    }

    if (brakeButton) {
        brakeButton.disabled = !engineRunning || simulatedSpeed === 0;
    }
}

// ENGINE
if (engineToggle) {
    engineToggle.addEventListener("click", function () {
        engineRunning = !engineRunning;

        if (!engineRunning) {
            simulatedSpeed = 0;
        }

        engineStatus.textContent = engineRunning
            ? "ENGINE RUNNING"
            : "ENGINE OFF";

        engineStatus.classList.toggle("engine-on", engineRunning);
        engineStatus.classList.toggle("engine-off", !engineRunning);

        engineToggle.textContent = engineRunning
            ? "STOP ENGINE"
            : "START ENGINE";

        engineToggle.classList.toggle("active", engineRunning);

        updateDashboard();
        updateDrivingButtons();
    });
}

// LIGHTS
if (lightsToggle) {
    lightsToggle.addEventListener("click", function () {
        lightsOn = !lightsOn;

        lightsToggle.textContent = lightsOn
            ? "LIGHTS ON"
            : "LIGHTS OFF";

        lightsToggle.classList.toggle("active", lightsOn);
    });
}

// WIPERS
if (wipersToggle) {
    wipersToggle.addEventListener("click", function () {
        wipersOn = !wipersOn;

        wipersToggle.textContent = wipersOn
            ? "WIPERS ON"
            : "WIPERS OFF";

        wipersToggle.classList.toggle("active", wipersOn);
    });
}

// DOOR LOCKS
if (lockToggle) {
    lockToggle.addEventListener("click", function () {
        vehicleLocked = !vehicleLocked;

        lockToggle.textContent = vehicleLocked
            ? "LOCKED"
            : "UNLOCKED";

        lockToggle.classList.toggle("active", vehicleLocked);
    });
}

// ACCELERATOR
if (accelerateButton) {
    accelerateButton.addEventListener("click", function () {
        if (!engineRunning) return;

        simulatedSpeed = Math.min(simulatedSpeed + 10, 200);

        updateDashboard();
        updateDrivingButtons();
    });
}

// BRAKE
if (brakeButton) {
    brakeButton.addEventListener("click", function () {
        if (!engineRunning) return;

        simulatedSpeed = Math.max(simulatedSpeed - 20, 0);

        updateDashboard();
        updateDrivingButtons();
    });
}

// INITIAL DASHBOARD STATE
if (engineStatus) {
    engineStatus.classList.add("engine-off");
}

updateDashboard();
updateDrivingButtons();

/* =====================================
   RAPTOR LINK - PARKING ASSIST SIMULATION
===================================== */

const parkingToggle = document.getElementById("parkingToggle");
const parkingReverse = document.getElementById("parkingReverse");
const parking360 = document.getElementById("parking360");

const parkingStatus = document.getElementById("parkingStatus");
const parkingViewTitle = document.getElementById("parkingViewTitle");
const parkingWarning = document.getElementById("parkingWarning");

const frontDistance = document.getElementById("frontDistance");
const rearDistance = document.getElementById("rearDistance");

const frontSensorIndicator = document.getElementById("frontSensorIndicator");
const rearSensorIndicator = document.getElementById("rearSensorIndicator");

let parkingActive = false;
let parkingMode = "360";

function updateParkingSensor(indicator, distance) {
    if (!indicator) return;

    indicator.classList.remove("safe", "warning", "danger");

    if (distance <= 0.5) {
        indicator.classList.add("danger");
    } else if (distance <= 1) {
        indicator.classList.add("warning");
    } else {
        indicator.classList.add("safe");
    }
}

function updateParkingDisplay(front, rear) {
    if (frontDistance) {
        frontDistance.textContent = front.toFixed(1) + " m";
    }

    if (rearDistance) {
        rearDistance.textContent = rear.toFixed(1) + " m";
    }

    updateParkingSensor(frontSensorIndicator, front);
    updateParkingSensor(rearSensorIndicator, rear);

    if (!parkingWarning) return;

    parkingWarning.classList.remove("safe", "warning", "danger");

    if (front <= 0.5 || rear <= 0.5) {
        parkingWarning.textContent = "STOP! OBSTACLE VERY CLOSE";
        parkingWarning.classList.add("danger");
    } else if (front <= 1 || rear <= 1) {
        parkingWarning.textContent = "CAUTION — OBSTACLE NEARBY";
        parkingWarning.classList.add("warning");
    } else {
        parkingWarning.textContent = "SURROUNDINGS CLEAR — SIMULATION";
        parkingWarning.classList.add("safe");
    }
}

function activateParking() {
    parkingActive = true;

    if (parkingStatus) {
        parkingStatus.textContent = "SYSTEM ACTIVE";
        parkingStatus.classList.add("active");
    }

    if (parkingToggle) {
        parkingToggle.textContent = "DEACTIVATE PARKING ASSIST";
        parkingToggle.classList.add("active");
    }

    showParkingMode(parkingMode);
}

function deactivateParking() {
    parkingActive = false;

    if (parkingStatus) {
        parkingStatus.textContent = "SYSTEM OFF";
        parkingStatus.classList.remove("active");
    }

    if (parkingToggle) {
        parkingToggle.textContent = "ACTIVATE PARKING ASSIST";
        parkingToggle.classList.remove("active");
    }

    if (parkingReverse) parkingReverse.classList.remove("active");
    if (parking360) parking360.classList.remove("active");

    if (parkingViewTitle) {
        parkingViewTitle.textContent = "RAPTOR 360° VIEW";
    }

    if (frontDistance) frontDistance.textContent = "--";
    if (rearDistance) rearDistance.textContent = "--";

    if (frontSensorIndicator) {
        frontSensorIndicator.classList.remove("safe", "warning", "danger");
    }

    if (rearSensorIndicator) {
        rearSensorIndicator.classList.remove("safe", "warning", "danger");
    }

    if (parkingWarning) {
        parkingWarning.textContent = "PARKING ASSIST INACTIVE";
        parkingWarning.classList.remove("safe", "warning", "danger");
    }
}

function showParkingMode(mode) {
    if (!parkingActive) {
        activateParking();
    }

    parkingMode = mode;

    if (parkingReverse) parkingReverse.classList.remove("active");
    if (parking360) parking360.classList.remove("active");

    if (mode === "reverse") {
        if (parkingViewTitle) {
            parkingViewTitle.textContent = "REAR REVERSING CAMERA";
        }

        if (parkingReverse) parkingReverse.classList.add("active");

        // Simulated reversing scenario
        updateParkingDisplay(1.8, 0.6);

    } else {
        if (parkingViewTitle) {
            parkingViewTitle.textContent = "RAPTOR 360° SURROUND VIEW";
        }

        if (parking360) parking360.classList.add("active");

        // Simulated surround-view scenario
        updateParkingDisplay(1.8, 2.4);
    }
}

// ACTIVATE / DEACTIVATE PARKING ASSIST
if (parkingToggle) {
    parkingToggle.addEventListener("click", function () {
        if (parkingActive) {
            deactivateParking();
        } else {
            activateParking();
        }
    });
}

// REVERSE CAMERA
if (parkingReverse) {
    parkingReverse.addEventListener("click", function () {
        showParkingMode("reverse");
    });
}

// 360 DEGREE CAMERA
if (parking360) {
    parking360.addEventListener("click", function () {
        showParkingMode("360");
    });
}

// INITIAL PARKING STATE
deactivateParking();

    console.log("RAPTOR CUSTOM LAB: Both vehicle collections loaded successfully.");

});

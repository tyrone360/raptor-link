
/* =========================================
   RAPTOR LINK — SHOWROOM CONTROLLER
   Search • Vehicle Details • Saved Vehicles
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    // =====================================
    // VEHICLE DATA
    // =====================================

    const vehicles = {
        raptor: {
            id: "raptor",
            name: "Ranger Raptor",
            category: "FORD RANGER",
            image: "assets/images/raptor-desert.webp",
            description: "Built for power and adventure.",
            highlights: [
                "Ford Ranger Raptor design",
                "Built for power and adventure",
                "Enquire for availability"
            ]
        },

        platinum: {
            id: "platinum",
            name: "Ranger Platinum",
            category: "FORD RANGER",
            image: "assets/images/platinum-front.webp",
            description: "Premium luxury and performance.",
            highlights: [
                "Premium Ford Ranger design",
                "Luxury-focused appearance",
                "Enquire for availability"
            ]
        }
    };

    // =====================================
    // ELEMENT REFERENCES
    // =====================================

    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("vehicleSearch");

    const offersGrid = document.querySelector(
        ".offers-section .offers-grid"
    );

    const savedGrid = document.getElementById("savedVehiclesGrid");
    const savedCount = document.getElementById("savedVehiclesCount");
    const emptySavedMessage = document.getElementById("emptySavedMessage");
    const savedNavBadge = document.getElementById("savedNavBadge");

    const modal = document.getElementById("vehicleModal");
    const modalClose = document.getElementById("closeVehicleModal");

    const modalImage = document.getElementById("modalVehicleImage");
    const modalCategory = document.getElementById("modalVehicleCategory");
    const modalName = document.getElementById("modalVehicleName");
    const modalDescription = document.getElementById("modalVehicleDescription");
    const modalHighlights = document.getElementById("modalVehicleHighlights");
    const modalSpecs = document.getElementById("modalVehicleSpecs");

    const saveButton = document.getElementById("saveVehicleButton");
    const enquireButton = document.getElementById("enquireVehicleButton");

    let currentVehicle = null;

    const STORAGE_KEY = "raptor-link-saved-vehicles";

    // =====================================
    // SAVED VEHICLES STORAGE
    // =====================================

    function getSavedVehicles() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            if (!Array.isArray(saved)) return [];

            return saved.filter(id => vehicles[id]);
        } catch (error) {
            console.warn("Could not read saved vehicles:", error);
            return [];
        }
    }

    function saveVehiclesToStorage(saved) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        } catch (error) {
            console.warn("Could not save vehicle preferences:", error);
        }
    }

    // =====================================
    // VEHICLE SEARCH
    // =====================================

    function filterVehicles() {
        if (!offersGrid || !searchInput) return;

        const query = searchInput.value
            .trim()
            .toLowerCase();

        const cards = offersGrid.querySelectorAll(".vehicle-card");

        let visibleCount = 0;

        cards.forEach(function (card) {
            const text = card.textContent.toLowerCase();
            const matches = text.includes(query);

            card.style.display = matches ? "" : "none";

            if (matches) visibleCount++;
        });

        let noResults = document.getElementById("searchNoResults");

        if (!noResults) {
            noResults = document.createElement("p");
            noResults.id = "searchNoResults";
            noResults.textContent = "No vehicles match your search.";
            noResults.style.display = "none";

            offersGrid.insertAdjacentElement("afterend", noResults);
        }

        noResults.style.display =
            visibleCount === 0 ? "block" : "none";
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterVehicles);
    }

    if (searchForm) {
        searchForm.addEventListener("submit", function (event) {
            event.preventDefault();
            filterVehicles();

            const offersSection = document.getElementById("offers");

            if (offersSection) {
                offersSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    }

    // =====================================
    // OPEN VEHICLE DETAILS
    // =====================================

    function openVehicleDetails(vehicleId) {
        const vehicle = vehicles[vehicleId];

        if (!vehicle || !modal) return;

        currentVehicle = vehicle;

        if (modalImage) {
            modalImage.src = vehicle.image;
            modalImage.alt = vehicle.name;
        }

        if (modalCategory) {
            modalCategory.textContent = vehicle.category;
        }

        if (modalName) {
            modalName.textContent = vehicle.name;
        }

        if (modalDescription) {
            modalDescription.textContent = vehicle.description;
        }

        if (modalHighlights) {
            modalHighlights.replaceChildren();

            vehicle.highlights.forEach(function (highlight) {
                const item = document.createElement("li");
                item.textContent = highlight;
                modalHighlights.appendChild(item);
            });
        }

        if (modalSpecs) {
            modalSpecs.replaceChildren();

            const specifications = [
                ["Vehicle", vehicle.name],
                ["Category", "Ford Ranger"],
                ["Availability", "Coming soon"]
            ];

            specifications.forEach(function (specification) {
                const item = document.createElement("div");
                item.className = "spec-item";

                const label = document.createElement("span");
                label.className = "spec-label";
                label.textContent = specification[0];

                const value = document.createElement("strong");
                value.className = "spec-value";
                value.textContent = specification[1];

                item.append(label, value);
                modalSpecs.appendChild(item);
            });
        }

        updateSaveButton();

        modal.classList.add("active");
        modal.style.display = "flex";
        modal.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";
    }

    // =====================================
    // CLOSE VEHICLE DETAILS
    // =====================================

    function closeVehicleDetails() {
        if (!modal) return;

        modal.classList.remove("active");
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";
        currentVehicle = null;
    }

    if (modalClose) {
        modalClose.addEventListener("click", closeVehicleDetails);
    }

    if (modal) {
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                closeVehicleDetails();
            }
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && currentVehicle) {
            closeVehicleDetails();
        }
    });

    // =====================================
    // VEHICLE CARD CLICK EVENTS
    // =====================================

    document.addEventListener("click", function (event) {
        const detailsButton = event.target.closest(".details-btn");

        if (!detailsButton) return;

        const card = detailsButton.closest(".vehicle-card");

        if (!card) return;

        const title = card.querySelector(".vehicle-info h3");

        if (!title) return;

        const vehicleId = title.textContent
            .toLowerCase()
            .includes("platinum")
            ? "platinum"
            : "raptor";

        openVehicleDetails(vehicleId);
    });

    // =====================================
    // UPDATE SAVE BUTTON
    // =====================================

    function updateSaveButton() {
        if (!saveButton || !currentVehicle) return;

        const saved = getSavedVehicles();
        const isSaved = saved.includes(currentVehicle.id);

        saveButton.textContent = isSaved
            ? "♥ Remove saved vehicle"
            : "♡ Save vehicle";
    }

    // =====================================
    // SAVE / REMOVE VEHICLE
    // =====================================

    if (saveButton) {
        saveButton.addEventListener("click", function () {
            if (!currentVehicle) return;

            let saved = getSavedVehicles();

            if (saved.includes(currentVehicle.id)) {
                saved = saved.filter(
                    id => id !== currentVehicle.id
                );
            } else {
                saved.push(currentVehicle.id);
            }

            saveVehiclesToStorage(saved);

            updateSaveButton();
            renderSavedVehicles();
        });
    }

    // =====================================
    // RENDER SAVED VEHICLES
    // =====================================

    function renderSavedVehicles() {
        if (!savedGrid) return;

        const saved = getSavedVehicles();

        savedGrid.replaceChildren();

        saved.forEach(function (vehicleId) {
            const vehicle = vehicles[vehicleId];

            if (!vehicle) return;

            const card = document.createElement("article");
            card.className = "vehicle-card";

            const imageContainer = document.createElement("div");
            imageContainer.className = "vehicle-placeholder";

            const image = document.createElement("img");
            image.src = vehicle.image;
            image.alt = vehicle.name;

            const number = document.createElement("span");
            number.textContent = vehicleId === "raptor" ? "01" : "02";

            const nameTag = document.createElement("strong");
            nameTag.textContent = vehicleId === "raptor"
                ? "RAPTOR"
                : "PLATINUM";

            imageContainer.append(image, number, nameTag);

            const info = document.createElement("div");
            info.className = "vehicle-info";

            const category = document.createElement("span");
            category.className = "vehicle-category";
            category.textContent = vehicle.category;

            const heading = document.createElement("h3");
            heading.textContent = vehicle.name;

            const description = document.createElement("p");
            description.textContent = vehicle.description;

            const details = document.createElement("button");
            details.type = "button";
            details.className = "details-btn";
            details.textContent = "View Details →";

            details.addEventListener("click", function () {
                openVehicleDetails(vehicleId);
            });

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "details-btn";
            remove.textContent = "Remove from saved";

            remove.addEventListener("click", function () {
                const updated = getSavedVehicles().filter(
                    id => id !== vehicleId
                );

                saveVehiclesToStorage(updated);
                renderSavedVehicles();
                updateSaveButton();
            });

            info.append(
                category,
                heading,
                description,
                details,
                remove
            );

            card.append(imageContainer, info);
            savedGrid.appendChild(card);
        });

        if (savedCount) {
            savedCount.textContent =
                `♥ ${saved.length} ${saved.length === 1 ? "vehicle" : "vehicles"} saved`;
        }

        if (savedNavBadge) {
            savedNavBadge.textContent = saved.length;
            savedNavBadge.hidden = saved.length === 0;
        }

        if (emptySavedMessage) {
            emptySavedMessage.style.display =
                saved.length === 0 ? "block" : "none";
        }
    }

    // =====================================
    // ENQUIRE ABOUT VEHICLE
    // =====================================

    if (enquireButton) {
        enquireButton.addEventListener("click", function () {
            if (!currentVehicle) return;

            const message =
                `Hello RAPTOR LINK, I am interested in the ${currentVehicle.name}. Please share more information.`;

            const whatsappURL =
                "https://wa.me/27660124536?text=" +
                encodeURIComponent(message);

            window.open(whatsappURL, "_blank", "noopener,noreferrer");
        });
    }

    // =====================================
    // INITIALISE SHOWROOM
    // =====================================

    renderSavedVehicles();

    if (modal) {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
    }

    console.log("RAPTOR LINK: Showroom controller loaded successfully.");

});


/* =========================================
   RAPTOR LINK — GLOBAL THEME CONTROLLER
   Controls Showroom, Custom Lab and Settings
========================================= */

(function () {
    "use strict";

    const STORAGE_KEY = "raptor-link-theme";
    const DEFAULT_THEME = "dark";

    function getSavedTheme() {
        try {
            const savedTheme = localStorage.getItem(STORAGE_KEY);

            return savedTheme === "light" || savedTheme === "dark"
                ? savedTheme
                : DEFAULT_THEME;
        } catch (error) {
            console.warn("Theme preference could not be read:", error);
            return DEFAULT_THEME;
        }
    }

    function applyTheme(theme) {
        const selectedTheme =
            theme === "light" ? "light" : "dark";

        document.documentElement.dataset.theme = selectedTheme;

        document.body.dataset.theme = selectedTheme;

        // Update browser address-bar theme colour
        const themeColor = document.querySelector(
            'meta[name="theme-color"]'
        );

        if (themeColor) {
            themeColor.setAttribute(
                "content",
                selectedTheme === "dark" ? "#090b0e" : "#FAFAFA"
            );
        }

        // Update existing homepage theme button
        const themeToggle = document.getElementById("themeToggle");

        if (themeToggle) {
            themeToggle.textContent =
                selectedTheme === "dark" ? "☀" : "☾";

            themeToggle.setAttribute(
                "aria-label",
                selectedTheme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );
        }

        // Update Settings page selection, when present
        document.querySelectorAll("[data-theme-choice]").forEach(
            function (button) {
                const isSelected =
                    button.dataset.themeChoice === selectedTheme;

                button.classList.toggle("active", isSelected);
                button.setAttribute(
                    "aria-pressed",
                    String(isSelected)
                );
            }
        );
    }

    function saveTheme(theme) {
        const selectedTheme =
            theme === "light" ? "light" : "dark";

        try {
            localStorage.setItem(STORAGE_KEY, selectedTheme);
        } catch (error) {
            console.warn("Theme preference could not be saved:", error);
        }

        applyTheme(selectedTheme);
    }

    // Apply saved theme as soon as this script loads
    applyTheme(getSavedTheme());

    // Handle theme selections on the Settings page
    document.addEventListener("click", function (event) {
        const choice = event.target.closest("[data-theme-choice]");

        if (choice) {
            saveTheme(choice.dataset.themeChoice);
        }
    });

    // Handle the existing homepage theme toggle
    document.addEventListener("click", function (event) {
        const toggle = event.target.closest("#themeToggle");

        if (!toggle) return;

        const currentTheme =
            document.documentElement.dataset.theme;

        saveTheme(currentTheme === "dark" ? "light" : "dark");
    });

    console.log("RAPTOR LINK: Global theme controller loaded.");

})();

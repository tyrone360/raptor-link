
/* =====================================
   RAPTOR LINK - SERVICE WORKER
   OFFLINE SUPPORT FOR SHOWROOM,
   CUSTOM LAB + SETTINGS
===================================== */

const CACHE_NAME = "raptor-link-v8";
const CACHE_PREFIX = "raptor-link-";

const APP_FILES = [
    // MAIN SHOWROOM
    "./",
    "./index.html",
    "./css/style.css",
    "./js/script.js",

    // CUSTOM LAB
    "./customiser.html",
    "./css/customiser.css",
    "./js/customiser.js",

    // SETTINGS
    "./settings.html",
    "./css/settings.css",

    // GLOBAL THEME
    "./js/theme.js",

    // PWA
    "./manifest.json",

    // APP ICONS
    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png",
    "./assets/icons/icon-512-maskable.png",
    "./assets/icons/facon/favicon.ico",

    // BRANDING
    "./assets/images/raptor-logo.jpg",

    // MAIN VEHICLE IMAGES
    "./assets/images/raptor-desert.webp",
    "./assets/images/platinum-front.webp",

    // RAPTOR COLOURS
    "./assets/images/colours/Factorie.png",
    "./assets/images/colours/Arctic white.png",
    "./assets/images/colours/Code orange.png",
    "./assets/images/colours/Grey.png",
    "./assets/images/colours/Perfomance blue.png",
    "./assets/images/colours/Red.png",
    "./assets/images/colours/Shadow black.png",

    // PLATINUM COLOURS
    "./assets/images/colours/Acacia green.png",
    "./assets/images/colours/Aget black.png",
    "./assets/images/colours/Carbonized grey.png",
    "./assets/images/colours/Frozen white.png",
    "./assets/images/colours/Icon silver.png",
    "./assets/images/colours/Lucid red.png"
];

// INSTALL
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_FILES))
            .then(() => self.skipWaiting())
    );
});

// ACTIVATE
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) =>
                            name.startsWith(CACHE_PREFIX) &&
                            name !== CACHE_NAME
                        )
                        .map((name) => caches.delete(name))
                );
            })
            .then(() => self.clients.claim())
    );
});

// FETCH
self.addEventListener("fetch", (event) => {

    if (event.request.method !== "GET") {
        return;
    }

    const requestURL = new URL(event.request.url);

    if (requestURL.origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME)
            .then(async (cache) => {

                const cachedResponse = await cache.match(event.request);

                if (cachedResponse) {
                    return cachedResponse;
                }

                try {
                    const networkResponse = await fetch(event.request);

                    if (networkResponse && networkResponse.ok) {
                        await cache.put(
                            event.request,
                            networkResponse.clone()
                        );
                    }

                    return networkResponse;

                } catch (error) {

                    // MISSING FAVICON OFFLINE FALLBACK
                    if (requestURL.pathname.endsWith("/favicon.ico")) {
                        return new Response(null, {
                            status: 204
                        });
                    }

                    // PAGE FALLBACK
                    if (event.request.mode === "navigate") {

                        const requestedPath = requestURL.pathname;

                        if (requestedPath.endsWith("/customiser.html")) {
                            return await cache.match("./customiser.html");
                        }

                        if (requestedPath.endsWith("/settings.html")) {
                            return await cache.match("./settings.html");
                        }

                        return await cache.match("./index.html");
                    }

                    // OTHER OFFLINE RESOURCES
                    return new Response(
                        "This resource is not available offline.",
                        {
                            status: 503,
                            statusText: "Offline"
                        }
                    );
                }
            })
    );
});

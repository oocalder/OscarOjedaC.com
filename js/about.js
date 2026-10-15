document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.querySelector(".toggle-theme");
    const menuToggle = document.querySelector(".menu-toggle");
    const menuOverlay = document.querySelector(".menu-overlay");

    // Theme toggle (dark mode), if a toggle button exists on the page
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
        });

        if (localStorage.getItem("darkMode") === "true") {
            document.body.classList.add("dark-mode");
        }
    }

    // Mobile menu toggle (hamburger), same behavior as the homepage
    if (menuToggle && menuOverlay) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            menuOverlay.classList.toggle("active");
        });
    }

    // Smooth scroll, only for links that point to an in-page anchor (#...).
    // Links to other pages (../about/, ../contact/, etc.) are left alone
    // so the browser navigates normally.
    document.querySelectorAll('.menu li a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Wave fade-in effect for elements with the .fade-in class
    function revealElements() {
        const fadeElements = document.querySelectorAll(".fade-in");

        fadeElements.forEach(el => {
            el.style.opacity = "0";
            el.style.transform = "translateY(20px)";
        });

        fadeElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
            }, index * 150);
        });
    }

    // Runs on every load of a page that includes this script
    // (About, Contact, Press) - no longer gated on a specific filename.
    revealElements();
});

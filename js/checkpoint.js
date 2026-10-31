document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const menuOverlay = document.querySelector(".menu-overlay");
  const themeToggle = document.querySelector(".toggle-theme");
  const images = document.querySelectorAll(".animate-image");

  // Set animation delay for each image
  images.forEach((img, index) => {
    img.style.animationDelay = `${0.5 + index * 0.1}s`;
  });

  // Toggle menu visibility
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    menuOverlay.classList.toggle("active");
  });

  // Toggle theme (dark mode)
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
});

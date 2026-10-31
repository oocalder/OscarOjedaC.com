document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const menuOverlay = document.querySelector(".menu-overlay");
  const themeToggle = document.querySelector(".toggle-theme");
  const images = document.querySelectorAll(".animate-image");

  // Toggle menu visibility
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    menuOverlay.classList.toggle("active");
  });

  // Toggle theme (dark mode)
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });

  // Scroll-based fade-in effect
  const fadeInOnScroll = () => {
    images.forEach((img) => {
      const rect = img.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.9;
      if (isVisible) {
        img.classList.add("visible");
      }
    });
  };

  // Run function on scroll and on page load
  window.addEventListener("scroll", fadeInOnScroll);
  fadeInOnScroll();
});

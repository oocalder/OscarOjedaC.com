const buttons = [...document.querySelectorAll(".photo")],
  viewer = document.querySelector("#viewer");
let active = 0;
function show(i) {
  active = (i + buttons.length) % buttons.length;
  const im = buttons[active].querySelector("img"),
    full = document.querySelector("#full");
  full.src = im.src;
  full.alt = im.alt;
  document.querySelector("#count").textContent = active + 1 + " / " + buttons.length;
}
buttons.forEach(
  (b, i) =>
    (b.onclick = () => {
      show(i);
      viewer.showModal();
    }),
);
document.querySelector("#close").onclick = () => viewer.close();
document.querySelector("#previous").onclick = () => show(active - 1);
document.querySelector("#next").onclick = () => show(active + 1);
document.addEventListener("keydown", (e) => {
  if (viewer.open) {
    if (e.key === "ArrowLeft") show(active - 1);
    if (e.key === "ArrowRight") show(active + 1);
  } else if (e.key === "Escape") parent.postMessage({ galleryBack: true }, location.protocol === "file:" ? "*" : location.origin);
});
viewer.addEventListener("click", (e) => {
  if (e.target === viewer) viewer.close();
});

// Count only visible entries; commented-out photos stay excluded.
document.querySelector("#frame-count").textContent = buttons.length;
document.querySelector(".gallery-contact").addEventListener("click", (event) => {
  if (location.protocol === "file:" || window.parent === window || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  parent.postMessage({ route: "contact" }, location.origin);
});

const highlights = [
  {
    title: "الاقامه الانسانيه",
    cover: "highlights/الاقامه الانسانيه/3.png",
    stories: [
      "highlights/الاقامه الانسانيه/3.png",
      "highlights/الاقامه الانسانيه/4.png",
      "highlights/الاقامه الانسانيه/5.png",
      "highlights/الاقامه الانسانيه/6.png",
      "highlights/الاقامه الانسانيه/5555.png"
    ]
  },
  {
    title: "الاقامه السياحيه",
    cover: "highlights/الاقامه السياحيه/1.jpg.jpeg",
    stories: [
      "highlights/الاقامه السياحيه/1.jpg.jpeg",
      "highlights/الاقامه السياحيه/2.jpg.jpeg",
      "highlights/الاقامه السياحيه/3.jpg.jpeg",
      "highlights/الاقامه السياحيه/4.jpg.jpeg"
    ]
  },
  {
    title: "القبولات الجامعيه",
    cover: "highlights/القبولات الجامعيه/5.jpg.jpeg",
    stories: [
      "highlights/القبولات الجامعيه/5.jpg.jpeg",
      "highlights/القبولات الجامعيه/6.jpg.jpeg",
      "highlights/القبولات الجامعيه/7.jpg.jpeg",
      "highlights/القبولات الجامعيه/8.jpg.jpeg",
      "highlights/القبولات الجامعيه/9.jpg.jpeg"
    ]
  }
];

const body = document.body;
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const mobileLinks = document.querySelectorAll(".mobile-nav a");
const highlightRow = document.querySelector("#highlightRow");
const storyViewer = document.querySelector("#storyViewer");
const storyProgress = document.querySelector("#storyProgress");
const storyAvatar = document.querySelector("#storyAvatar");
const storyTitle = document.querySelector("#storyTitle");
const storyCounter = document.querySelector("#storyCounter");
const storyImage = document.querySelector("#storyImage");
const closeStoryButton = document.querySelector(".story-close");
const previousStoryButton = document.querySelector(".story-zone-left");
const nextStoryButton = document.querySelector(".story-zone-right");
const previousHighlightButton = document.querySelector(".story-arrow-left");
const nextHighlightButton = document.querySelector(".story-arrow-right");
const storyDuration = 5600;

let activeHighlightIndex = 0;
let activeStoryIndex = 0;
let storyStartedAt = 0;
let progressFrame = 0;
let lastFocusedElement = null;
let touchStartX = 0;
let touchStartY = 0;

function setHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 10);
}

function closeMenu() {
  body.classList.remove("menu-open");

  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }
}

function buildHighlightButtons() {
  if (!highlightRow) return;

  highlights.forEach((highlight, index) => {
    const button = document.createElement("button");
    button.className = "highlight-button";
    button.type = "button";
    button.setAttribute("aria-label", highlight.title);

    const ring = document.createElement("span");
    ring.className = "highlight-ring";

    const image = document.createElement("img");
    image.src = highlight.cover;
    image.alt = "";
    image.loading = "lazy";

    const title = document.createElement("span");
    title.textContent = highlight.title;
    title.dir = "auto";

    ring.append(image);
    button.append(ring, title);
    button.addEventListener("click", () => openStory(index, 0));
    highlightRow.append(button);
  });
}

function currentHighlight() {
  return highlights[activeHighlightIndex];
}

function cancelProgress() {
  if (progressFrame) {
    cancelAnimationFrame(progressFrame);
    progressFrame = 0;
  }
}

function buildProgressBars() {
  if (!storyProgress) return;

  storyProgress.replaceChildren();
  currentHighlight().stories.forEach((_, index) => {
    const bar = document.createElement("span");
    if (index < activeStoryIndex) {
      bar.classList.add("is-complete");
    }
    storyProgress.append(bar);
  });
}

function updateProgress() {
  if (!storyViewer || !storyViewer.classList.contains("is-open")) return;

  const bars = Array.from(storyProgress.children);
  const activeBar = bars[activeStoryIndex];
  const elapsed = performance.now() - storyStartedAt;
  const percent = Math.min((elapsed / storyDuration) * 100, 100);

  bars.forEach((bar, index) => {
    bar.classList.toggle("is-complete", index < activeStoryIndex);
    if (index > activeStoryIndex) {
      bar.style.setProperty("--progress", "0%");
    }
  });

  if (activeBar) {
    activeBar.style.setProperty("--progress", `${percent}%`);
  }

  if (percent >= 100) {
    goToNextStory();
    return;
  }

  progressFrame = requestAnimationFrame(updateProgress);
}

function startProgress() {
  cancelProgress();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  storyStartedAt = performance.now();
  progressFrame = requestAnimationFrame(updateProgress);
}

function renderStory() {
  const highlight = currentHighlight();
  const storyPath = highlight.stories[activeStoryIndex];

  buildProgressBars();
  storyAvatar.src = highlight.cover;
  storyTitle.textContent = highlight.title;
  storyTitle.dir = "auto";
  storyCounter.textContent = `${activeStoryIndex + 1} / ${highlight.stories.length}`;
  storyImage.src = storyPath;
  storyImage.alt = `${highlight.title} story ${activeStoryIndex + 1}`;

  startProgress();
}

function openStory(highlightIndex, storyIndex) {
  const highlight = highlights[highlightIndex];
  if (!highlight || !highlight.stories.length || !storyViewer) return;

  lastFocusedElement = document.activeElement;
  activeHighlightIndex = highlightIndex;
  activeStoryIndex = Math.max(0, Math.min(storyIndex, highlight.stories.length - 1));

  storyViewer.classList.add("is-open");
  storyViewer.setAttribute("aria-hidden", "false");
  storyViewer.removeAttribute("inert");
  body.classList.add("story-open");
  closeMenu();
  renderStory();
  closeStoryButton.focus({ preventScroll: true });
}

function closeStory() {
  if (!storyViewer) return;

  cancelProgress();
  storyViewer.classList.remove("is-open");
  storyViewer.setAttribute("aria-hidden", "true");
  storyViewer.setAttribute("inert", "");
  body.classList.remove("story-open");

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus({ preventScroll: true });
  }
}

function goToNextHighlight() {
  if (activeHighlightIndex < highlights.length - 1) {
    activeHighlightIndex += 1;
    activeStoryIndex = 0;
    renderStory();
    return;
  }

  closeStory();
}

function goToPreviousHighlight() {
  if (activeHighlightIndex > 0) {
    activeHighlightIndex -= 1;
    activeStoryIndex = currentHighlight().stories.length - 1;
    renderStory();
    return;
  }

  activeStoryIndex = 0;
  renderStory();
}

function goToNextStory() {
  if (activeStoryIndex < currentHighlight().stories.length - 1) {
    activeStoryIndex += 1;
    renderStory();
    return;
  }

  goToNextHighlight();
}

function goToPreviousStory() {
  if (activeStoryIndex > 0) {
    activeStoryIndex -= 1;
    renderStory();
    return;
  }

  goToPreviousHighlight();
}

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });
}

mobileLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

closeStoryButton.addEventListener("click", closeStory);
previousStoryButton.addEventListener("click", goToPreviousStory);
nextStoryButton.addEventListener("click", goToNextStory);
previousHighlightButton.addEventListener("click", goToPreviousHighlight);
nextHighlightButton.addEventListener("click", goToNextHighlight);

storyViewer.addEventListener("pointerdown", (event) => {
  touchStartX = event.clientX;
  touchStartY = event.clientY;
});

storyViewer.addEventListener("pointerup", (event) => {
  const distanceX = event.clientX - touchStartX;
  const distanceY = event.clientY - touchStartY;

  if (Math.abs(distanceX) < 54 || Math.abs(distanceY) > 70) return;

  if (distanceX < 0) {
    goToNextStory();
  } else {
    goToPreviousStory();
  }
});

document.addEventListener("keydown", (event) => {
  if (storyViewer && storyViewer.classList.contains("is-open")) {
    if (event.key === "Escape") closeStory();
    if (event.key === "ArrowRight") goToNextStory();
    if (event.key === "ArrowLeft") goToPreviousStory();
    return;
  }

  if (event.key === "Escape") {
    closeMenu();
  }
});

buildHighlightButtons();
setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

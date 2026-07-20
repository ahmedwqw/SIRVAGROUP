const body = document.body;
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav-links a");
const sliderButtons = document.querySelectorAll(".slider-btn");
const contactForm = document.querySelector(".contact-form");
const formNote = document.querySelector(".form-note");

function setHeaderState() {
  header.classList.toggle("scrolled", window.scrollY > 8);
}

menuToggle.addEventListener("click", () => {
  const isOpen = body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  });
});

sliderButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const rail = document.getElementById(button.dataset.slide);
    if (!rail) return;

    const direction = Number(button.dataset.direction || 1);
    const card = rail.querySelector(":scope > *");
    const distance = card ? card.getBoundingClientRect().width + 12 : rail.clientWidth * 0.85;

    rail.scrollBy({
      left: direction * distance,
      behavior: "smooth"
    });
  });
});

document.querySelectorAll(".rail").forEach((rail) => {
  rail.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    rail.scrollBy({
      left: direction * rail.clientWidth * 0.75,
      behavior: "smooth"
    });
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(contactForm);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();

  const subject = encodeURIComponent(`SIRVA GROUP inquiry from ${name}`);
  const bodyText = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

  formNote.textContent = "Opening your email app to send the message.";
  window.location.href = `mailto:sirvagroup@gmail.com?subject=${subject}&body=${bodyText}`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

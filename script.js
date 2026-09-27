const sidebar = document.getElementById("sidebar");
const mobileMenu = document.getElementById("mobileMenu");
const search = document.getElementById("search");
const noResults = document.getElementById("noResults");
const navLinks = [...document.querySelectorAll("#nav a")];
const sections = [...document.querySelectorAll(".rule-section")];

mobileMenu?.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

navLinks.forEach(link => {
  link.addEventListener("click", () => sidebar.classList.remove("open"));
});

const searchable = [...document.querySelectorAll(".searchable")];

search.addEventListener("input", () => {
  const q = search.value.trim().toLowerCase();
  let visible = 0;

  searchable.forEach(el => {
    const match = !q || el.innerText.toLowerCase().includes(q);
    el.classList.toggle("hidden-search", !match);
    if (match) visible++;
  });

  sections.forEach(section => {
    const cards = [...section.querySelectorAll(".searchable")];
    const any = !q || cards.some(card => !card.classList.contains("hidden-search"));
    section.style.display = any ? "" : "none";
  });

  noResults.hidden = visible !== 0;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${id}`));
  });
}, { rootMargin: "-20% 0px -65% 0px" });

sections.forEach(section => observer.observe(section));

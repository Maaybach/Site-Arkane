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

    // Mettre en évidence la catégorie active dans le menu.
    navLinks.forEach(link => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${id}`
      );
    });

    // Déclencher l'animation d'apparition de la catégorie.
    entry.target.classList.add("section-visible");
  });
}, { rootMargin: "-10% 0px -10% 0px" });

sections.forEach(section => observer.observe(section));


/* ===== PROGRESSION DE LECTURE — NEXT LIFE ===== */

const progressFill = document.getElementById("readingProgressFill");
const progressText = document.getElementById("readingProgressText");
const progressStorageKey = "nextLifeReadingPosition";

const updateReadingProgress = () => {
  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress = maxScroll > 0
    ? Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100))
    : 0;

  if (progressFill) {
    progressFill.style.width = `${progress}%`;
  }

  if (progressText) {
    progressText.textContent = `${Math.round(progress)} %`;
  }
};

window.addEventListener("scroll", () => {
  updateReadingProgress();

  try {
    localStorage.setItem(progressStorageKey, String(window.scrollY));
  } catch (error) {
    // La progression fonctionne même si le stockage est indisponible.
  }
}, { passive: true });

window.addEventListener("resize", updateReadingProgress);

// Actualiser la barre si la recherche modifie la hauteur de la page.
search?.addEventListener("input", () => {
  requestAnimationFrame(updateReadingProgress);
});

// Restaurer la dernière position de lecture enregistrée.
try {
  const savedPosition = Number(localStorage.getItem(progressStorageKey));

  if (Number.isFinite(savedPosition) && savedPosition > 0) {
    requestAnimationFrame(() => {
      window.scrollTo(0, savedPosition);
      updateReadingProgress();
    });
  }
} catch (error) {
  // Le site reste utilisable si le stockage est indisponible.
}

updateReadingProgress();

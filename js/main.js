// ===== DOM ELEMENTS =====
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const header = document.getElementById('header');
const sidebarLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');

// ===== SIDEBAR TOGGLE =====
function openSidebar() {
  sidebar.classList.add('active');
  sidebarOverlay.classList.add('active');
  hamburger.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  sidebar.classList.remove('active');
  sidebarOverlay.classList.remove('active');
  hamburger.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  sidebar.classList.contains('active') ? closeSidebar() : openSidebar();
});

sidebarOverlay.addEventListener('click', closeSidebar);

sidebarLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeSidebar();
  });
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSidebar();
});

// ===== HEADER SCROLL =====
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  lastScroll = scrollY;
});

// ===== SCROLL ANIMATIONS =====
const fadeElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(el => observer.observe(el));

// ===== PRODUCT DETAIL TOGGLES (productos page) =====
document.querySelectorAll('.prod-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const details = btn.closest('.prod-card-content').querySelector('.prod-details');
    btn.classList.toggle('open');
    details.classList.toggle('open');
    const text = btn.querySelector('.toggle-text');
    if (text) {
      text.textContent = details.classList.contains('open') ? 'Ocultar info' : 'Ver info nutricional';
    }
  });
});

// ===== ACTIVE NAV LINK HIGHLIGHT =====
if (document.querySelectorAll('section[id]').length > 0) {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.sidebar-nav a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => sectionObserver.observe(section));
}

// ===== STORE STATUS (ABIERTO / CERRADO) =====
function updateStoreStatus() {
  const el = document.getElementById('storeStatus');
  if (!el) return;

  const now = new Date();
  const day = now.getDay(); // 0=dom, 1=lun, 2-6=mar-sab
  const hours = now.getHours();
  const mins = now.getMinutes();
  const time = hours * 60 + mins;

  let isOpen = false;
  let statusText = '';

  if (day === 1) {
    // Lunes cerrado
    statusText = 'Cerrado · Abrimos mañana 9:00';
  } else if (day === 0) {
    // Domingo 8:40 a 13:00
    if (time >= 520 && time < 780) {
      isOpen = true;
      statusText = 'Abierto · Cierra 13:00';
    } else if (time < 520) {
      statusText = 'Cerrado · Abrimos 8:40';
    } else {
      statusText = 'Cerrado · Abrimos martes 9:00';
    }
  } else {
    // Martes a Sábado: 9:00-13:00 y 16:30-20:30
    if (time >= 540 && time < 780) {
      isOpen = true;
      statusText = 'Abierto · Cierra 13:00';
    } else if (time >= 990 && time < 1230) {
      isOpen = true;
      statusText = 'Abierto · Cierra 20:30';
    } else if (time >= 780 && time < 990) {
      statusText = 'Cerrado · Abrimos 16:30';
    } else if (time < 540) {
      statusText = 'Cerrado · Abrimos 9:00';
    } else {
      const tomorrow = day === 6 ? 'domingo 8:40' : 'mañana 9:00';
      statusText = `Cerrado · Abrimos ${tomorrow}`;
    }
  }

  el.className = `store-status ${isOpen ? 'open' : 'closed'}`;
  el.innerHTML = `<span class="status-dot"></span>${statusText}`;
}

updateStoreStatus();
setInterval(updateStoreStatus, 60000);

// ===== ANIMATED COUNTERS =====
const counterElements = document.querySelectorAll('.stat-number[data-target]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const start = performance.now();

      function animate(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = current.toLocaleString('es-AR') + suffix;
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }
      requestAnimationFrame(animate);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counterElements.forEach(el => counterObserver.observe(el));

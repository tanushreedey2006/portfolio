/* ================================================================
   SCRIPT.JS — Tanushree Dey Portfolio
   ================================================================ */

/* ── Navbar: scroll shadow + active link ─────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');
const navLinks  = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  highlightActiveSection();
  handleScrollTopBtn();
});

function highlightActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}

/* ── Mobile nav ──────────────────────────────────────────────── */
hamburger.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  hamburger.classList.toggle('active', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.forEach(link => link.addEventListener('click', closeNav));
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) closeNav();
});
function closeNav() {
  navMenu.classList.remove('open');
  hamburger.classList.remove('active');
  document.body.style.overflow = '';
}

/* ── Scroll reveal ───────────────────────────────────────────── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

/* ── Scroll-to-top button ────────────────────────────────────── */
const scrollTopBtn = document.getElementById('scroll-top');
function handleScrollTopBtn() {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 480);
}
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Typing effect ───────────────────────────────────────────── */
const phrases = ['Full Stack Developer', 'Web Developer', 'Frontend Developer', 'PHP Developer', 'Problem Solver'];
let pIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function typeLoop() {
  if (!typedEl) return;
  const phrase = phrases[pIdx];
  typedEl.textContent = phrase.slice(0, cIdx);
  if (!deleting && cIdx === phrase.length) {
    setTimeout(() => { deleting = true; typeLoop(); }, 2000);
    return;
  }
  if (deleting && cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
  cIdx += deleting ? -1 : 1;
  setTimeout(typeLoop, deleting ? 48 : 100);
}
typeLoop();

/* ── Counter animation ───────────────────────────────────────── */
const countObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el     = e.target;
    const target = parseInt(el.dataset.count, 10);
    let cur = 0;
    const step = Math.ceil(target / 36);
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur + '+';
      if (cur >= target) clearInterval(timer);
    }, 38);
    countObs.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

/* ── Hero canvas: particle + connection network ──────────────── */
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [], raf;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * canvas.width;
      this.y  = init ? Math.random() * canvas.height : (Math.random() > 0.5 ? -4 : canvas.height + 4);
      this.vx = (Math.random() - 0.5) * 0.28;
      this.vy = (Math.random() - 0.5) * 0.28;
      this.r  = Math.random() * 1.4 + 0.5;
      this.a  = Math.random() * 0.35 + 0.08;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < -10 || this.x > canvas.width + 10 ||
          this.y < -10 || this.y > canvas.height + 10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(167,139,250,' + this.a + ')';
      ctx.fill();
    }
  }

  function init() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 11000), 90);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawLines() {
    const MAX_DIST = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(124,58,237,' + (0.13 * (1 - d / MAX_DIST)) + ')';
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    raf = requestAnimationFrame(animate);
  }

  resize(); init(); animate();
  window.addEventListener('resize', () => { cancelAnimationFrame(raf); resize(); init(); animate(); });
})();

/* ── Contact form with validation ───────────────────────────── */
(function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = [
    { id: 'f-name',    errId: 'err-name',    msg: 'Please enter your name.',            check: v => v.trim().length > 0 },
    { id: 'f-email',   errId: 'err-email',   msg: 'Please enter a valid email address.',check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: 'f-subject', errId: 'err-subject', msg: 'Please enter a subject.',             check: v => v.trim().length > 0 },
    { id: 'f-message', errId: 'err-message', msg: 'Please write your message.',          check: v => v.trim().length > 10 },
  ];

  // Live clear error on input
  fields.forEach(f => {
    document.getElementById(f.id).addEventListener('input', () => {
      document.getElementById(f.id).classList.remove('err-field');
      document.getElementById(f.errId).textContent = '';
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    fields.forEach(f => {
      const el  = document.getElementById(f.id);
      const err = document.getElementById(f.errId);
      if (!f.check(el.value)) {
        el.classList.add('err-field');
        err.textContent = f.msg;
        valid = false;
      }
    });

    if (!valid) return;

    const btn = document.getElementById('submit-btn');
    btn.innerHTML  = '<i class="fas fa-spinner fa-spin"></i><span>Sending…</span>';
    btn.disabled   = true;

    setTimeout(() => {
      btn.innerHTML           = '<i class="fas fa-check-circle"></i><span>Message Sent!</span>';
      btn.style.background    = 'linear-gradient(135deg,#10b981,#059669)';
      btn.style.boxShadow     = '0 4px 22px rgba(16,185,129,0.4)';
      form.reset();
      setTimeout(() => {
        btn.innerHTML        = '<i class="fas fa-paper-plane"></i><span>Send Message</span>';
        btn.style.background = '';
        btn.style.boxShadow  = '';
        btn.disabled         = false;
      }, 3500);
    }, 1500);
  });
})();

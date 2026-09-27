/**
 * PORTFOLIO & CV INTERACTIVITY - MUHAMMAD RAYHAN FADILA
 * Features: Dark/Light Mode, Nav Tracker, Quick Copy Toast, WhatsApp Generator, Skill Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initScrollEffects();
  initClipboardCopy();
  initWhatsAppGenerator();
  initSkillObserver();
  initPrintButton();
});

/* ===================================================================
   1. THEME TOGGLE (DARK / LIGHT MODE)
   =================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  const currentTheme = localStorage.getItem('mrf_theme') || 'dark';
  applyTheme(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const nextTheme = isDark ? 'light' : 'dark';
    applyTheme(nextTheme);
    localStorage.setItem('mrf_theme', nextTheme);
    showToast(`Mode ${nextTheme === 'light' ? 'Terang (Light)' : 'Gelap (Dark)'} diaktifkan`);
  });
}

function applyTheme(theme) {
  const root = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  if (theme === 'light') {
    root.setAttribute('data-theme', 'light');
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
      themeToggleBtn.setAttribute('title', 'Beralih ke Mode Gelap');
      themeToggleBtn.setAttribute('aria-label', 'Beralih ke Mode Gelap');
    }
  } else {
    root.removeAttribute('data-theme');
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
      themeToggleBtn.setAttribute('title', 'Beralih ke Mode Terang');
      themeToggleBtn.setAttribute('aria-label', 'Beralih ke Mode Terang');
    }
  }
}

/* ===================================================================
   2. MOBILE NAVIGATION
   =================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const expanded = navLinks.classList.contains('active');
    toggleBtn.setAttribute('aria-expanded', expanded);
  });

  // Close nav on clicking links
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', false);
    });
  });
}

/* ===================================================================
   3. SCROLL EFFECTS & ACTIVE LINK OBSERVER
   =================================================================== */
function initScrollEffects() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Navbar elevation on scroll
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let currentSection = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ===================================================================
   4. COPY TO CLIPBOARD WITH TOAST
   =================================================================== */
function initClipboardCopy() {
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || 'Informasi';

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Berhasil disalin: ${label}`);
        }).catch(() => {
          fallbackCopyText(textToCopy, label);
        });
      } else {
        fallbackCopyText(textToCopy, label);
      }
    });
  });
}

function fallbackCopyText(text, label) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(`Berhasil disalin: ${label}`);
  } catch (err) {
    showToast(`Gagal menyalin teks`);
  }
  document.body.removeChild(textArea);
}

function showToast(message) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

/* ===================================================================
   5. INTERACTIVE WHATSAPP MESSAGE GENERATOR
   =================================================================== */
function initWhatsAppGenerator() {
  const messageInput = document.getElementById('wa-message-input');
  const sendBtn = document.getElementById('btn-send-whatsapp');
  const presetPills = document.querySelectorAll('.preset-pill');

  if (!messageInput || !sendBtn) return;

  const phoneNumber = '6287775172933';

  // Default preset texts
  const presets = {
    interview: 'Halo Muhammad Rayhan Fadila, kami tertarik dengan CV dan profil Anda. Kami ingin mengundang Anda untuk proses interview / seleksi kerja.',
    vacancy: 'Halo Muhammad Rayhan Fadila, saya melihat CV Anda. Apakah saat ini Anda tersedia untuk peluang kerja di bidang Administrasi?',
    inquiry: 'Halo Muhammad Rayhan Fadila, salam kenal. Saya ingin berdiskusi mengenai kualifikasi dan pengalaman Anda di bidang Administrasi Perkantoran.'
  };

  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      presetPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const presetKey = pill.getAttribute('data-preset');
      if (presets[presetKey]) {
        messageInput.value = presets[presetKey];
        messageInput.focus();
      }
    });
  });

  sendBtn.addEventListener('click', () => {
    const text = messageInput.value.trim() || presets.vacancy;
    const encodedText = encodeURIComponent(text);
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  });
}

/* ===================================================================
   6. ANIMATED SKILL PROGRESS BARS ON SCROLL
   =================================================================== */
function initSkillObserver() {
  const skillBars = document.querySelectorAll('.skill-progress-fill');
  if (!skillBars.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetPercent = bar.getAttribute('data-percent') || '85%';
        bar.style.width = targetPercent;
        obs.unobserve(bar);
      }
    });
  }, { threshold: 0.25 });

  skillBars.forEach(bar => observer.observe(bar));
}

/* ===================================================================
   7. PRINT / DOWNLOAD CV BUTTON
   =================================================================== */
function initPrintButton() {
  const printBtns = document.querySelectorAll('.btn-print-cv');
  printBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.print();
    });
  });
}

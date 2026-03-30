// ── CUSTOM CURSOR GLOW ──
const cursor = document.getElementById('cursorGlow');
let isMoving = false;
document.addEventListener('mousemove', (e) => {
  if(!isMoving) { cursor.style.opacity = 0.8; isMoving = true; }
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
document.addEventListener('mouseleave', () => cursor.style.opacity = 0);

// ── NAV SCROLL STATE ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// ── INTERSECTION OBSERVERS (REVEALS) ──
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('vis');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal, .reveal-up, .reveal-blur, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

// ── MOUSE FOLLOW ON FIRM CARDS (MAGNETIC EFFECT) ──
document.querySelectorAll('.firm-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// ── VENTURE MODAL LOGIC ──
const firmCards = document.querySelectorAll('.firm-card');
const ventureModal = document.getElementById('ventureModal');
if (ventureModal) {
  const vmClose = document.getElementById('vmClose');
  const vmName = document.getElementById('vmName');
  const vmRole = document.getElementById('vmRole');
  const vmBody = document.getElementById('vmBody');
  const vmLogoImg = document.getElementById('vmLogoImg');
  const vmLogoArea = document.querySelector('.vm-logo-area');

  firmCards.forEach(card => {
    card.addEventListener('click', () => {
      const name = card.querySelector('.firm-name').textContent;
      const role = card.querySelector('.firm-role').textContent;
      const desc = card.getAttribute('data-desc');
      const img = card.querySelector('.firm-logo-area img');
      const logoPl = card.querySelector('.firm-logo-pl');

      vmName.textContent = name;
      vmRole.textContent = role;
      vmBody.innerHTML = `<p>${desc}</p>`;
      
      if (img) {
        vmLogoImg.src = img.src;
        vmLogoImg.style.display = 'block';
        vmLogoArea.style.display = 'flex';
      } else if (logoPl) {
        vmLogoImg.style.display = 'none';
        vmLogoArea.style.display = 'none';
      }
      
      ventureModal.classList.add('active');
    });
  });

  vmClose.addEventListener('click', () => ventureModal.classList.remove('active'));
  
  ventureModal.querySelector('.vm-backdrop').addEventListener('click', () => {
    ventureModal.classList.remove('active');
  });
}

// ── MOBILE MENU TOGGLE ──
const menuToggle = document.getElementById('menuToggle');
const mobMenu = document.getElementById('mobMenu');
const mobLinks = document.querySelectorAll('.mob-link');

if (menuToggle && mobMenu) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobMenu.classList.toggle('open');
  });

  mobLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobMenu.classList.remove('open');
    });
  });
}

// ── MARQUEE GRAVITY LOGOS ──
const mChips = document.querySelectorAll('.m-chip');
mChips.forEach(chip => {
  chip.addEventListener('click', () => {
    if (chip.classList.contains('is-fallen')) return;
    
    // Get the image or text inside
    const element = chip.querySelector('img') || chip.querySelector('.m-chip-text');
    if (!element) return;

    // Clone BEFORE hiding so opacity isn't '0' on clone
    const clone = element.cloneNode(true);
    const startRect = element.getBoundingClientRect();

    chip.classList.add('is-fallen');
    const originalOpacity = element.style.opacity || '';
    element.style.opacity = '0'; // Hide original
    
    // Style clone for fixed drop
    clone.style.position = 'fixed';
    clone.style.top = startRect.top + 'px';
    clone.style.left = startRect.left + 'px';
    clone.style.width = startRect.width + 'px';
    clone.style.height = startRect.height + 'px';
    clone.style.margin = '0';
    clone.style.zIndex = '99999';
    clone.style.cursor = 'pointer';
    clone.style.transformOrigin = 'center';
    clone.style.opacity = '1';
    
    document.body.appendChild(clone);
    
    // Calculate fall target
    const targetY = window.innerHeight - startRect.height - 30; 
    const deltaY = targetY - startRect.top;
    
    // Always land flipped 180deg (left or right spin)
    const angles = [180, -180];
    const finalRot = angles[Math.floor(Math.random() * angles.length)];
    
    // Bounce animation using Web Animations API
    clone.animate([
      { transform: `translateY(0px) rotate(0deg)`, easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)' },
      { transform: `translateY(${deltaY}px) rotate(${finalRot * 0.8}deg)`, easing: 'ease-out', offset: 0.6 },
      { transform: `translateY(${deltaY - 40}px) rotate(${finalRot * 0.95}deg)`, easing: 'ease-in', offset: 0.8 },
      { transform: `translateY(${deltaY}px) rotate(${finalRot}deg)` }
    ], {
      duration: 800,
      fill: 'forwards'
    });
    
    // Click to return
    clone.addEventListener('click', () => {
      // Find where original is NOW (it's moving in marquee)
      const currentRect = element.getBoundingClientRect();
      const currentDeltaY = currentRect.top - startRect.top;
      const currentDeltaX = currentRect.left - startRect.left;
      
      // Smooth return animation
      const returnAnim = clone.animate([
        { transform: `translateY(${deltaY}px) rotate(${finalRot}deg)`, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' },
        { transform: `translate(${currentDeltaX}px, ${currentDeltaY}px) rotate(0deg)` }
      ], {
        duration: 800,
        fill: 'forwards'
      });
      
      // Cleanup after return completes
      returnAnim.onfinish = () => {
        element.style.opacity = originalOpacity;
        chip.classList.remove('is-fallen');
        clone.remove();
      };
    });
  });
});

// ── THEME TOGGLE ──
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light-theme');
    const isLight = document.documentElement.classList.contains('light-theme');
    localStorage.setItem('sahal-theme', isLight ? 'light' : 'dark');
  });
}

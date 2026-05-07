/**
 * Junior Web Developer Portfolio - Cinematic JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initBootSequence();
    initThemeToggle();
    initMobileMenu();
    initScrollReveal();
    initNavbarScroll();
    initProjectFilter();
    initProjectModal();
    initContactForm();
    initCurrentYear();
    initSmoothScroll();
    initTypingEffect();
    initMouseGlow();
    initParallax();
    initParticleSystem();
    initBinaryRain();
    initCounterAnimation();
});

/* ============================================
   BOOT SEQUENCE
   ============================================ */
function initBootSequence() {
    const overlay = document.getElementById('bootOverlay');
    if (!overlay) return;
    setTimeout(() => {
        overlay.classList.add('done');
        setTimeout(() => overlay.remove(), 1000);
    }, 3500);
}

/* ============================================
   THEME TOGGLE
   ============================================ */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    if (!mobileMenuBtn || !navLinks) return;
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

/* ============================================
   SCROLL REVEAL
   ============================================ */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));
}

/* ============================================
   NAVBAR SCROLL EFFECT
   ============================================ */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    const updateNavbar = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
}

/* ============================================
   PROJECT FILTERING
   ============================================ */
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => card.classList.add('hidden'), 300);
                }
            });
        });
    });
}

/* ============================================
   PROJECT MODAL
   ============================================ */
const projectData = {
    voltage: {
        title: 'Voltage — Guitar Store',
        subtitle: 'E-commerce Project',
        desc: 'An online guitar store built from scratch with product catalog, shopping cart, wishlist, reviews, admin panel, order management, and multi-language support (EN/RU/UA). My main learning project where I practice real-world frontend development.',
        tech: ['HTML', 'CSS', 'JavaScript', 'Responsive Design', 'i18n'],
        features: ['Product catalog with categories', 'Shopping cart with add/remove', 'Wishlist functionality', 'Product reviews and ratings', 'Admin panel for management', 'Order tracking system', 'Multi-language support (EN/RU/UA)', 'Mobile-responsive design']
    },
    portfolio: {
        title: 'Portfolio Website',
        subtitle: 'Learning Project',
        desc: 'This portfolio — built from scratch with HTML, CSS, and vanilla JavaScript. Features dark/light theme, canvas animations, scroll effects, project showcases, and responsive design.',
        tech: ['HTML', 'CSS', 'JavaScript', 'Canvas API'],
        features: ['Dark/light theme toggle', 'Canvas particle animations', 'Binary rain effect', 'Scroll reveal animations', 'Project modal system', 'Fully responsive layout', 'Custom CSS animations', 'No external libraries']
    },
    landing: {
        title: 'Landing Page',
        subtitle: 'First Project',
        desc: 'A responsive landing page built while learning Flexbox, CSS Grid, and mobile-first design. My first hands-on project that taught me the fundamentals of modern web layout.',
        tech: ['HTML', 'CSS', 'Responsive Design'],
        features: ['Mobile-first approach', 'Flexbox layouts', 'CSS Grid sections', 'Responsive navigation', 'Call-to-action buttons', 'Semantic HTML structure']
    }
};

function initProjectModal() {
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.id = 'projectModal';
    modal.innerHTML = `
        <div class="project-modal-content">
            <button class="project-modal-close" id="modalClose">&times;</button>
            <div class="project-modal-body">
                <h3 class="project-modal-title" id="modalTitle"></h3>
                <p class="project-modal-subtitle" id="modalSubtitle"></p>
                <p class="project-modal-desc" id="modalDesc"></p>
                <div class="project-modal-tech" id="modalTech"></div>
                <ul class="project-modal-features" id="modalFeatures"></ul>

            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const modalClose = document.getElementById('modalClose');
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    document.querySelectorAll('.project-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const projectId = btn.getAttribute('data-project');
            openModal(projectId);
        });
    });
}

function openModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalSubtitle').textContent = data.subtitle;
    document.getElementById('modalDesc').textContent = data.desc;
    document.getElementById('modalTech').innerHTML = data.tech.map(t => `<span class="tech-badge">${t}</span>`).join('');
    document.getElementById('modalFeatures').innerHTML = data.features.map(f => `<li>${f}</li>`).join('');
    document.getElementById('projectModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('projectModal').classList.remove('active');
    document.body.style.overflow = '';
}

/* ============================================
   CONTACT FORM VALIDATION
   ============================================ */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const fields = {
        name: { el: document.getElementById('name'), error: document.getElementById('nameError'), validate: (val) => val.trim().length >= 2 },
        email: { el: document.getElementById('email'), error: document.getElementById('emailError'), validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) },
        subject: { el: document.getElementById('subject'), error: document.getElementById('subjectError'), validate: (val) => val.trim().length >= 2 },
        message: { el: document.getElementById('message'), error: document.getElementById('messageError'), validate: (val) => val.trim().length >= 10 }
    };

    Object.values(fields).forEach(field => {
        if (!field.el) return;
        field.el.addEventListener('blur', () => validateField(field));
        field.el.addEventListener('input', () => { if (field.el.classList.contains('error')) validateField(field); });
    });

    function validateField(field) {
        const isValid = field.validate(field.el.value);
        if (!isValid && field.el.value.trim() !== '') {
            field.el.classList.add('error');
            field.error.classList.add('show');
            return false;
        } else {
            field.el.classList.remove('error');
            field.error.classList.remove('show');
            return true;
        }
    }

    function validateAll() {
        let isValid = true;
        Object.values(fields).forEach(field => {
            if (!field.validate(field.el.value)) {
                field.el.classList.add('error');
                field.error.classList.add('show');
                isValid = false;
            }
        });
        return isValid;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateAll()) return;
        const submitBtn = document.getElementById('submitBtn');
        const formSuccess = document.getElementById('formSuccess');
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending...</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/></circle></svg>`;
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
            formSuccess.classList.add('show');
            form.reset();
            setTimeout(() => formSuccess.classList.remove('show'), 5000);
        }, 1500);
    });
}

/* ============================================
   CURRENT YEAR
   ============================================ */
function initCurrentYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
}

/* ============================================
   TYPING EFFECT
   ============================================ */
function initTypingEffect() {
    const typingText = document.getElementById('typingText');
    if (!typingText) return;
    const phrases = [
        'console.log("Hello, World!");',
        'Building Voltage guitar store...',
        'Learning Flexbox & Grid...',
        'const skills = ["HTML", "CSS", "JS"];',
        'document.querySelector(".dream-job");'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }
        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }
        setTimeout(type, typeSpeed);
    }
    setTimeout(type, 1000);
}

/* ============================================
   MOUSE GLOW TRACKING
   ============================================ */
function initMouseGlow() {
    const glow = document.getElementById('mouseGlow');
    if (!glow || window.matchMedia('(pointer: coarse)').matches) return;
    let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });
    function animateGlow() {
        currentX += (mouseX - currentX) * 0.08;
        currentY += (mouseY - currentY) * 0.08;
        glow.style.left = currentX + 'px';
        glow.style.top = currentY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
}

/* ============================================
   PARALLAX SCROLL
   ============================================ */
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length === 0) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                parallaxElements.forEach(el => {
                    const speed = parseFloat(el.getAttribute('data-parallax'));
                    el.style.transform = `translateY(${scrollY * speed}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/* ============================================
   PARTICLE SYSTEM
   ============================================ */
function initParticleSystem() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let isVisible = true;

    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const PARTICLE_COUNT = window.matchMedia('(pointer: coarse)').matches ? 30 : 60;

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function animate() {
        animationId = null;
        if (!isVisible) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        animationId = requestAnimationFrame(animate);
    }

    // Visibility observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible && !animationId) animate();
        });
    });
    observer.observe(canvas);
    animate();
}

/* ============================================
   BINARY RAIN EFFECT
   ============================================ */
function initBinaryRain() {
    const canvas = document.getElementById('binaryCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let drops = [];
    let animationId;
    let isVisible = false;

    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        const columns = Math.floor(canvas.width / 14);
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops.push({
                x: i * 14,
                y: Math.random() * -100,
                speed: Math.random() * 2 + 1,
                chars: [],
                length: Math.floor(Math.random() * 15 + 5)
            });
            for (let j = 0; j < drops[i].length; j++) {
                drops[i].chars.push(Math.random() > 0.5 ? '1' : '0');
            }
        }
    }
    resize();
    window.addEventListener('resize', resize);

    function animate() {
        animationId = null;
        if (!isVisible) return;
        ctx.fillStyle = 'rgba(5, 8, 15, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '12px "JetBrains Mono", monospace';
        drops.forEach(drop => {
            drop.y += drop.speed;
            if (drop.y > canvas.height) {
                drop.y = -drop.length * 14;
                drop.speed = Math.random() * 2 + 1;
                drop.length = Math.floor(Math.random() * 15 + 5);
                drop.chars = [];
                for (let j = 0; j < drop.length; j++) {
                    drop.chars.push(Math.random() > 0.5 ? '1' : '0');
                }
            }
            for (let i = 0; i < drop.chars.length; i++) {
                const y = drop.y - i * 14;
                if (y < 0 || y > canvas.height) continue;
                const alpha = i === 0 ? 1 : Math.max(0, 0.8 - i * 0.08);
                ctx.fillStyle = `rgba(0, 212, 255, ${alpha * 0.3})`;
                ctx.fillText(drop.chars[i], drop.x, y);
            }
        });
        animationId = requestAnimationFrame(animate);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible && !animationId) animate();
        });
    });
    observer.observe(canvas);
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                animateCounter(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
}

function animateCounter(el, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current) + '+';
    }, 30);
}

/**
 * Junior Web Developer Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    initBootSequence();
    initThemeToggle();
    initMobileMenu();
    initCommandPalette();
    initProofMode();
    initVisitorRoute();
    initScrollReveal();
    initNavbarScroll();
    initActiveNavHighlight();
    initProjectFilter();
    initProjectModal();
    initCodeShowcase();
    initVoltagePreview();
    initQualityGate();
    initContactBriefBuilder();
    initContactActions();
    initContactForm();
    initCurrentYear();
    initLocalTime();
    initSmoothScroll();
    initTypingEffect();
    initMouseGlow();
    initPanelSpotlight();
    if (!reduceMotion) {
        initParallax();
        initParticleSystem();
        initBinaryRain();
    }
    initCounterAnimation();
});

/* ============================================
   BOOT SEQUENCE
   ============================================ */
function initBootSequence() {
    const overlay = document.getElementById('bootOverlay');
    if (!overlay) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let bootSeen = false;

    try {
        bootSeen = sessionStorage.getItem('portfolioBootSeen') === 'true';
        sessionStorage.setItem('portfolioBootSeen', 'true');
    } catch (error) {
        bootSeen = false;
    }

    const hasDeepLink = window.location.hash && window.location.hash !== '#home';
    const useFastBoot = prefersReducedMotion || bootSeen || hasDeepLink;
    if (useFastBoot) overlay.classList.add('boot-fast');

    const delay = useFastBoot ? 260 : 1450;
    setTimeout(() => {
        overlay.classList.add('done');
        setTimeout(() => overlay.remove(), useFastBoot ? 450 : 650);
    }, delay);
}

/* ============================================
   THEME TOGGLE
   ============================================ */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    if (!themeToggle) return;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    themeToggle.setAttribute('aria-label', savedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.setAttribute('aria-label', newTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    if (!mobileMenuBtn || !navLinks) return;

    const setMenuOpen = (isOpen) => {
        mobileMenuBtn.classList.toggle('active', isOpen);
        navLinks.classList.toggle('active', isOpen);
        mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.addEventListener('click', () => {
        setMenuOpen(!navLinks.classList.contains('active'));
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            setMenuOpen(false);
        });
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') setMenuOpen(false);
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) setMenuOpen(false);
    });
}

/* ============================================
   COMMAND PALETTE
   ============================================ */
function initCommandPalette() {
    const palette = document.getElementById('commandPalette');
    const toggle = document.getElementById('commandToggle');
    const closeBtn = document.getElementById('commandClose');
    const search = document.getElementById('commandSearch');
    const empty = document.getElementById('commandEmpty');
    const items = [...document.querySelectorAll('.command-item')];
    const openTriggers = [...document.querySelectorAll('[data-open-command-center]')];
    const toast = document.getElementById('copyToast');
    if (!palette || !toggle || !search || items.length === 0) return;

    let selectedIndex = 0;
    let previousFocus = null;

    const showToast = (message) => {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
    };

    const fallbackCopy = (text) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        let copied = false;
        try {
            copied = document.execCommand('copy');
        } catch (error) {
            copied = false;
        }
        textArea.remove();
        return copied;
    };

    const visibleItems = () => items.filter(item => !item.hidden);

    const updateSelected = (index = 0) => {
        const visible = visibleItems();
        selectedIndex = visible.length ? Math.max(0, Math.min(index, visible.length - 1)) : 0;
        items.forEach(item => item.classList.remove('is-selected'));
        if (visible[selectedIndex]) visible[selectedIndex].classList.add('is-selected');
        empty?.classList.toggle('show', visible.length === 0);
    };

    const filterItems = () => {
        const query = search.value.trim().toLowerCase();
        items.forEach(item => {
            const haystack = `${item.textContent} ${item.dataset.commandKeywords || ''}`.toLowerCase();
            item.hidden = Boolean(query) && !haystack.includes(query);
        });
        updateSelected(0);
    };

    const closePalette = () => {
        palette.classList.remove('active');
        palette.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('command-open');
        search.value = '';
        filterItems();
        if (previousFocus) previousFocus.focus({ preventScroll: true });
    };

    const openPalette = () => {
        previousFocus = document.activeElement;
        palette.classList.add('active');
        palette.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('command-open');
        requestAnimationFrame(() => {
            search.focus();
            updateSelected(0);
        });
    };

    const copyText = async (text) => {
        if (!text) return;
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else if (!fallbackCopy(text)) {
                throw new Error('Copy failed');
            }
            showToast('Email copied');
        } catch (error) {
            showToast('Copy blocked - use contact link');
        }
    };

    const scrollToTarget = (href) => {
        const target = document.querySelector(href);
        if (!target) return;
        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        history.pushState(null, '', href);
    };

    const runCommand = async (item) => {
        if (!item) return;
        const href = item.getAttribute('data-command-href');
        const projectId = item.getAttribute('data-command-project');
        const copyValue = item.getAttribute('data-command-copy');
        const proofCommand = item.hasAttribute('data-command-proof');
        closePalette();

        if (href) {
            scrollToTarget(href);
            return;
        }

        if (projectId) {
            setTimeout(() => openModal(projectId), 120);
            return;
        }

        if (copyValue) {
            await copyText(copyValue);
            return;
        }

        if (proofCommand) {
            document.dispatchEvent(new CustomEvent('portfolio:toggleProofMode'));
        }
    };

    toggle.addEventListener('click', () => {
        if (palette.classList.contains('active')) {
            closePalette();
        } else {
            openPalette();
        }
    });
    openTriggers.forEach(trigger => {
        trigger.addEventListener('click', openPalette);
    });

    closeBtn?.addEventListener('click', closePalette);
    palette.addEventListener('click', (event) => {
        if (event.target === palette) closePalette();
    });
    search.addEventListener('input', filterItems);
    items.forEach(item => {
        item.addEventListener('mouseenter', () => updateSelected(visibleItems().indexOf(item)));
        item.addEventListener('click', () => runCommand(item));
    });

    document.addEventListener('keydown', (event) => {
        const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
        if (isShortcut) {
            event.preventDefault();
            palette.classList.contains('active') ? closePalette() : openPalette();
            return;
        }

        if (!palette.classList.contains('active')) return;

        if (event.key === 'Escape') {
            event.preventDefault();
            closePalette();
            return;
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            const visible = visibleItems();
            if (visible.length === 0) return;
            const direction = event.key === 'ArrowDown' ? 1 : -1;
            updateSelected((selectedIndex + direction + visible.length) % visible.length);
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            runCommand(visibleItems()[selectedIndex]);
        }
    });

    filterItems();
}

/* ============================================
   PROOF MODE
   ============================================ */
function initProofMode() {
    const toggles = [...document.querySelectorAll('[data-proof-toggle]')];
    const proofTargets = [...document.querySelectorAll('[data-proof-label]')];
    const toast = document.getElementById('copyToast');
    if (!toggles.length || !proofTargets.length) return;

    const showToast = (message) => {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
    };

    const setProofMode = (isActive, shouldToast = false) => {
        document.body.classList.toggle('proof-mode', isActive);
        toggles.forEach(toggle => {
            toggle.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        try {
            sessionStorage.setItem('portfolioProofMode', isActive ? 'true' : 'false');
        } catch (error) {
            // Session storage can be unavailable in some embedded browsers.
        }

        if (shouldToast) {
            showToast(isActive ? 'Proof mode enabled' : 'Proof mode disabled');
        }
    };

    let savedMode = false;
    try {
        savedMode = sessionStorage.getItem('portfolioProofMode') === 'true';
    } catch (error) {
        savedMode = false;
    }

    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            setProofMode(!document.body.classList.contains('proof-mode'), true);
        });
    });

    document.addEventListener('portfolio:toggleProofMode', () => {
        setProofMode(!document.body.classList.contains('proof-mode'), true);
    });

    setProofMode(savedMode);
}

/* ============================================
   VISITOR ROUTE
   ============================================ */
function initVisitorRoute() {
    const tabs = [...document.querySelectorAll('[data-route-tab]')];
    const kicker = document.getElementById('visitorRouteKicker');
    const title = document.getElementById('visitorRouteTitle');
    const stepsContainer = document.getElementById('visitorRouteSteps');
    const primary = document.getElementById('visitorRoutePrimary');
    if (!tabs.length || !kicker || !title || !stepsContainer || !primary) return;

    const routes = {
        recruiter: {
            kicker: 'Hiring route',
            title: 'Check fit, proof, then contact',
            primary: { label: 'Start with skills', href: '#skills' },
            steps: [
                { label: '01', title: 'Skills evidence', text: 'See practical frontend skills tied to visible work.', href: '#skills' },
                { label: '02', title: 'Project proof', text: 'Review featured cases, portfolio systems, and honest status.', href: '#projects' },
                { label: '03', title: 'Contact route', text: 'Use the builder or Telegram/email once the fit is clear.', href: '#contact' }
            ]
        },
        client: {
            kicker: 'Client route',
            title: 'See useful UI work before messaging',
            primary: { label: 'Start with projects', href: '#projects' },
            steps: [
                { label: '01', title: 'Project surface', text: 'Check cards, modals, filters, and real interaction polish.', href: '#projects' },
                { label: '02', title: 'Quality gate', text: 'Confirm the page is checked instead of only decorated.', href: '#quality-gate' },
                { label: '03', title: 'Message builder', text: 'Generate a clear opener for a small frontend task.', href: '#contact' }
            ]
        },
        mentor: {
            kicker: 'Mentor route',
            title: 'Inspect growth, gaps, and next steps',
            primary: { label: 'Start with roadmap', href: '#experience' },
            steps: [
                { label: '01', title: 'Build timeline', text: 'See how the project work evolved and what changed.', href: '#experience' },
                { label: '02', title: 'Quality checks', text: 'Review the live audit and current guardrails.', href: '#quality-gate' },
                { label: '03', title: 'Pattern lab', text: 'Inspect reusable UI experiments feeding future work.', href: '#lab-board' }
            ]
        }
    };

    const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[char]);

    const setRoute = (routeName) => {
        const route = routes[routeName] || routes.recruiter;
        tabs.forEach(tab => {
            const isActive = tab.getAttribute('data-route-tab') === routeName;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        kicker.textContent = route.kicker;
        title.textContent = route.title;
        primary.textContent = route.primary.label;
        primary.href = route.primary.href;
        stepsContainer.innerHTML = route.steps.map(step => `
            <article class="visitor-route-step">
                <span>${escapeHtml(step.label)}</span>
                <strong>${escapeHtml(step.title)}</strong>
                <p>${escapeHtml(step.text)}</p>
                <a href="${escapeHtml(step.href)}">Open section</a>
            </article>
        `).join('');
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => setRoute(tab.getAttribute('data-route-tab')));
    });

    setRoute('recruiter');
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
   ACTIVE NAVIGATION
   ============================================ */
function initActiveNavHighlight() {
    const links = [...document.querySelectorAll('.nav-links li:not(.nav-drawer-action) a[href^="#"]')];
    const sections = links
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);
    if (links.length === 0 || sections.length === 0) return;

    const setActive = (id) => {
        links.forEach(link => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    const updateActive = () => {
        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
        const marker = window.scrollY + navbarHeight + Math.min(window.innerHeight * 0.35, 260);
        let current = null;

        sections.forEach(section => {
            if (marker >= section.offsetTop) current = section.id;
        });

        const isPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
        if (isPageEnd) current = sections[sections.length - 1].id;

        setActive(current);
    };

    links.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('href').slice(1);
            setActive(targetId);
        });
    });

    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);
    updateActive();
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
                clearTimeout(card.hideTimeout);
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
                    card.hideTimeout = setTimeout(() => card.classList.add('hidden'), 300);
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
        subtitle: 'E-commerce Project · In rebuild',
        desc: 'An online guitar store rebuilt around product catalog, cart state, wishlist, reviews, admin flow, order management, and multi-language support (EN/RU/UA/DE). The live link waits until the core flow is stable, so the portfolio shows a case study instead of a fake demo.',
        caseHero: {
            kicker: 'Voltage case file',
            headline: 'A rebuild focused on product behavior, not fake polish',
            stats: [
                { value: '4', label: 'core store flows' },
                { value: '4', label: 'interface languages' },
                { value: '0', label: 'unverified live links' }
            ]
        },
        caseStudy: [
            {
                label: 'Problem',
                text: 'Create a realistic e-commerce project instead of another static landing page, with flows that behave like a real store.'
            },
            {
                label: 'What I built',
                text: 'Product catalog, cart interactions, wishlist, reviews, admin panel ideas, order flow, and multilingual interface states.'
            },
            {
                label: 'Rebuild focus',
                text: 'Cleaner structure, better responsive behavior, simpler state handling, and UI that can grow without becoming messy.'
            },
            {
                label: 'What I learned',
                text: 'DOM state, reusable interface patterns, edge cases in carts, language switching, and how much polish comes from small details.'
            }
        ],
        decisionMap: [
            {
                step: '01',
                title: 'Scope before polish',
                text: 'Catalog, cart, admin, and i18n define the rebuild before visual effects are added.'
            },
            {
                step: '02',
                title: 'State first',
                text: 'Cart behavior, quantity merging, and interface feedback are treated as product logic.'
            },
            {
                step: '03',
                title: 'Ship when stable',
                text: 'The live demo waits until normal user clicks cannot break the core store flow.'
            }
        ],
        buildStatus: [
            { label: 'Now', text: 'Reworking structure, store states, and responsive screens.' },
            { label: 'Next', text: 'Move repeated UI patterns into cleaner reusable pieces.' },
            { label: 'Proof', text: 'Use the portfolio preview as a transparent progress snapshot.' }
        ],
        tech: ['HTML', 'CSS', 'JavaScript', 'Responsive Design', 'i18n'],
        features: ['Product catalog with categories', 'Shopping cart with add/remove', 'Wishlist functionality', 'Product reviews and ratings', 'Admin panel for management', 'Order tracking system', 'Multi-language support (EN/RU/UA/DE)', 'Mobile-responsive design'],
        actions: [
            { label: 'View UI Preview', href: '#showcase' },
            { label: 'GitHub', href: 'https://github.com/Drolikus', external: true },
            { label: 'Contact', href: '#contact' }
        ]
    },
    portfolio: {
        title: 'Portfolio Website',
        subtitle: 'Live Portfolio System',
        desc: 'This portfolio is a live proof surface built with HTML, CSS, and vanilla JavaScript. It now uses real project evidence, case files, project filtering, modal details, active navigation, theme switching, canvas effects, and responsive layouts.',
        tech: ['HTML', 'CSS', 'JavaScript', 'Canvas API'],
        features: ['Real screenshot-based project card', 'Dark/light theme toggle', 'Canvas particle animations', 'Binary rain effect', 'Scroll reveal animations', 'Project modal system', 'Fully responsive layout', 'Custom CSS animations'],
        actions: [
            { label: 'Open Site', href: '#home' },
            { label: 'GitHub', href: 'https://github.com/Drolikus', external: true }
        ]
    },
    lab: {
        title: 'Frontend Practice Lab',
        subtitle: 'UI Experiments - Pattern board',
        desc: 'A focused practice space for interface patterns: responsive layouts, filters, modals, cards, theme states, form feedback, and micro-interactions. I use these experiments to build faster and cleaner across project work and this portfolio.',
        caseHero: {
            kicker: 'Practice system',
            headline: 'A lab for testing UI patterns before they enter real projects',
            stats: [
                { value: '6', label: 'pattern groups' },
                { value: '2', label: 'projects fed by it' },
                { value: '1', label: 'shared design rhythm' }
            ]
        },
        caseStudy: [
            {
                label: 'Purpose',
                text: 'Train interface patterns in small, controlled pieces before mixing them into larger project screens.'
            },
            {
                label: 'Used for',
                text: 'Project cards, filters, modal behavior, theme states, contact feedback, and responsive layout pressure.'
            },
            {
                label: 'Quality bar',
                text: 'Every experiment needs a real use case, a mobile state, and a reason to exist in the portfolio or a project case.'
            },
            {
                label: 'Learning result',
                text: 'Cleaner CSS structure, stronger component instincts, and less random styling when building new sections.'
            }
        ],
        decisionMap: [
            {
                step: '01',
                title: 'Prototype small',
                text: 'Start with one isolated pattern instead of redesigning a whole page at once.'
            },
            {
                step: '02',
                title: 'Stress the state',
                text: 'Check long labels, mobile width, active states, empty states, and feedback timing.'
            },
            {
                step: '03',
                title: 'Promote only useful pieces',
                text: 'Move patterns into the real site only when they make a project case or the portfolio clearer.'
            }
        ],
        buildStatus: [
            { label: 'Active', text: 'Layout, modal, theme, and contact patterns are already reused here.' },
            { label: 'Next', text: 'Turn repeated patterns into cleaner React-ready component ideas.' },
            { label: 'Guardrail', text: 'No experiment stays if it only adds noise or fake complexity.' }
        ],
        tech: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
        features: ['Reusable card layouts', 'Responsive spacing experiments', 'Filter and modal patterns', 'Theme state practice', 'Form feedback states', 'Mobile QA checks', 'Micro-interaction experiments', 'Semantic HTML structure'],
        actions: [
            { label: 'View Board', href: '#lab-board' },
            { label: 'GitHub', href: 'https://github.com/Drolikus', external: true },
            { label: 'Contact', href: '#contact' }
        ]
    }
};

function initProjectModal() {
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.id = 'projectModal';
    modal.innerHTML = `
        <div class="project-modal-content" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <button class="project-modal-close" id="modalClose" type="button" aria-label="Close project details">&times;</button>
            <div class="project-modal-body" id="modalBody">
                <div class="project-case-hero" id="modalCaseHero" hidden></div>
                <h3 class="project-modal-title" id="modalTitle"></h3>
                <p class="project-modal-subtitle" id="modalSubtitle"></p>
                <p class="project-modal-desc" id="modalDesc"></p>
                <div class="project-case-study" id="modalCaseStudy"></div>
                <div class="project-decision-map" id="modalDecisionMap" hidden></div>
                <div class="project-modal-status" id="modalStatus" hidden></div>
                <div class="project-modal-tech" id="modalTech"></div>
                <ul class="project-modal-features" id="modalFeatures"></ul>
                <div class="project-modal-actions" id="modalActions"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const modalClose = document.getElementById('modalClose');
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    modal.addEventListener('click', (e) => {
        const actionLink = e.target.closest('#modalActions a[href^="#"]');
        if (!actionLink) return;
        const target = document.querySelector(actionLink.getAttribute('href'));
        if (!target) return;

        e.preventDefault();
        closeModal();
        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    });
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
    const modalBody = document.getElementById('modalBody');
    const caseHero = document.getElementById('modalCaseHero');
    const decisionMap = document.getElementById('modalDecisionMap');
    const modalStatus = document.getElementById('modalStatus');

    modalBody.classList.toggle('project-modal-body--case', Boolean(data.caseHero));
    caseHero.hidden = !data.caseHero;
    caseHero.innerHTML = data.caseHero ? `
        <div>
            <span>${data.caseHero.kicker}</span>
            <strong>${data.caseHero.headline}</strong>
        </div>
        <div class="project-case-hero-stats">
            ${data.caseHero.stats.map(stat => `
                <article>
                    <strong>${stat.value}</strong>
                    <span>${stat.label}</span>
                </article>
            `).join('')}
        </div>
    ` : '';

    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalSubtitle').textContent = data.subtitle;
    document.getElementById('modalDesc').textContent = data.desc;
    document.getElementById('modalCaseStudy').innerHTML = (data.caseStudy || []).map(item => `
        <article class="case-study-item">
            <span>${item.label}</span>
            <p>${item.text}</p>
        </article>
    `).join('');
    decisionMap.hidden = !data.decisionMap;
    decisionMap.innerHTML = data.decisionMap ? `
        <div class="project-modal-section-title">
            <span>Decision map</span>
            <strong>How the rebuild is controlled</strong>
        </div>
        <div class="project-decision-list">
            ${data.decisionMap.map(item => `
                <article>
                    <span>${item.step}</span>
                    <strong>${item.title}</strong>
                    <p>${item.text}</p>
                </article>
            `).join('')}
        </div>
    ` : '';
    modalStatus.hidden = !data.buildStatus;
    modalStatus.innerHTML = data.buildStatus ? data.buildStatus.map(item => `
        <article>
            <span>${item.label}</span>
            <p>${item.text}</p>
        </article>
    `).join('') : '';
    document.getElementById('modalTech').innerHTML = data.tech.map(t => `<span class="tech-badge">${t}</span>`).join('');
    document.getElementById('modalFeatures').innerHTML = data.features.map(f => `<li>${f}</li>`).join('');
    document.getElementById('modalActions').innerHTML = (data.actions || []).map((action, index) => {
        const className = index === 0 ? 'btn btn-primary' : 'btn btn-secondary';
        const target = action.external ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a class="${className}" href="${action.href}"${target}>${action.label}</a>`;
    }).join('');
    document.getElementById('projectModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('projectModal').classList.remove('active');
    document.body.style.overflow = '';
}

/* ============================================
   CODE SHOWCASE
   ============================================ */
function initCodeShowcase() {
    const tabs = [...document.querySelectorAll('[data-code-tab]')];
    const codeBlock = document.getElementById('showcaseCodeBlock');
    const filename = document.getElementById('showcaseCodeFilename');
    const language = document.getElementById('showcaseCodeLang');
    if (!tabs.length || !codeBlock || !filename || !language) return;

    const snippets = {
        html: {
            filename: 'product_card.html',
            language: 'HTML',
            code: `<span class="token-keyword">&lt;article</span> <span class="token-type">class</span>=<span class="token-string">"product-card"</span><span class="token-keyword">&gt;</span>
  <span class="token-keyword">&lt;div</span> <span class="token-type">class</span>=<span class="token-string">"product-media"</span><span class="token-keyword">&gt;&lt;/div&gt;</span>
  <span class="token-keyword">&lt;div</span> <span class="token-type">class</span>=<span class="token-string">"product-info"</span><span class="token-keyword">&gt;</span>
    <span class="token-keyword">&lt;p</span> <span class="token-type">class</span>=<span class="token-string">"eyebrow"</span><span class="token-keyword">&gt;</span>Electric Guitar<span class="token-keyword">&lt;/p&gt;</span>
    <span class="token-keyword">&lt;h3&gt;</span>Fender Stratocaster<span class="token-keyword">&lt;/h3&gt;</span>
    <span class="token-keyword">&lt;p</span> <span class="token-type">class</span>=<span class="token-string">"price"</span><span class="token-keyword">&gt;</span>&euro;899<span class="token-keyword">&lt;/p&gt;</span>
    <span class="token-keyword">&lt;button</span> <span class="token-type">class</span>=<span class="token-string">"btn-cart"</span><span class="token-keyword">&gt;</span>Add to cart<span class="token-keyword">&lt;/button&gt;</span>
  <span class="token-keyword">&lt;/div&gt;</span>
<span class="token-keyword">&lt;/article&gt;</span>`
        },
        css: {
            filename: 'product_card.css',
            language: 'CSS',
            code: `<span class="token-type">.product-card</span> {
  <span class="token-keyword">display</span>: grid;
  <span class="token-keyword">gap</span>: <span class="token-num">1rem</span>;
  <span class="token-keyword">padding</span>: <span class="token-num">1rem</span>;
  <span class="token-keyword">border</span>: <span class="token-num">1px</span> solid <span class="token-string">var(--border-color)</span>;
  <span class="token-keyword">border-radius</span>: <span class="token-num">8px</span>;
}

<span class="token-type">.product-card:hover</span> {
  <span class="token-keyword">border-color</span>: <span class="token-string">var(--accent-cyan)</span>;
  <span class="token-keyword">box-shadow</span>: <span class="token-string">var(--shadow-glow-cyan)</span>;
}

<span class="token-type">.btn-cart</span> {
  <span class="token-keyword">background</span>: linear-gradient(<span class="token-num">135deg</span>, <span class="token-string">#f59e0b</span>, <span class="token-string">#f43f5e</span>);
}`
        },
        js: {
            filename: 'cart_state.js',
            language: 'JS',
            code: `<span class="token-keyword">const</span> cart = {
  items: [],
  <span class="token-func">add</span>(product) {
    <span class="token-keyword">const</span> existing = <span class="token-keyword">this</span>.items.<span class="token-func">find</span>(item =&gt; item.id === product.id);
    <span class="token-keyword">if</span> (existing) {
      existing.qty += <span class="token-num">1</span>;
    } <span class="token-keyword">else</span> {
      <span class="token-keyword">this</span>.items.<span class="token-func">push</span>({ ...product, qty: <span class="token-num">1</span> });
    }
    <span class="token-func">renderCartBadge</span>(<span class="token-keyword">this</span>.items);
  },
  <span class="token-func">total</span>() {
    <span class="token-keyword">return</span> <span class="token-keyword">this</span>.items.<span class="token-func">reduce</span>((sum, item) =&gt; sum + item.price * item.qty, <span class="token-num">0</span>);
  }
};`
        }
    };

    const setCode = (mode) => {
        const snippet = snippets[mode] || snippets.html;
        filename.textContent = snippet.filename;
        language.textContent = snippet.language;
        codeBlock.innerHTML = snippet.code;
        tabs.forEach(tab => {
            const isActive = tab.getAttribute('data-code-tab') === mode;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => setCode(tab.getAttribute('data-code-tab')));
    });

    setCode('html');
}

/* ============================================
   VOLTAGE PREVIEW
   ============================================ */
function initVoltagePreview() {
    const tabs = [...document.querySelectorAll('[data-preview-mode]')];
    const stage = document.getElementById('voltagePreviewStage');
    const title = document.getElementById('voltagePreviewTitle');
    const badge = document.getElementById('voltagePreviewBadge');
    const progressRows = [...document.querySelectorAll('[data-preview-progress]')];
    if (!tabs.length || !stage || !title || !badge) return;

    const previews = {
        catalog: {
            title: 'Catalog flow',
            badge: '3 products',
            html: `
                <div class="preview-search">
                    <span>Search guitars</span>
                    <strong>Electric</strong>
                </div>
                <div class="preview-product-grid">
                    <article>
                        <span>Electric</span>
                        <strong>Fender Stratocaster</strong>
                        <em>&euro;899</em>
                    </article>
                    <article>
                        <span>Bass</span>
                        <strong>Jazz Bass Player</strong>
                        <em>&euro;749</em>
                    </article>
                    <article>
                        <span>Acoustic</span>
                        <strong>Yamaha FG800</strong>
                        <em>&euro;329</em>
                    </article>
                </div>
            `
        },
        cart: {
            title: 'Cart behavior',
            badge: 'Cart: 2',
            html: `
                <div class="preview-cart-list">
                    <div class="preview-cart-row">
                        <span>Electric Guitar</span>
                        <strong>Fender Stratocaster</strong>
                        <em>Qty 1</em>
                        <strong>&euro;899</strong>
                    </div>
                    <div class="preview-cart-row">
                        <span>Accessory</span>
                        <strong>Ernie Ball Strings</strong>
                        <em>Qty 2</em>
                        <strong>&euro;24</strong>
                    </div>
                    <div class="preview-total">
                        <span>Total with quantity merge</span>
                        <strong>&euro;923</strong>
                    </div>
                </div>
            `
        },
        admin: {
            title: 'Admin overview',
            badge: '12 orders',
            html: `
                <div class="preview-admin-grid">
                    <div class="preview-admin-card">
                        <span>Revenue</span>
                        <strong>&euro;4.8k</strong>
                    </div>
                    <div class="preview-admin-card">
                        <span>Orders</span>
                        <strong>12</strong>
                    </div>
                    <div class="preview-admin-card">
                        <span>Stock alerts</span>
                        <strong>3</strong>
                    </div>
                </div>
                <div class="preview-order-list">
                    <div><strong>#1042</strong><span>Paid</span></div>
                    <div><strong>#1041</strong><span>Packing</span></div>
                    <div><strong>#1040</strong><span>Review</span></div>
                </div>
            `
        },
        i18n: {
            title: 'Language states',
            badge: 'EN / RU / UA / DE',
            html: `
                <div class="preview-lang-grid">
                    <span class="active">EN</span>
                    <span>RU</span>
                    <span>UA</span>
                    <span>DE</span>
                </div>
                <div class="preview-language-card">
                    <span>German label stress test</span>
                    <strong>Warenkorb verwalten</strong>
                    <p>Layout keeps longer labels readable without squeezing the product controls.</p>
                </div>
            `
        }
    };

    const setPreview = (mode) => {
        const preview = previews[mode] || previews.catalog;
        title.textContent = preview.title;
        badge.textContent = preview.badge;
        stage.innerHTML = preview.html;

        tabs.forEach(tab => {
            const isActive = tab.getAttribute('data-preview-mode') === mode;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        progressRows.forEach(row => {
            row.classList.toggle('active', row.getAttribute('data-preview-progress') === mode);
        });
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => setPreview(tab.getAttribute('data-preview-mode')));
    });

    setPreview('catalog');
}

/* ============================================
   QUALITY GATE
   ============================================ */
function initQualityGate() {
    const tabs = [...document.querySelectorAll('[data-quality-tab]')];
    const panels = [...document.querySelectorAll('[data-quality-panel]')];
    const auditRun = document.getElementById('qualityAuditRun');
    const auditScore = document.getElementById('qualityAuditScore');
    const auditStatus = document.getElementById('qualityAuditStatus');
    const auditList = document.getElementById('qualityAuditList');
    if (!tabs.length || !panels.length) return;

    const setQualityTab = (mode) => {
        tabs.forEach(tab => {
            const isActive = tab.getAttribute('data-quality-tab') === mode;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        panels.forEach(panel => {
            const isActive = panel.getAttribute('data-quality-panel') === mode;
            panel.classList.toggle('active', isActive);
            panel.hidden = !isActive;
        });
    };

    const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[char]);

    const runQualityAudit = () => {
        if (!auditScore || !auditStatus || !auditList) return;

        const brokenImages = [...document.images]
            .filter(image => image.complete && image.naturalWidth === 0)
            .map(image => image.getAttribute('src') || image.alt || 'unknown image');
        const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
        const missingNavTargets = navLinks
            .map(link => link.getAttribute('href'))
            .filter((href, index, all) => href && all.indexOf(href) === index)
            .filter(href => !document.querySelector(href));
        const proofTargets = document.querySelectorAll('[data-proof-label]').length;
        const commandItems = document.querySelectorAll('.command-item').length;
        const briefMessage = document.getElementById('briefMessage');
        const briefCopy = document.querySelector('.brief-copy-btn');
        const activeQualityPanel = document.querySelector('[data-quality-panel]:not([hidden])');
        const hasOverflow = document.documentElement.scrollWidth > window.innerWidth + 1;

        const checks = [
            {
                label: 'No horizontal overflow',
                passed: !hasOverflow,
                detail: `${document.documentElement.scrollWidth}px page width on ${window.innerWidth}px viewport`
            },
            {
                label: 'Images resolve',
                passed: brokenImages.length === 0,
                detail: brokenImages.length ? brokenImages.join(', ') : `${document.images.length} image assets checked`
            },
            {
                label: 'Navigation targets exist',
                passed: missingNavTargets.length === 0,
                detail: missingNavTargets.length ? missingNavTargets.join(', ') : `${navLinks.length} nav links point to real sections`
            },
            {
                label: 'Proof layer mapped',
                passed: proofTargets >= 7,
                detail: `${proofTargets} evidence blocks connected to Proof mode`
            },
            {
                label: 'Command palette coverage',
                passed: commandItems >= 10,
                detail: `${commandItems} quick actions available`
            },
            {
                label: 'Message builder ready',
                passed: Boolean(briefMessage?.value.length > 80 && briefCopy?.getAttribute('data-copy') === briefMessage.value),
                detail: briefMessage ? `${briefMessage.value.length} characters generated and wired to copy` : 'builder not found'
            },
            {
                label: 'Quality tabs wired',
                passed: tabs.length === 4 && panels.length === 4 && Boolean(activeQualityPanel),
                detail: `${tabs.length} tabs / ${panels.length} panels, active: ${activeQualityPanel?.getAttribute('data-quality-panel') || 'none'}`
            }
        ];

        const passedCount = checks.filter(check => check.passed).length;
        auditScore.textContent = `${passedCount} / ${checks.length}`;
        auditStatus.textContent = passedCount === checks.length ? 'All live checks pass in this viewport.' : 'Some checks need attention in this viewport.';
        auditStatus.classList.toggle('pass', passedCount === checks.length);
        auditStatus.classList.toggle('warn', passedCount !== checks.length);
        auditList.innerHTML = checks.map(check => `
            <article class="quality-audit-item ${check.passed ? 'pass' : 'fail'}">
                <i>${check.passed ? 'OK' : '!'}</i>
                <div>
                    <strong>${escapeHtml(check.label)}</strong>
                    <span>${escapeHtml(check.detail)}</span>
                </div>
            </article>
        `).join('');
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => setQualityTab(tab.getAttribute('data-quality-tab')));
    });

    auditRun?.addEventListener('click', runQualityAudit);
    setQualityTab('mobile');
    setTimeout(runQualityAudit, 650);
}

/* ============================================
   CONTACT BRIEF BUILDER
   ============================================ */
function initContactBriefBuilder() {
    const builder = document.querySelector('[data-brief-builder]');
    const output = document.getElementById('briefMessage');
    const copyButton = builder?.querySelector('.brief-copy-btn');
    const mailLink = document.getElementById('briefMailLink');
    if (!builder || !output || !copyButton || !mailLink) return;

    const state = {
        intent: 'role',
        focus: 'voltage',
        route: 'telegram'
    };

    const copy = {
        intent: {
            role: {
                subject: 'Junior frontend opportunity',
                text: 'I found your portfolio and want to talk about a junior frontend opportunity.'
            },
            task: {
                subject: 'Small frontend task',
                text: 'I have a small frontend task and want to discuss layout, responsive fixes, UI states, or interaction polish.'
            },
            feedback: {
                subject: 'Project feedback',
                text: 'I looked through your work and want to share practical feedback or discuss your next frontend steps.'
            }
        },
        focus: {
            voltage: 'I am especially interested in your Voltage e-commerce rebuild and the catalog/cart/admin UI direction.',
            portfolio: 'I am especially interested in the portfolio system, proof mode, case files, and interaction polish.',
            responsive: 'I am especially interested in responsive UI quality, mobile behavior, and edge-case handling.'
        },
        route: {
            telegram: 'Telegram works best for a quick first message.',
            email: 'Email works best if you want to send details, links, or a written brief.'
        }
    };

    const updateBuilder = () => {
        builder.querySelectorAll('[data-brief-group]').forEach(group => {
            const groupName = group.getAttribute('data-brief-group');
            group.querySelectorAll('[data-brief-option]').forEach(button => {
                const isActive = button.getAttribute('data-brief-option') === state[groupName];
                button.classList.toggle('active', isActive);
                button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });
        });

        const message = [
            `Hi Vlad, ${copy.intent[state.intent].text}`,
            copy.focus[state.focus],
            copy.route[state.route]
        ].join(' ');

        output.value = message;
        copyButton.setAttribute('data-copy', message);
        const subject = copy.intent[state.intent].subject;
        mailLink.href = `mailto:vladikkihtenko@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    };

    builder.addEventListener('click', (event) => {
        const button = event.target.closest('[data-brief-option]');
        if (!button) return;
        const group = button.closest('[data-brief-group]');
        const groupName = group?.getAttribute('data-brief-group');
        if (!groupName || !Object.prototype.hasOwnProperty.call(state, groupName)) return;
        state[groupName] = button.getAttribute('data-brief-option');
        updateBuilder();
    });

    updateBuilder();
}

/* ============================================
   CONTACT ACTIONS
   ============================================ */
function initContactActions() {
    const copyButtons = document.querySelectorAll('[data-copy]');
    const toast = document.getElementById('copyToast');
    if (copyButtons.length === 0) return;

    const showToast = (message) => {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
    };

    const fallbackCopy = (text) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '-9999px';
        textArea.style.width = '1px';
        textArea.style.height = '1px';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, textArea.value.length);
        let copied = false;
        try {
            copied = document.execCommand('copy');
        } catch (error) {
            copied = false;
        }
        textArea.remove();
        return copied;
    };

    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const text = button.getAttribute('data-copy');
            if (!text) return;

            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(text);
                } else if (!fallbackCopy(text)) {
                    throw new Error('Copy failed');
                }
                const label = button.getAttribute('data-copy-label') || 'Email';
                showToast(`${label} copied`);
            } catch (error) {
                const briefMessage = button.classList.contains('brief-copy-btn') ? document.getElementById('briefMessage') : null;
                if (briefMessage) {
                    briefMessage.focus();
                    briefMessage.select();
                    briefMessage.classList.add('is-selected');
                    setTimeout(() => briefMessage.classList.remove('is-selected'), 2200);
                    showToast('Message selected - press Ctrl+C');
                    return;
                }
                showToast('Copy blocked - use link');
            }
        });
    });
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

function initLocalTime() {
    const localTimeEl = document.getElementById('localTime');
    if (!localTimeEl) return;

    const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Berlin',
        hour: '2-digit',
        minute: '2-digit'
    });

    const updateTime = () => {
        localTimeEl.textContent = formatter.format(new Date());
    };

    updateTime();
    setInterval(updateTime, 30000);
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
        'const developer = "Vladyslav";',
        'Building Voltage guitar store...',
        'Ukraine -> Germany -> frontend...',
        'Shipping UI in EN / RU / UA / DE...',
        'const skills = ["HTML", "CSS", "JS"];',
        'document.querySelector(".next-level");'
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
   PANEL SPOTLIGHT
   ============================================ */
function initPanelSpotlight() {
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = document.querySelectorAll([
        '.stat',
        '.hero-focus-item',
        '.about-card',
        '.review-snapshot-copy',
        '.review-snapshot-card',
        '.upgrade-log-panel',
        '.upgrade-log-card',
        '.visitor-route-panel',
        '.visitor-route-step',
        '.build-loop',
        '.growth-panel',
        '.skill-category',
        '.capability-panel',
        '.skill-proof-panel',
        '.skill-proof-card',
        '.project-card',
        '.project-ledger-panel',
        '.case-file-panel',
        '.lab-board-panel',
        '.quality-gate-panel',
        '.build-panel',
        '.timeline-content',
        '.roadmap-panel',
        '.contact-fit-panel',
        '.contact-message-kit',
        '.contact-status-item',
        '.contact-form'
    ].join(','));

    targets.forEach(target => {
        target.classList.add('spotlight-target');
        target.addEventListener('pointerenter', () => target.classList.add('spotlight-active'));
        target.addEventListener('pointerleave', () => target.classList.remove('spotlight-active'));
        target.addEventListener('pointermove', (event) => {
            const rect = target.getBoundingClientRect();
            target.classList.add('spotlight-active');
            target.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`);
            target.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`);
        }, { passive: true });
    });
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
    const duration = 900;
    const start = performance.now();

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target <= 2
            ? Math.max(1, Math.round(target * eased))
            : Math.floor(target * eased);
        el.textContent = value + '+';
        if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}

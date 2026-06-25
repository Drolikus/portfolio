/**
 * Junior Web Developer Portfolio
 */

/* ============================================
   SHARED HELPERS
   ============================================ */
function showCopyToast(message) {
    const toast = document.getElementById('copyToast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showCopyToast.timer);
    showCopyToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function fallbackCopy(text) {
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
}

async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
    } else if (!fallbackCopy(text)) {
        throw new Error('Copy failed');
    }
}

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    initThemeToggle();
    initMobileMenu();
    initCommandPalette();
    initVisitorRoute();
    initScrollReveal();
    initNavbarScroll();
    initActiveNavHighlight();
    initProjectFilter();
    initCodeShowcase();
    initVoltagePreview();
    initSiteChecks();
    initContactBriefBuilder();
    initContactActions();
    initCurrentYear();
    initLocalTime();
    initSmoothScroll();
    initTypingEffect();
    initPanelSpotlight();
    if (!reduceMotion) {
        initParallax();
    }
    initCounterAnimation();
});

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
    if (!palette || !toggle || !search || items.length === 0) return;

    let selectedIndex = 0;
    let previousFocus = null;

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
            await copyToClipboard(text);
            showCopyToast('Email copied');
        } catch (error) {
            showCopyToast('Copy blocked - use contact link');
        }
    };

    const scrollToTarget = (href) => {
        if (!href.startsWith('#')) {
            window.location.href = href;
            return;
        }
        const target = document.querySelector(href);
        if (!target) return;
        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({ top: targetPosition, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        history.pushState(null, '', href);
    };

    const runCommand = async (item) => {
        if (!item) return;
        const href = item.getAttribute('data-command-href');
        const copyValue = item.getAttribute('data-command-copy');
        closePalette();

        if (href) {
            scrollToTarget(href);
            return;
        }

        if (copyValue) {
            await copyText(copyValue);
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
            title: 'Check fit, projects, then contact',
            primary: { label: 'Start with skills', href: '#skills' },
            steps: [
                { label: '01', title: 'Skills map', text: 'See practical frontend skills tied to visible work.', href: '#skills' },
                { label: '02', title: 'Project cases', text: 'Review featured cases, portfolio systems, and current status.', href: '#projects' },
                { label: '03', title: 'Contact route', text: 'Use the builder or Telegram/email once the fit is clear.', href: '#contact' }
            ]
        },
        client: {
            kicker: 'Client route',
            title: 'See useful UI work before messaging',
            primary: { label: 'Start with projects', href: '#projects' },
            steps: [
                { label: '01', title: 'Project surface', text: 'Check cards, case routes, filters, and real interaction polish.', href: '#projects' },
                { label: '02', title: 'Site checks', text: 'Confirm the page is checked instead of only decorated.', href: '#site-checks' },
                { label: '03', title: 'Message builder', text: 'Generate a clear opener for a small frontend task.', href: '#contact' }
            ]
        },
        mentor: {
            kicker: 'Mentor route',
            title: 'Inspect growth, gaps, and next steps',
            primary: { label: 'Start with roadmap', href: '#experience' },
            steps: [
                { label: '01', title: 'Build timeline', text: 'See how the project work evolved and what changed.', href: '#experience' },
                { label: '02', title: 'Site checks', text: 'Review current guardrails and browser checks.', href: '#site-checks' },
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
    const sectionIds = new Set(sections.map(section => section.id));

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

    const alignToHash = () => {
        const hashId = decodeURIComponent(window.location.hash.slice(1));
        if (!hashId || !sectionIds.has(hashId)) return false;
        const target = document.getElementById(hashId);
        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
        const targetPosition = Math.max(0, target.getBoundingClientRect().top + window.pageYOffset - navbarHeight + 1);
        if (Math.abs(window.scrollY - targetPosition) > 4) {
            window.scrollTo({ top: targetPosition, behavior: 'auto' });
        }
        setActive(hashId);
        return true;
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
    window.addEventListener('hashchange', () => {
        requestAnimationFrame(() => {
            alignToHash();
            updateActive();
        });
    });
    if (window.location.hash) {
        requestAnimationFrame(() => {
            alignToHash();
            updateActive();
        });
        setTimeout(() => {
            alignToHash();
            updateActive();
        }, 250);
    } else {
        updateActive();
    }
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
   SITE CHECKS
   ============================================ */
function initSiteChecks() {
    const tabs = [...document.querySelectorAll('[data-quality-tab]')];
    const panels = [...document.querySelectorAll('[data-quality-panel]')];
    const checkRun = document.getElementById('siteCheckRun');
    const checkScore = document.getElementById('siteCheckScore');
    const checkStatus = document.getElementById('siteCheckStatus');
    const checkList = document.getElementById('siteCheckList');
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

    const runSiteChecks = () => {
        if (!checkScore || !checkStatus || !checkList) return;

        const brokenImages = [...document.images]
            .filter(image => image.complete && image.naturalWidth === 0)
            .map(image => image.getAttribute('src') || image.alt || 'unknown image');
        const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
        const missingNavTargets = navLinks
            .map(link => link.getAttribute('href'))
            .filter((href, index, all) => href && all.indexOf(href) === index)
            .filter(href => !document.querySelector(href));
        const commandItems = document.querySelectorAll('.command-item').length;
        const caseLinks = document.querySelectorAll('.case-index-actions a[href^="projects/"]').length;
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
                label: 'Case links resolve',
                passed: caseLinks >= 3,
                detail: `${caseLinks} project case links available`
            },
            {
                label: 'Quick links coverage',
                passed: commandItems >= 9,
                detail: `${commandItems} quick actions available`
            },
            {
                label: 'Message builder ready',
                passed: Boolean(briefMessage?.value.length > 80 && briefCopy?.getAttribute('data-copy') === briefMessage.value),
                detail: briefMessage ? `${briefMessage.value.length} characters generated and wired to copy` : 'builder not found'
            },
            {
                label: 'Check tabs wired',
                passed: tabs.length === 4 && panels.length === 4 && Boolean(activeQualityPanel),
                detail: `${tabs.length} tabs / ${panels.length} panels, active: ${activeQualityPanel?.getAttribute('data-quality-panel') || 'none'}`
            }
        ];

        const passedCount = checks.filter(check => check.passed).length;
        checkScore.textContent = `${passedCount} / ${checks.length}`;
        checkStatus.textContent = passedCount === checks.length ? 'All checks pass in this viewport.' : 'Some checks need attention in this viewport.';
        checkStatus.classList.toggle('pass', passedCount === checks.length);
        checkStatus.classList.toggle('warn', passedCount !== checks.length);
        checkList.innerHTML = checks.map(check => `
            <article class="site-check-item ${check.passed ? 'pass' : 'fail'}">
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

    checkRun?.addEventListener('click', runSiteChecks);
    setQualityTab('mobile');
    setTimeout(runSiteChecks, 650);
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
            portfolio: 'I am especially interested in the portfolio system, case pages, and interaction polish.',
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
    if (copyButtons.length === 0) return;

    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const text = button.getAttribute('data-copy');
            if (!text) return;

            try {
                await copyToClipboard(text);
                const label = button.getAttribute('data-copy-label') || 'Email';
                showCopyToast(`${label} copied`);
            } catch (error) {
                const briefMessage = button.classList.contains('brief-copy-btn') ? document.getElementById('briefMessage') : null;
                if (briefMessage) {
                    briefMessage.focus();
                    briefMessage.select();
                    briefMessage.classList.add('is-selected');
                    setTimeout(() => briefMessage.classList.remove('is-selected'), 2200);
                    showCopyToast('Message selected - press Ctrl+C');
                    return;
                }
                showCopyToast('Copy blocked - use link');
            }
        });
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
                window.scrollTo({ top: targetPosition, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
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
    if (prefersReducedMotion()) {
        typingText.textContent = 'const developer = "Vladyslav";';
        return;
    }
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
        '.skill-map-panel',
        '.skill-map-card',
        '.project-card',
        '.project-ledger-panel',
        '.case-index-panel',
        '.site-checks-panel',
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

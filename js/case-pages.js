document.addEventListener('DOMContentLoaded', () => {
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const currentYear = document.getElementById('currentYear');

    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.setAttribute('aria-label', savedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
        themeToggle.addEventListener('click', () => {
            const nextTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', nextTheme);
            localStorage.setItem('theme', nextTheme);
            themeToggle.setAttribute('aria-label', nextTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
        });
    }

    if (currentYear) currentYear.textContent = new Date().getFullYear();
});

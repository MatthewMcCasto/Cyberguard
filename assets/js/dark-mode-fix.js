/**
 * CyberGuard - Dark Mode Fix
 * Ensures dark mode consistency across all pages
 */

// Execute immediately when the page opens
(function() {
    // Check dark mode state from local storage
    const isDarkMode = localStorage.getItem('dark-mode') === 'enabled' || 
                      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && 
                       localStorage.getItem('dark-mode') !== 'disabled');
    
    // Apply dark mode immediately if needed
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
})();

// When the DOM is loaded, initialize the toggle
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    if (!darkModeToggle) {
        console.warn('Dark mode toggle button not found on this page');
        return;
    }
    
    // Toggle dark mode
    darkModeToggle.addEventListener('click', function() {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('dark-mode', 'disabled');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('dark-mode', 'enabled');
        }
    });
    
    // Listen for system preference changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (localStorage.getItem('dark-mode') === null) {
                if (event.matches) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        });
    }
});

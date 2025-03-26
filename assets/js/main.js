/**
 * CyberGuard - Main JavaScript
 * Handles dark mode, mobile menu, and general UI functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Dark mode functionality
    initDarkMode();
    
    // Mobile menu functionality
    initMobileMenu();
});

/**
 * Initialize dark mode functionality
 */
function initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    if (!darkModeToggle) return;
    
    // Check user preference from local storage or system preference
    const isDarkMode = localStorage.getItem('dark-mode') === 'enabled' || 
                      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && 
                       localStorage.getItem('dark-mode') !== 'disabled');
    
    // Set initial dark mode state
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
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
}

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuButton || !mobileMenu) return;
    
    mobileMenuButton.addEventListener('click', function() {
        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
            // Animation: fade in and slide down
            mobileMenu.style.maxHeight = '0';
            mobileMenu.style.transition = 'max-height 0.3s ease-in-out';
            setTimeout(() => {
                mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
            }, 10);
        } else {
            // Animation: slide up and fade out
            mobileMenu.style.maxHeight = '0';
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
        }
    });
    
    // Close menu when clicking on a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.style.maxHeight = '0';
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
        });
    });
    
    // Close menu when resizing to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {  // 768px is the md breakpoint in Tailwind
            mobileMenu.classList.add('hidden');
        }
    });
}

// Initialize CSS for better dark mode transition
const style = document.createElement('style');
style.textContent = `
    html.dark { 
        color-scheme: dark;
    }
    html { 
        transition: background-color 0.3s ease, color 0.3s ease;
    }
`;
document.head.appendChild(style);

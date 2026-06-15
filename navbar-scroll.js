// Navbar scroll functionality
let lastScrollTop = 0;
const header = document.querySelector('header');
const scrollThreshold = 100; // Pixels to scroll before showing/hiding navbar

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class when scrolling down past threshold
    if (scrollTop > scrollThreshold) {
        header.classList.add('scrolled');
        
        // Hide navbar when scrolling down, show when scrolling up
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down - hide navbar
            header.classList.add('hidden');
        } else {
            // Scrolling up - show navbar
            header.classList.remove('hidden');
        }
    } else {
        // Remove classes when at top of page
        header.classList.remove('scrolled');
        header.classList.remove('hidden');
    }
    
    lastScrollTop = scrollTop;
});

// Also handle window resize
window.addEventListener('resize', function() {
    lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
}); 
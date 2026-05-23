(function () {
    const savedTheme = localStorage.getItem('theme');
    const hour = new Date().getHours();
    
    // Determine the theme
    let theme = 'dark'; // Default
    
    if (savedTheme) {
        theme = savedTheme;
    } else {
        // Automatic Theme based on Time (Light between 6 AM and 7 PM)
        if (hour >= 6 && hour < 19) {
            theme = 'light';
        } else {
            theme = 'dark';
        }
    }
    
    // Apply the theme immediately to the root element
    if (theme === 'light') {
        document.documentElement.classList.add('light');
    } else {
        document.documentElement.classList.remove('light');
    }
})();

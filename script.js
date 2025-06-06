// Menu functionality
const menuIcon = document.querySelector('.icon');
const menuOverlay = document.querySelector('.menu-overlay');
const closeMenu = document.querySelector('.close-menu');

menuIcon.addEventListener('click', () => {
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
});

closeMenu.addEventListener('click', () => {
    menuOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
});

// Close menu when clicking outside
menuOverlay.addEventListener('click', (e) => {
    if (e.target === menuOverlay) {
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Dark/Light mode toggle
const container = document.querySelector('.container');
const headerSection = document.querySelector('.header_section');
const icon2 = document.querySelector('.icon2');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    container.classList.add('dark-mode');
    document.body.classList.add('dark-mode');
    icon2.classList.remove('fa-moon');
    icon2.classList.add('fa-sun');
}

icon2.addEventListener('click', () => {
    // Toggle dark mode classes
    container.classList.toggle('dark-mode');
    document.body.classList.toggle('dark-mode');
    
    // Toggle between moon and sun icon
    if (container.classList.contains('dark-mode')) {
        icon2.classList.remove('fa-moon');
        icon2.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        icon2.classList.remove('fa-sun');
        icon2.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// Profile image hover effect
const profileImage = document.querySelector('.image_section img');
profileImage.addEventListener('mouseover', () => {
    profileImage.style.transform = 'scale(1.1)';
    profileImage.style.transition = 'transform 0.3s ease';
});

profileImage.addEventListener('mouseout', () => {
    profileImage.style.transform = 'scale(1)';
});

// Dynamic greeting based on time
const greeting = document.createElement('p');
greeting.className = 'greeting';
document.querySelector('.info_section').prepend(greeting);

function updateGreeting() {
    const hour = new Date().getHours();
    let message = '';
    
    if (hour < 12) message = 'Good Morning!';
    else if (hour < 18) message = 'Good Afternoon!';
    else message = 'Good Evening!';
    
    greeting.textContent = message;
}

updateGreeting();
setInterval(updateGreeting, 60000); // Update every minute

// Profile views counter
let views = 0;
const viewsCounter = document.createElement('p');
viewsCounter.className = 'views-counter';
viewsCounter.textContent = 'Profile Views: 0';
document.querySelector('.info_section').appendChild(viewsCounter);

// Simulate profile views
setInterval(() => {
    views += Math.floor(Math.random() * 3);
    viewsCounter.textContent = `Profile Views: ${views}`;
}, 5000); 
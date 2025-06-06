document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("darkModeToggle");
    const body = document.body;

    // Check for saved dark mode preference
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
        toggleButton.textContent = "☀️";
    }

    toggleButton.addEventListener("click", function () {
        body.classList.toggle("dark-mode");

        // Save user preference
        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
            toggleButton.textContent = "☀️";
        } else {
            localStorage.setItem("darkMode", "disabled");
            toggleButton.textContent = "🌙";
        }
    });
});
document.addEventListener("DOMContentLoaded", function() {
    const progressCircles = document.querySelectorAll(".progress-circle");
    progressCircles.forEach(circle => {
        let percent = circle.getAttribute("data-percent");
        circle.style.background = `conic-gradient(#FFD700 ${percent}%, rgba(255, 255, 255, 0.2) 0% 100%)`;
    });
});
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const time = now.toLocaleTimeString();
    const date = now.toLocaleDateString(undefined, options);
    dateTimeElement.textContent = `${date} | ${time}`;
}

// Update time every second
setInterval(updateDateTime, 1000);
updateDateTime();

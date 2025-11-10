/**
 * Initialize real-time clock in taskbar
 */
function initClock() {
	const clockElement = document.getElementById('taskbar-clock');

	function updateClock() {
		const now = new Date();
		const timeString = now.toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit'
		});
		clockElement.textContent = timeString;
	}

	// Update immediately and then every second
	updateClock();
	setInterval(updateClock, 1000);
}

/**
 * Toggle Start Menu visibility
 */
function toggleStartMenu() {
	let menu = document.getElementById("start-menu");

	// Toggle visibility
	if (menu.style.display === "block") {
		menu.style.display = "none";
	} else {
		menu.style.display = "block";
	}
}

/**
 * Close Start Menu when clicking outside
 */
document.addEventListener("click", function (event) {
	let menu = document.getElementById("start-menu");
	let startButton = document.querySelector(".start-button");

	if (!menu.contains(event.target) && !startButton.contains(event.target)) {
		menu.style.display = "none";
	}
});

/**
 * Reveal email address in start menu
 */
function revealEmail() {
	document.getElementById('email-address').style.display = 'inline';
}

/**
 * Initialize all UI components when DOM is ready
 */
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initClock);
} else {
	initClock();
}
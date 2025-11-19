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
 * Animate progress bar smoothly
 */
function animateProgressBar(progressBar, targetValue, duration) {
	const startValue = progressBar.value;
	const startTime = performance.now();

	function updateProgress(currentTime) {
		const elapsed = currentTime - startTime;
		const progress = Math.min(elapsed / duration, 1);

		// Easing function for smooth animation
		const easeOutQuad = progress * (2 - progress);

		progressBar.value = startValue + (targetValue - startValue) * easeOutQuad;

		if (progress < 1) {
			requestAnimationFrame(updateProgress);
		}
	}

	requestAnimationFrame(updateProgress);
}

/**
 * Handle contact form submission
 */
function handleContactSubmit(event) {
	event.preventDefault();

	const form = event.target;
	const submitButton = form.querySelector('button[type="submit"]');
	const statusDiv = document.getElementById('email-status');
	const statusText = document.getElementById('email-status-text');
	const mailSent = document.getElementById('mail-sent');
	const progressBar = document.getElementById('email-progress');

	// Show status area and progress bar
	statusDiv.style.display = 'block';
	progressBar.value = 0;

	// Disable button and show loading state
	submitButton.disabled = true;
	submitButton.textContent = 'Sending...';

	// Animate progress to 70% over 1 second while sending
	animateProgressBar(progressBar, 70, 1000);

	// Prepare template parameters
	const templateParams = {
		name: form.name.value,
		email: form.email.value,
		message: form.message.value
	};

	// Send email using EmailJS
	emailjs.send('service_065og74', 'template_9tbvtll', templateParams)
		.then(function(response) {
			console.log('Email sent successfully!', response.status, response.text);

			// Animate to 100% on success
			animateProgressBar(progressBar, 100, 500);

			// Clear form after a delay
			setTimeout(function() {
				form.reset();
				progressBar.value = 0;
				statusDiv.style.display = 'none';
				mailSent.style.zIndex = '1000';
				mailSent.style.display = 'block';
				statusText.textContent = `Thanks for reaching out, ${templateParams.name}! Your message has been sent. I'll get back to you soon.`;
			}, 2000);
		})
		.catch(function(error) {
			console.error('Failed to send email:', error);

			// Show error - animate back to 0
			animateProgressBar(progressBar, 0, 300);

			// Hide error after delay
			setTimeout(function() {
				statusDiv.style.display = 'none';
				mailSent.style.zIndex = '1000';
				mailSent.style.display = 'block';
				statusText.textContent = 'Sorry, there was an error sending your message. Please try again or email me directly at contact@femi.xyz';
			}, 3000);
		})
		.finally(function() {
			// Re-enable button
			submitButton.disabled = false;
			submitButton.textContent = 'Send';
		});
}

/**
 * Initialize all UI components when DOM is ready
 */
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initClock);
} else {
	initClock();
}
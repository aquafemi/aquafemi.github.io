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

const tabs = document.querySelectorAll("menu[role=tablist]");

for (let i = 0; i < tabs.length; i++) {
  const tab = tabs[i];

  const tabButtons = tab.querySelectorAll("menu[role=tablist] > button");

  tabButtons.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      tabButtons.forEach((button) => {
        if (
          button.getAttribute("aria-controls") ===
          e.target.getAttribute("aria-controls")
        ) {
          button.setAttribute("aria-selected", true);
          openTab(e, tab);
        } else {
          button.setAttribute("aria-selected", false);
        }
      });
    })
  );
}

function openTab(event, tab) {
  const articles = tab.parentNode.querySelectorAll('[role="tabpanel"]');
  articles.forEach((p) => {
    p.setAttribute("hidden", true);
  });
  const article = tab.parentNode.querySelector(
    `[role="tabpanel"]#${event.target.getAttribute("aria-controls")}`
  );
  article.removeAttribute("hidden");
}

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
 * Desktop icon selection (click) + touch dragging (mobile only)
 */
function initDesktopIconSelection() {
	const container = document.querySelector('.desktop-icons');
	if (!container) return;

	const icons = container.querySelectorAll('.desktop-icon');

	// Switch container to full-viewport block so absolute children work
	container.style.display = 'block';
	container.style.width = '100vw';
	container.style.height = '100vh';
	container.style.top = '0';
	container.style.left = '0';
	container.style.pointerEvents = 'none';

	// Position icons in a column on the left, computed mathematically
	const startX = 15;
	const startY = 15;
	const iconHeight = 80;
	const gap = 20;
	icons.forEach((icon, i) => {
		icon.style.position = 'absolute';
		icon.style.left = startX + 'px';
		icon.style.top = (startY + i * (iconHeight + gap)) + 'px';
		icon.style.margin = '0';
		icon.style.pointerEvents = 'auto';
	});

	// Desktop only: single click = select, double click = open, Enter = open selected
	if (!('ontouchstart' in window)) {
		// --- Rubber-band (lasso) selection ---
		const selectionBox = document.createElement('div');
		selectionBox.id = 'desktop-selection-box';
		document.body.appendChild(selectionBox);

		let dragSelecting = false;
		let dragStart = { x: 0, y: 0 };

		document.addEventListener('mousedown', (e) => {
			// Only start drag-select on the desktop background (not on icons/windows/taskbar)
			if (e.button !== 0) return;
			if (e.target.closest('.desktop-icon') || e.target.closest('.window') || e.target.closest('.footer')) return;

			dragSelecting = true;
			dragStart = { x: e.clientX, y: e.clientY };

			selectionBox.style.left   = e.clientX + 'px';
			selectionBox.style.top    = e.clientY + 'px';
			selectionBox.style.width  = '0px';
			selectionBox.style.height = '0px';
			selectionBox.style.display = 'block';

			if (!e.shiftKey) icons.forEach(i => i.classList.remove('selected'));
		});

		document.addEventListener('mousemove', (e) => {
			if (!dragSelecting) return;

			const x = Math.min(e.clientX, dragStart.x);
			const y = Math.min(e.clientY, dragStart.y);
			const w = Math.abs(e.clientX - dragStart.x);
			const h = Math.abs(e.clientY - dragStart.y);

			selectionBox.style.left   = x + 'px';
			selectionBox.style.top    = y + 'px';
			selectionBox.style.width  = w + 'px';
			selectionBox.style.height = h + 'px';

			// Hit-test each icon against the selection rect
			const selRect = { x, y, right: x + w, bottom: y + h };
			icons.forEach(icon => {
				const r = icon.getBoundingClientRect();
				const overlaps = r.left < selRect.right && r.right > selRect.x &&
				                 r.top  < selRect.bottom && r.bottom > selRect.y;
				icon.classList.toggle('selected', overlaps);
			});
		});

		document.addEventListener('mouseup', () => {
			if (!dragSelecting) return;
			dragSelecting = false;
			selectionBox.style.display = 'none';
		});

		// --- Icon click / double-click ---
		icons.forEach(icon => {
			// Single click: select (shift = add to selection)
			icon.addEventListener('click', (e) => {
				if (!e.shiftKey) icons.forEach(i => i.classList.remove('selected'));
				icon.classList.add('selected');
			});

			// Double click: open
			icon.addEventListener('dblclick', () => {
				const windowId = icon.dataset.window;
				if (windowId) windowManager.openWindow(windowId);
			});
		});

		// Enter key: open all selected icons
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				container.querySelectorAll('.desktop-icon.selected').forEach(icon => {
					const windowId = icon.dataset.window;
					if (windowId) windowManager.openWindow(windowId);
				});
			}
		});

		// Deselect when clicking desktop background
		document.addEventListener('click', (e) => {
			if (!e.target.closest('.desktop-icon') && !e.target.closest('.window')) {
				icons.forEach(i => i.classList.remove('selected'));
			}
		});
	}

	// Touch dragging (mobile only)
	icons.forEach(icon => {
		let touchOffset = { x: 0, y: 0 };
		let touchStart = { x: 0, y: 0 };
		let touchDragging = false;

		icon.addEventListener('touchstart', (e) => {
			e.stopPropagation();
			const t = e.touches[0];
			touchStart = { x: t.clientX, y: t.clientY };
			const rect = icon.getBoundingClientRect();
			touchOffset = { x: t.clientX - rect.left, y: t.clientY - rect.top };
			touchDragging = false;
			icons.forEach(i => i.classList.remove('selected'));
			icon.classList.add('selected');
		}, { passive: true });

		icon.addEventListener('touchmove', (e) => {
			const t = e.touches[0];
			const dx = t.clientX - touchStart.x;
			const dy = t.clientY - touchStart.y;
			if (!touchDragging && Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
			touchDragging = true;
			icon.style.zIndex = 50;
			const parent = icon.parentElement.getBoundingClientRect();
			let x = t.clientX - touchOffset.x - parent.left;
			let y = t.clientY - touchOffset.y - parent.top;
			x = Math.max(0, Math.min(x, window.innerWidth - icon.offsetWidth));
			y = Math.max(0, Math.min(y, window.innerHeight - icon.offsetHeight - 30));
			icon.style.left = x + 'px';
			icon.style.top = y + 'px';
			e.preventDefault();
		}, { passive: false });

		icon.addEventListener('touchend', () => {
			icon.style.zIndex = '';
			if (!touchDragging) {
				// Single tap on mobile = open window
				const windowId = icon.dataset.window;
				if (windowId) windowManager.openWindow(windowId);
			}
			touchDragging = false;
		});
	});
}

/**
 * Initialize all UI components when DOM is ready
 */
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => {
		initClock();
		initDesktopIconSelection();
	});
} else {
	initClock();
	initDesktopIconSelection();
}
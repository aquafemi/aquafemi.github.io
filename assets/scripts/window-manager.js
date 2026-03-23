/**
 * WindowManager - Centralized window management system
 * Handles dragging, z-index, minimize/maximize/close, and state tracking
 */
class WindowManager {
	constructor() {
		this.windows = {}; // Store window state: { windowId: { element, position, state, zIndex, etc } }
		this.highestZIndex = 100; // Start z-index counter
		this.isDragging = false;
		this.currentDragWindow = null;
		this.dragOffset = { x: 0, y: 0 };

		// Resizing state
		this.isResizing = false;
		this.currentResizeWindow = null;
		this.resizeDirection = null;
		this.resizeStartPos = { x: 0, y: 0 };
		this.resizeStartSize = { width: 0, height: 0 };
		this.resizeStartWindowPos = { x: 0, y: 0 };

		this.pendingDragTouch = null; // Touch drag starts lazily on first move

		// Bind methods to maintain context
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		this.handleTouchMove = this.handleTouchMove.bind(this);
		this.handleTouchEnd = this.handleTouchEnd.bind(this);

		this.init();
	}

	/**
	 * Returns true if the viewport is mobile-sized (≤768px)
	 */
	isMobile() {
		return window.innerWidth <= 768;
	}

	/**
	 * Initialize the window manager
	 */
	init() {
		// Register all existing windows in the DOM
		document.querySelectorAll('.window').forEach(windowEl => {
			const windowId = windowEl.id;
			if (windowId) {
				this.registerWindow(windowId, windowEl);
			}
		});

		// Update taskbar to hide items for closed windows
		this.updateTaskbar();

		// Global touch listeners for lazy drag (attached once, always active)
		document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
		document.addEventListener('touchend', this.handleTouchEnd);

		// Open "About Me" window by default
		setTimeout(() => {
			this.openWindow('aboutme');
		}, 100);
	}

	/**
	 * Register a window with the manager
	 */
	registerWindow(windowId, windowElement) {
		// Define different initial positions for each window to avoid overlap
		const positionMap = {
			'cmu': { x: 50, y: 50 },
			'microsoft': { x: 100, y: 100 },
			'stripe': { x: 150, y: 150 },
			'discord': { x: 200, y: 200 },
			'aboutme': { x: 250, y: 100 },
			'mail': { x: 300, y: 150 },
			'mail-sent': { x: 300, y: 150 }
		};

		// Set initial position if not already positioned
		const computedStyle = window.getComputedStyle(windowElement);
		const defaultPosition = positionMap[windowId] || { x: 100, y: 100 };
		let initialX = computedStyle.left === 'auto' ? defaultPosition.x : parseInt(computedStyle.left);
		let initialY = computedStyle.top === 'auto' ? defaultPosition.y : parseInt(computedStyle.top);

		// On mobile, center the window (let content determine size)
		if (this.isMobile()) {
			initialX = 10;
			initialY = 20;
		}

		this.windows[windowId] = {
			element: windowElement,
			position: { x: initialX, y: initialY },
			previousPosition: null, // Store position before maximizing
			state: {
				isOpen: false,
				isMinimized: false,
				isMaximized: false
			},
			zIndex: this.highestZIndex++
		};

		// Set initial styles
		windowElement.style.position = 'absolute';
		windowElement.style.left = initialX + 'px';
		windowElement.style.top = initialY + 'px';
		windowElement.style.zIndex = this.windows[windowId].zIndex;

		// Add resize handles
		this.addResizeHandles(windowElement);

		// Attach event listeners
		this.attachWindowListeners(windowId);
	}

	/**
	 * Add resize handles to window
	 */
	addResizeHandles(windowElement) {
		const directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];

		directions.forEach(direction => {
			const handle = document.createElement('div');
			handle.className = `resize-handle resize-${direction}`;
			handle.dataset.direction = direction;
			windowElement.appendChild(handle);

			handle.addEventListener('mousedown', (e) => {
				e.stopPropagation();
				this.startResize(windowElement.id, direction, e);
			});

				// No touch resize — conflicts with drag on mobile
		});
	}

	/**
	 * Attach event listeners to a window
	 */
	attachWindowListeners(windowId) {
		const windowData = this.windows[windowId];
		const windowEl = windowData.element;

		// Click anywhere on window to bring to front
		windowEl.addEventListener('mousedown', (e) => {
			this.bringToFront(windowId);
		});

		// Drag from title bar
		const titleBar = windowEl.querySelector('.title-bar');
		if (titleBar) {
			titleBar.addEventListener('mousedown', (e) => {
				// Don't drag if clicking on buttons
				if (e.target.closest('.title-bar-controls button')) {
					return;
				}
				this.startDrag(windowId, e);
			});

				// Touch drag from title bar — use passive touchstart so button taps aren't blocked
			titleBar.addEventListener('touchstart', (e) => {
				if (e.target.closest('.title-bar-controls button')) {
					return;
				}
				this.pendingDragTouch = { windowId, touch: e.touches[0] };
			}, { passive: true });

			// Double-click title bar to maximize/restore
			titleBar.addEventListener('dblclick', (e) => {
				if (e.target.closest('.title-bar-controls button')) {
					return;
				}
				this.toggleMaximize(windowId);
			});

			// Prevent text selection during drag
			titleBar.style.userSelect = 'none';
			titleBar.style.cursor = 'move';
		}

		// Attach button listeners
		this.attachButtonListeners(windowId);
	}

	/**
	 * Attach listeners to window control buttons
	 */
	attachButtonListeners(windowId) {
		const windowEl = this.windows[windowId].element;

		// Close button (X)
		const closeBtn = windowEl.querySelector('.title-bar-controls button:last-child');
		if (closeBtn) {
			closeBtn.addEventListener('click', (e) => {
				e.stopPropagation();
				this.closeWindow(windowId);
			});
		}

		// Maximize button (middle button)
		const maximizeBtn = windowEl.querySelector('.title-bar-controls button:nth-child(2)');
		if (maximizeBtn) {
			maximizeBtn.addEventListener('click', (e) => {
				e.stopPropagation();
				this.toggleMaximize(windowId);
			});
		}

		// Minimize button (first button)
		const minimizeBtn = windowEl.querySelector('.title-bar-controls button:first-child');
		if (minimizeBtn) {
			minimizeBtn.addEventListener('click', (e) => {
				e.stopPropagation();
				this.minimizeWindow(windowId);
			});
		}
	}

	/**
	 * Start dragging a window
	 */
	startDrag(windowId, event) {
		const windowData = this.windows[windowId];

		// Can't drag maximized windows
		if (windowData.state.isMaximized) {
			return;
		}

		this.isDragging = true;
		this.currentDragWindow = windowId;

		// Calculate offset between mouse and window top-left
		const rect = windowData.element.getBoundingClientRect();
		this.dragOffset = {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};

		// Add dragging class to disable transitions for instant feedback
		windowData.element.classList.add('dragging');

		// Bring to front when starting drag
		this.bringToFront(windowId);

		// Add global mouse listeners
		document.addEventListener('mousemove', this.handleMouseMove);
		document.addEventListener('mouseup', this.handleMouseUp);

		// Prevent text selection
		event.preventDefault();
	}

	/**
	 * Handle touch move — lazily commit drag on first significant movement
	 */
	handleTouchMove(event) {
		const touch = event.touches[0];

		// Lazily start drag once movement crosses threshold (avoids blocking taps)
		if (this.pendingDragTouch) {
			const dx = touch.clientX - this.pendingDragTouch.touch.clientX;
			const dy = touch.clientY - this.pendingDragTouch.touch.clientY;
			if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
				const { windowId } = this.pendingDragTouch;
				const windowData = this.windows[windowId];
				this.pendingDragTouch = null;
				if (!windowData.state.isMaximized) {
					this.isDragging = true;
					this.currentDragWindow = windowId;
					const rect = windowData.element.getBoundingClientRect();
					this.dragOffset = {
						x: touch.clientX - rect.left,
						y: touch.clientY - rect.top
					};
					windowData.element.classList.add('dragging');
					this.bringToFront(windowId);
				}
			}
		}

		const syntheticEvent = { clientX: touch.clientX, clientY: touch.clientY };
		if (this.isDragging && this.currentDragWindow) {
			this.handleDragMove(syntheticEvent);
			event.preventDefault();
		}
	}

	/**
	 * Handle touch end — stop drag
	 */
	handleTouchEnd() {
		this.pendingDragTouch = null;
		if (this.isDragging) {
			if (this.currentDragWindow && this.windows[this.currentDragWindow]) {
				this.windows[this.currentDragWindow].element.classList.remove('dragging');
			}
			this.isDragging = false;
			this.currentDragWindow = null;
		}
	}

	/**
	 * Handle mouse move during drag or resize
	 */
	handleMouseMove(event) {
		if (this.isDragging && this.currentDragWindow) {
			this.handleDragMove(event);
		} else if (this.isResizing && this.currentResizeWindow) {
			this.handleResizeMove(event);
		}
	}

	/**
	 * Handle mouse move during drag
	 */
	handleDragMove(event) {
		const windowData = this.windows[this.currentDragWindow];

		// Calculate new position
		let newX = event.clientX - this.dragOffset.x;
		let newY = event.clientY - this.dragOffset.y;

		// Get window dimensions
		const rect = windowData.element.getBoundingClientRect();
		const windowWidth = rect.width;
		const windowHeight = rect.height;

		// Get viewport dimensions
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		const taskbarHeight = 30; // Height of taskbar at bottom

		// Boundary checking - keep window in viewport
		newX = Math.max(0, Math.min(newX, viewportWidth - windowWidth));
		newY = Math.max(0, Math.min(newY, viewportHeight - windowHeight - taskbarHeight));

		// Update position
		windowData.position = { x: newX, y: newY };
		windowData.element.style.left = newX + 'px';
		windowData.element.style.top = newY + 'px';
	}

	/**
	 * Handle mouse move during resize
	 */
	handleResizeMove(event) {
		const windowData = this.windows[this.currentResizeWindow];
		const direction = this.resizeDirection;

		const deltaX = event.clientX - this.resizeStartPos.x;
		const deltaY = event.clientY - this.resizeStartPos.y;

		let newWidth = this.resizeStartSize.width;
		let newHeight = this.resizeStartSize.height;
		let newX = this.resizeStartWindowPos.x;
		let newY = this.resizeStartWindowPos.y;

		const minWidth = 200;
		const minHeight = 150;

		// Handle horizontal resizing
		if (direction.includes('e')) {
			newWidth = Math.max(minWidth, this.resizeStartSize.width + deltaX);
		} else if (direction.includes('w')) {
			const potentialWidth = this.resizeStartSize.width - deltaX;
			if (potentialWidth >= minWidth) {
				newWidth = potentialWidth;
				newX = this.resizeStartWindowPos.x + deltaX;
			}
		}

		// Handle vertical resizing
		if (direction.includes('s')) {
			newHeight = Math.max(minHeight, this.resizeStartSize.height + deltaY);
		} else if (direction.includes('n')) {
			const potentialHeight = this.resizeStartSize.height - deltaY;
			if (potentialHeight >= minHeight) {
				newHeight = potentialHeight;
				newY = this.resizeStartWindowPos.y + deltaY;
			}
		}

		// Apply new size and position
		windowData.element.style.width = newWidth + 'px';
		windowData.element.style.height = newHeight + 'px';
		windowData.element.style.left = newX + 'px';
		windowData.element.style.top = newY + 'px';
	}

	/**
	 * Handle mouse up - stop dragging and resizing
	 */
	handleMouseUp(event) {
		if (this.isDragging) {
			// Remove dragging class to re-enable transitions
			if (this.currentDragWindow && this.windows[this.currentDragWindow]) {
				this.windows[this.currentDragWindow].element.classList.remove('dragging');
			}

			this.isDragging = false;
			this.currentDragWindow = null;

			// Remove global listeners
			document.removeEventListener('mousemove', this.handleMouseMove);
			document.removeEventListener('mouseup', this.handleMouseUp);
		}

		if (this.isResizing) {
			this.isResizing = false;
			this.currentResizeWindow = null;
			this.resizeDirection = null;

			// Remove global listeners
			document.removeEventListener('mousemove', this.handleMouseMove);
			document.removeEventListener('mouseup', this.handleMouseUp);
		}
	}

	/**
	 * Start resizing a window
	 */
	startResize(windowId, direction, event) {
		const windowData = this.windows[windowId];
		if (!windowData) return;

		this.isResizing = true;
		this.currentResizeWindow = windowId;
		this.resizeDirection = direction;
		this.resizeStartPos = { x: event.clientX, y: event.clientY };

		const rect = windowData.element.getBoundingClientRect();
		this.resizeStartSize = { width: rect.width, height: rect.height };
		this.resizeStartWindowPos = { x: rect.left, y: rect.top };

		// Add global mouse listeners
		document.addEventListener('mousemove', this.handleMouseMove);
		document.addEventListener('mouseup', this.handleMouseUp);

		event.preventDefault();
	}

	/**
	 * Bring window to front (highest z-index)
	 */
	bringToFront(windowId) {
		const windowData = this.windows[windowId];
		if (!windowData) return;

		// Increment z-index counter
		this.highestZIndex++;
		windowData.zIndex = this.highestZIndex;
		windowData.element.style.zIndex = this.highestZIndex;

		// Update taskbar to show as active
		this.updateTaskbar();
	}

	/**
	 * Toggle maximize/restore
	 */
	toggleMaximize(windowId) {
		const windowData = this.windows[windowId];
		if (!windowData) return;

		if (windowData.state.isMaximized) {
			// Restore to previous position
			this.restoreWindow(windowId);
		} else {
			// Maximize
			this.maximizeWindow(windowId);
		}
	}

	/**
	 * Maximize window to fill viewport
	 */
	maximizeWindow(windowId) {
		const windowData = this.windows[windowId];
		if (!windowData) return;

		// Save current position before maximizing
		windowData.previousPosition = { ...windowData.position };

		// Set to maximized state
		windowData.state.isMaximized = true;

		// Set dimensions and position
		const taskbarHeight = 30;
		windowData.element.style.left = '0px';
		windowData.element.style.top = '0px';
		windowData.element.style.width = '100vw';
		windowData.element.style.height = `calc(100vh - ${taskbarHeight}px)`;

		// Add maximized class for styling
		windowData.element.classList.add('maximized');

		this.updateTaskbar();
	}

	/**
	 * Restore window to previous position
	 */
	restoreWindow(windowId) {
		const windowData = this.windows[windowId];
		if (!windowData) return;

		// Restore from minimized
		if (windowData.state.isMinimized) {
			windowData.state.isMinimized = false;
			windowData.element.classList.add('open');
			this.bringToFront(windowId);
		}

		// Restore from maximized
		if (windowData.state.isMaximized) {
			windowData.state.isMaximized = false;
			windowData.element.classList.remove('maximized');

			// Restore previous position and size
			if (windowData.previousPosition) {
				windowData.position = { ...windowData.previousPosition };
				windowData.element.style.left = windowData.position.x + 'px';
				windowData.element.style.top = windowData.position.y + 'px';
			}

			// Reset dimensions
			windowData.element.style.width = '';
			windowData.element.style.height = '';
		}

		this.updateTaskbar();
	}

	/**
	 * Minimize window
	 */
	minimizeWindow(windowId) {
		const windowData = this.windows[windowId];
		if (!windowData) return;

		windowData.state.isMinimized = true;
		windowData.element.classList.remove('open');

		this.updateTaskbar();
	}

	/**
	 * Close window
	 */
	closeWindow(windowId) {
		const windowData = this.windows[windowId];
		if (!windowData) return;

		windowData.state.isOpen = false;
		windowData.element.classList.remove('open');

		this.updateTaskbar();
	}

	/**
	 * Open window (used by taskbar clicks and desktop icons)
	 */
	openWindow(windowId) {
		const windowData = this.windows[windowId];
		if (!windowData) return;

		// If minimized, restore
		if (windowData.state.isMinimized) {
			this.restoreWindow(windowId);
			return;
		}

		// If closed, reopen
		if (!windowData.state.isOpen) {
			windowData.state.isOpen = true;
			windowData.element.classList.add('open');
			// Pop-in animation
			windowData.element.classList.add('opening');
			setTimeout(() => windowData.element.classList.remove('opening'), 120);
		}

		// Bring to front
		this.bringToFront(windowId);

		this.updateTaskbar();
	}

	/**
	 * Toggle window (used by taskbar clicks)
	 */
	toggleWindow(windowId) {
		const windowData = this.windows[windowId];
		if (!windowData) return;

		// If minimized or closed, open it
		if (windowData.state.isMinimized || !windowData.state.isOpen) {
			this.openWindow(windowId);
		} else {
			// If it's the active window (highest z-index), minimize it
			const isActive = this.getActiveWindowId() === windowId;
			if (isActive) {
				this.minimizeWindow(windowId);
			} else {
				// Otherwise just bring to front
				this.bringToFront(windowId);
			}
		}
	}

	/**
	 * Get the currently active (topmost) window
	 */
	getActiveWindowId() {
		let activeId = null;
		let highestZ = -1;

		for (const [windowId, data] of Object.entries(this.windows)) {
			if (data.state.isOpen && !data.state.isMinimized && data.zIndex > highestZ) {
				highestZ = data.zIndex;
				activeId = windowId;
			}
		}

		return activeId;
	}

	/**
	 * Update taskbar to reflect window states
	 */
	updateTaskbar() {
		const activeWindowId = this.getActiveWindowId();

		// Update all taskbar items
		document.querySelectorAll('.taskbar-item').forEach(item => {
			const windowId = item.getAttribute('data-window-id');
			const windowData = this.windows[windowId];

			if (!windowData) return;

			// Add/remove active class
			if (windowId === activeWindowId) {
				item.classList.add('active');
			} else {
				item.classList.remove('active');
			}

			// Add/remove minimized class
			if (windowData.state.isMinimized) {
				item.classList.add('minimized');
			} else {
				item.classList.remove('minimized');
			}

			// Hide if closed
			if (!windowData.state.isOpen) {
				item.style.display = 'none';
			} else {
				item.style.display = '';
			}
		});
	}
}

// Initialize window manager when DOM is ready
let windowManager;

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => {
		windowManager = new WindowManager();
	});
} else {
	windowManager = new WindowManager();
}

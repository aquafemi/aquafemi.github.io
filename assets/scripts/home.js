function toggleStartMenu() {
	let menu = document.getElementById("start-menu");

	// Toggle visibility
	if (menu.style.display === "block") {
		menu.style.display = "none";
	} else {
		menu.style.display = "block";
	}
}

// Close Start Menu when clicking outside
document.addEventListener("click", function (event) {
	let menu = document.getElementById("start-menu");
	let startButton = document.querySelector(".start-button");

	if (!menu.contains(event.target) && !startButton.contains(event.target)) {
		menu.style.display = "none";
	}
});

function openAgency(elementId) {
	const element = document.getElementById(elementId);
	if (element) {
		// Toggle between 'none' and 'block'
		element.style.display = element.style.display === "none" || element.style.display === "" ? "block" : "none";
	} else {
		console.error(`Element with ID "${elementId}" not found.`);
	}
}

function revealEmail() {
	document.getElementById('email-address').style.display = 'inline';
}
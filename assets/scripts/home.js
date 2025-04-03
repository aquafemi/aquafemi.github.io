

document.querySelector(".maximize-dialog").addEventListener("click", function () {
	// open the dialog
	console.log("Dialog maximized");
});

document.querySelector(".minimize-dialog").addEventListener("click", function () {
	// open the dialog
	console.log("Dialog minimized");
});

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

function openProject(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        // Toggle between 'none' and 'block'
        element.style.display = element.style.display === "none" ? "block" : "none";
    } else {
        console.error(`Element with ID "${elementId}" not found.`);
    }
}
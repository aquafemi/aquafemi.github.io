var sr = ScrollReveal({
	origin: "bottom",
	distance: "64px",
	duration: 800,
	delay: 0,
	scale: 1
});

sr.reveal('.projects-list a');
sr.reveal('.posts-list a');

document.querySelector('open-dialog').addEventListener("click", function() {
	document.querySelector('.window.bg-modal').style.display = "flex";
	console.log("opening")
});

document.querySelector('.close-dialog').addEventListener("click", function() {
	document.querySelector('.window.bg-modal').style.display = "none";
	console.log("closing")
});
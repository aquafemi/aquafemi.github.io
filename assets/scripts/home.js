var sr = ScrollReveal({
	origin: "bottom",
	distance: "64px",
	duration: 800,
	delay: 0,
	scale: 1
});

sr.reveal('.projects-list a');
sr.reveal('.posts-list a');

document.getElementById('.open-dialog').addEventListener("click", function() {
	document.querySelector('.bg-modal').style.display = "flex";
});

document.querySelector('.close-dialog').addEventListener("click", function() {
	document.querySelector('.bg-modal').style.display = "none";
});
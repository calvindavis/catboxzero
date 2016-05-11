const tag = document.getElementById("tag");
const rating = document.getElementById("rating");
const status = document.getElementById("status");
const form = document.querySelector("form");

// Saves options to chrome.storage.sync.
function save_options(event) {
	event.preventDefault();

	chrome.storage.sync.set({
		tag: tag.value,
		rating: rating.value
	}, () => {
		// Update status to let user know options were saved.
		status.textContent = "Options saved.";
		setTimeout(() => {
			status.textContent = "";
		}, 1250);
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	// Use default value color = 'red' and likesColor = true.
	chrome.storage.sync.get({
		tag: "cat",
		rating: "g"
	}, (items) => {
		tag.value = items.tag;
		rating.value = items.rating;
 	});
}

document.addEventListener("DOMContentLoaded", restore_options);
form.addEventListener("submit", save_options);

const tag = document.querySelector("#tag");
const rating = document.querySelector("#rating");
const status = document.querySelector("#status");
const save = document.querySelector("#save");

// Saves options to chrome.storage.sync.
function save_options() {
	chrome.storage.sync.set({
		tag: tag.value,
		rating: rating.value
	}, function() {
		// Update status to let user know options were saved.
		status.textContent = 'Options saved.';
		setTimeout(function() {
			status.textContent = '';
		}, 750);
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	// Use default value color = 'red' and likesColor = true.
	chrome.storage.sync.get({
		tag: 'cat',
		rating: "r"
	}, function(items) {
		tag.value = items.tag;
		rating.value = items.rating;
 	});
}

document.addEventListener('DOMContentLoaded', restore_options);
save.addEventListener('click', save_options);
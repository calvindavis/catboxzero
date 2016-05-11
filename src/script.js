const img = document.createElement("img");
img.style.width = "auto";
img.style.maxHeight = "300px";
img.style.marginTop = "1em";
let element = null;

/**
 * @param {string} tag
 * @returns {Promise}
 */
const getRandomGifUrl = (tag, rating) => {
	const url = `https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${tag}&rating=${rating}"`;
	return new Promise((resolve, reject) => {
		fetch(url).then((response) => {
			response.json().then((data) => {
				resolve(data.data.image_url);
			});
		});
	});
};

/**
 * @returns {Promise}
 */
const getOptions = () => {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get(["tag", "rating"], (options) => {
			resolve(options);
		});
	});
};

/**
 * @param {HTMLElement} el
 * @param {string} tag
 */
const appendRandomGif = (el) => {
	getOptions().then((options) => {
		getRandomGifUrl(options.tag, options.rating).then((url) => {
			img.src = url;
			el.appendChild(document.createElement("br"));
			el.appendChild(img);
		});
	});
};

const observer = new MutationObserver(function (mutations) {
	const el = document.querySelector(".TC");

	if (el !== null) {
		if (element === null) {
			element = el;
			appendRandomGif(element);
		}
	} else {
		element = null;
	}
});

observer.observe(document.documentElement, {
	childList: true,
	subtree: true
});
let elements = new Map();

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
 * @returns {Promise}
 */
const createRandomGif = () => {
	return new Promise((resolve, reject) => {
		getOptions().then((options) => {
			getRandomGifUrl(options.tag, options.rating).then((url) => {
				const img = createImageElement(url);
				resolve(img);
			});
		});
	});
};

/**
 * @param {string} src
 * @returns {HTMLImageElement}
 */
const createImageElement = (src) => {
	const img = document.createElement("img");
	img.src = src;
	img.style.width = "auto";
	img.style.maxHeight = "300px";
	img.style.marginTop = "1em";
	return img;
};

const observer = new MutationObserver(function (mutations) {
	const els = Array.prototype.slice.call(document.querySelectorAll(".TC"));

	els.forEach((el) => {
		if (elements.has(el)) {
			// TODO Update image everytime el is hidden and then reappears.
		} else {
			// Setting a value here to prevent this being fired multiple times.
			elements.set(el, null);

			createRandomGif().then((img) => {
				el.appendChild(document.createElement("br"));
				el.appendChild(img);
				elements.set(el, img);
			});
		}
	});
});

observer.observe(document.documentElement, {
	childList: true,
	subtree: true
});
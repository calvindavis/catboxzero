let gifs = new Map();

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
 * @param {String} url
 * @returns {HTMLImageElement}
 */
const createImage = (url) => {
	let img = document.createElement("img");

	img.src = url;
	img.style.width = "auto";
	img.style.maxHeight = "300px";
	img.style.marginTop = "1em";

	return img;
};

/**
 * @param {HTMLElement} element
 * @returns {Promise<HTMLImageElement>}
 */
const createImageFromGiphy = (element) => {
	return getOptions().then((options) => {
		return getRandomGifUrl(options.tag, options.rating).then((url) => {
			return createImage(url);
		});
	});
};

/**
 * @param {HTMLElement} element
 * @returns {Promise<HTMLImageElement>}
 */
const appendRandomGif = (element) => {
	if(gifs.has(element)) {
		const gif = gifs.get(element);

		if(gif && gif.promise) {
			Promise.reject(gif.promise);

			delete gif.promise;
		}
	}

	return createImageFromGiphy(element).then((image) => {
		let span = document.createElement("span");
		span.dataset["giffy"] = "true";

		span.appendChild(document.createElement("br"));
		span.appendChild(image);

		element.appendChild(span);

		return image;
	});
};

const observer = new MutationObserver((mutations) => {
	const elements = Array.prototype.slice.call(document.querySelectorAll(".TC"));

	elements.forEach((element) => {
		if(element.offsetParent === null) {
			const image = element.querySelector("[data-giffy]");

			if(image && gifs.has(element)) {
				image.remove();

				gifs.delete(element);
			}
		}

		if(!gifs.has(element)) {
			const promise = appendRandomGif(element);

			gifs.set(element, { promise });

			promise.then((image) => {
				gifs.set(element, { image });
			});
		}
	});
});

observer.observe(document.documentElement, {
	childList: true,
	subtree: true
});

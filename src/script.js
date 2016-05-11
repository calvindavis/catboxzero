let gifs = new Map();

/**
 * @param {string} tag
 * @param {string} rating
 * @returns {Promise.<Object>}
 */
const getRandomGifData = (tag, rating) => {
	const url = `https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${tag}&rating=${rating}"`;
	return new Promise((resolve, reject) => {
		fetch(url).then((response) => {
			response.json().then((data) => {
				resolve(data.data);
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
 * @param {Object} data
 * @returns {HTMLVideoElement}
 */
const createVideo = (data) => {
	const video = document.createElement("video");

	video.src = data.image_mp4_url;
	video.poster = data.fixed_height_small_still_url;
	video.autoplay = true;
	video.loop = true;
	video.style.width = "auto";
	video.style.height = "200px";
	video.style.marginTop = "1em";

	return video;
};

/**
 * @param {HTMLElement} element
 * @returns {Promise.<HTMLVideoElement>}
 */
const createVideoFromGiphy = (element) => {
	return getOptions().then((options) => {
		return getRandomGifData(options.tag, options.rating).then((data) => {
			return createVideo(data);
		});
	});
};

/**
 * @param {HTMLElement} element
 * @returns {Promise.<HTMLVideoElement>}
 */
const appendRandomGif = (element) => {
	return createVideoFromGiphy(element).then((image) => {
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
		if (element.offsetParent === null) {
			const image = element.querySelector("[data-giffy]");

			if (image && gifs.has(element)) {
				image.remove();

				gifs.delete(element);
			}
		}

		if (!gifs.has(element)) {
			gifs.set(element, null);
			appendRandomGif(element).then((image) => {
				gifs.set(element, { image });
			});
		}
	});
});

observer.observe(document.documentElement, {
	childList: true,
	subtree: true
});

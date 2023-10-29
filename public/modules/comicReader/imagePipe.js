export default class ImagePipe {
	constructor(dataStatus) {
		this.dataStatus = dataStatus;
		this.pages = dataStatus.getMediaPages();
	}

	getCurrentImage = (currentIndex) => {
		const pages = this.pages;
		currentIndex -= 1;
		return pages[currentIndex];
	}

	getPrevImage(currentIndex) {
		const previousIndex = currentIndex === 1 ? 1 : currentIndex - 1;
		return this.getCurrentImage(previousIndex);
	}

	getNextImage(currentIndex) {
		const totalImages = this.pages.length;
		const nextIndex = currentIndex === totalImages ? totalImages : currentIndex + 1;
		return this.getCurrentImage(nextIndex);
	}

	loadImageLog(url, msg, type, timer) {
		if (timer) timer = new Date() - timer;
		const typeEnum = {
			timeout: 'timeout',
			faild: 'faild',
			success: 'success',
			cached: 'cached',
		};
		return { url, msg: msg.toString(), type: typeEnum[type], timer };
	}

	preloadImage = (url) => {
		const { loadImageLog } = this
		return new Promise(function (resolve, reject) {
			const image = new Image();
			const now = new Date();
			image.onload = function(){
				resolve(loadImageLog(url, 'image load success', 'success', now));
			};
			image.onerror = function(){
				reject(loadImageLog(url, 'image load faild', 'faild', now));
			};
			setTimeout(() => {
				reject(loadImageLog(url, 'Request timed out ', 'timeout', now));
			}, 10000);
			image.src = url;
		});
	}

	cacheImages = (index, totalImages, preloadNum) => {
		const { getCurrentImage, preloadImage } = this;
		const needImagesNum = index + preloadNum >= totalImages ? totalImages : index + preloadNum;
		for (let i = index; i <= needImagesNum; i++) {
			const currentUrl = getCurrentImage(i).url;
			if (currentUrl) {
				preloadImage(currentUrl).then(() => {
				// console.log(data);
				}).catch((err) => {
					console.log(err);
				});
			}
		}
	}

	displayImage = (url, index) => {
		const img = $('.pic-box').find('img');
		const image = new Image();
		image.src = url;
		img.attr('src', 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==')
			.attr('data-index', index);
		if (image.complete) {
			img.attr('data-srcset', url);
			img.attr('srcset', url);
		} else {
			img.attr('class', 'lazyload').attr('data-srcset', url);
		}
	}

	loadingImage = (index) => {

	}

}

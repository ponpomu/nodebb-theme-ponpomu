'use strict';

define('topic_manhua', ['benchpress'], function (benchpress) {
	const load = (path) => {
		const module = require(`${path}`);
		if (module?.default) {
			return module.default;
		}
		return module;
	};
	const Container = load('./utill/injector');
	const { debounce } = load('./utill/delay');

	const container = new Container();

	const DataService = load('./comicReader/dataService');
	const PageBarStatus = load('./comicReader/pageBarStatus');
	const PageEvent = load('./comicReader/pageEvent');
	const ImagePipe = load('./comicReader/imagePipe');

	$(window).on('action:ajaxify.end', async () => {
		if (!ajaxify.data.template.topic_manhua) return;

		container.register('ajaxify', ajaxify);
		container.register('localStorage', localStorage);
		const dataService = container.resolve(['ajaxify', 'localStorage'], (ajaxify, localStorage) => new DataService(ajaxify, localStorage));
		dataService.getMediaPages();
		container.register('dataService', dataService);
		const pageBarStatus = container.resolve(['dataService'], dataService => new PageBarStatus(dataService));
		const imagePipe = container.resolve(['dataService'], dataService => new ImagePipe(dataService));
		container.register(['imagePipe'], imagePipe);
		container.register(['pageBarStatus'], pageBarStatus);
		const pageEvent = container.resolve(['pageBarStatus', 'imagePipe'], (pageBarStatus, imagePipe) => new PageEvent(pageBarStatus, imagePipe));
		const {
			checkTpl, checkReadFunc,
			getComicReadHistory, getMaxPageLength, getCurrentPageIndex, getMediaData,
			setComicReadHistory,
		} = dataService;
		const { clickOnScreenMode, updatePageCount, jumpToPreviousPosition, jumpPagePostion, updateBarStatus } = pageEvent;

		const { bindButtonEvent } = pageBarStatus;

		const { preloadImage, getCurrentImage } = imagePipe;
		async function initializeComicStatusData(data) {
			const mediaData = getMediaData();
			const currentTid = mediaData.tid;
			const readFuc = checkReadFunc(currentTid);
			const currentPageIndex = getCurrentPageIndex(currentTid);
			const readHistory = getComicReadHistory(currentTid);
			const maxPage = getMaxPageLength();
			const nowTimeVal = (new Date()).valueOf();
			const initStatusData = {
				offset: readHistory.offset,
				lastdate: nowTimeVal,
				endReadChapter: mediaData.index,
				readFuc: readFuc,
				readPageIndex: currentPageIndex,
			};
			window.config.theme.readFuc = readFuc;
			const html = await benchpress.render('topic_manhua_page', data);

			const preloading = num => new Promise((resolve, reject) => {
				const index = parseInt(currentPageIndex, 10);
				let [start, end] = [index, index + num];
				end = end >= maxPage ? maxPage : end;
				const promiseArr = [];
				for (let i = start; i < end; i++) {
					const url = getCurrentImage(i).url;
					promiseArr.push(preloadImage(url));
				}
				Promise.allSettled(promiseArr).then((res) => {
					resolve(res);
				}).catch((err) => {
					reject(err);
				});
			});

			const displayComic = (num) => {
				return new Promise((resolve, reject) => {
					preloading(num).then((res) => {
						const view = $('#content').html(html);
						console.log("🚀 ~ file: topic_manhua.js:83", mediaData.index,readHistory.endReadChapter)
						if (mediaData.index === readHistory.endReadChapter) {
							jumpToPreviousPosition();
						} else {
							if( readFuc === 'turn' ) jumpPagePostion.turn(null, currentPageIndex);
						}
						if(view){
							updateBarStatus();
							setComicReadHistory(initStatusData, currentTid);
							resolve({success: true});
						}
					});
					// setTimeout(() => {
					// 	reject({success: false});
					// }, 20000);
				});
			} 

			return displayComic;
		}

		function setupEventListeners() {
			$('.comic-page-container').off('click', clickOnScreenMode() ).on('click', clickOnScreenMode());
			$(window).off('scroll', debounce(updatePageCount(), 200)).on('scroll', debounce(updatePageCount(), 200));
			$(window).off('hashchange', jumpPagePostion.turn).on('hashchange', jumpPagePostion.turn);
			
		}

		const displayComic = await initializeComicStatusData(dataService.data);
		displayComic(5).then((res) => {
			if(res.success){
				setupEventListeners();
				bindButtonEvent();
			}
		})

	});
});



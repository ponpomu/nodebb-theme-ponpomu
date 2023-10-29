// eslint-disable-next-line import/no-unresolved
const alerts = require('alerts');
// eslint-disable-next-line no-unused-vars
const bootbox = require('bootbox');


export default class pageEvent {
	constructor(pageBarStatus, imagePipe) {
		this.pageBarStatus = pageBarStatus;
		this.dataStatus = pageBarStatus.dataStatus;
		const { data, media, media: { pages } } = this.dataStatus;
		this.data = data;
		this.media = media;
		this.pages = pages;

		this.imagePipe = imagePipe;
	}

// 点击屏幕触发的事件
	clickOnScreenMode = () => {
		const tid = this.media.tid;
		const mode = this.dataStatus.checkReadFunc(tid);
		switch (mode) {
			case 'scroll':
				console.log('2333333scroll')
				return this.createScrollModeHandler();
			case 'turn':
				console.log('2333333turn')
				return this.createTurnModeHandler();
			default:
				break;
		}
	}

	createScrollModeHandler = () => {
		const { jumpPagePostion } = this;
		return (event) => {
			const screenHeight = window.innerHeight;
			const oneSven = screenHeight / 7;
			const currentPage = parseInt($('#comic-page-slider').val(), 10);
			const pageCount = parseInt(this.dataStatus.getMaxPageLength(), 10);
			// 当点击的位置在屏幕的上三分之一时，跳转到上一页
			if (event.clientY <= oneSven * 3) {
				const prevPage = currentPage >= pageCount ? pageCount : currentPage - 1;
				jumpPagePostion.scorll(prevPage);
			}
			if (event.clientY >= oneSven * 4) {
				const nextPage = currentPage >= pageCount ? pageCount : currentPage + 1;
				jumpPagePostion.scorll(nextPage);
			}
			if (event.clientY >= oneSven * 3 && event.clientY <= oneSven * 4) {
				this.viewWindowTool.toggle();
			}
		};
	}

	createTurnModeHandler = () => {
		const { tid } = this.media;
		const { updatePageCount, media: mediaData } =this;
		const { getCurrentImage, cacheImages, displayImage } = this.imagePipe;
		const { getCurrentPageIndex } = this.dataStatus;
		return (event) => {
			const totalImages = parseInt(this.dataStatus.getMaxPageLength(), 10);
			let currentIndex = getCurrentPageIndex();
			const screenHeight = window.innerWidth;
			const oneSven = screenHeight / 7;
			if (event.clientX <= oneSven * 3) {
				const prevIndex = currentIndex === 1 ? 1 : currentIndex -= 1;
				const previousURL = getCurrentImage(prevIndex).url;
				displayImage(previousURL, prevIndex);
			}
			if (event.clientX >= oneSven * 4) {
				if (currentIndex === totalImages) {
					if (mediaData.index === mediaData.chapterNum) {
						alerts.alert({
							type: 'success',
							alert_id: 'tip_page_last',
							title: '已经是最后一页了',
							message: '',
							timeout: 1000,
						});
					} else {
						location.replace(`./${mediaData.index + 1}?readFuc=turn`);
					}
				}
				cacheImages(currentIndex, totalImages, 6);
				const nextIndex = currentIndex === totalImages ? totalImages : currentIndex += 1;
				const nextURL = getCurrentImage(nextIndex).url;
				displayImage(nextURL, nextIndex);
			}
			location.replace(`#${currentIndex}`);
			if (event.clientX >= oneSven * 3 && event.clientX <= oneSven * 4) {
				this.viewWindowTool.toggle();
			}
			updatePageCount();
		};
	}

	viewWindowTool = {
		toggle: function() {
			const isHidden = $('.bar-stauts-cotainer').is(':hidden');
			// eslint-disable-next-line no-unused-expressions
			isHidden ? this.show() : this.hide();
			return !isHidden;
		},
		show: function() {
			$('.bar-stauts-cotainer').show();
			$('#comic-page-header').css('transform', 'translateY(0)');
		},
		hide: function() {
			$('.bar-stauts-cotainer').hide();
			$('#comic-page-header').css('transform', 'translateY(-100%)');
		}
	};




	updatePageCount = () => {
		const { tid } = this.media;
		const { getMaxPageLength, getComicReadHistory, setComicReadHistory } = this.dataStatus
		const { updateBarData } = this.pageBarStatus;
		const maxPage = getMaxPageLength();
		const history = getComicReadHistory(tid);
		return  () => {
			const scrollTop = $(window).scrollTop();
			history.offset = parseInt($(window).scrollTop(), 10);
			$('.ratio-container').each((index,el) => {
				const pageHeight = $(el).height();
				const viewHeight = $(window).height();
				const relativeHeight = ((viewHeight - pageHeight) / 2) + 10;

				const updateThisPageCount = (el) => {
					const currentPage = parseInt($(el).attr('id').split('-')[1], 10);
					history.readPageIndex = currentPage;
					updateBarData(currentPage, maxPage);
				};

				if (viewHeight <= pageHeight) {
					if (scrollTop >= $(el).offset().top - 30) {
						updateThisPageCount(el);
					}
				} else if (scrollTop >= $(el).offset().top - relativeHeight) {
					updateThisPageCount(el);
				}

			});
			setComicReadHistory(history, tid);
		};
	}

	jumpPagePostion = {
		scorll: (posId) => {
			const pageId = `#page-${posId}`;
			const viewHeight = $(window).height();
			const pageHeight = $(pageId).height();
			if (viewHeight <= pageHeight) {
				$('html, body').animate({
					scrollTop: $(pageId).offset().top,
				}, 300);
			} else {
				$('html, body').animate({
					scrollTop: $(pageId).offset().top - ((viewHeight - pageHeight) / 2),
				}, 300);
			}
		},
		turn: (event, pageId) => {
			const { updateBarStatus } = this
			const { tid, index } = this.media;
			const { getCurrentPageIndex, getComicReadHistory, setComicReadHistory } = this.dataStatus
			const { displayImage, getCurrentImage  } = this.imagePipe
			const history = getComicReadHistory(tid);
			const currentPageIndex = pageId || getCurrentPageIndex();
			history.readPageIndex = currentPageIndex;
			history.endReadChapter = index;
			const url = getCurrentImage(currentPageIndex).url;
			console.log("🚀 ~ file: pageEvent.js:175 ~ pageEvent ~ url:", url)
			displayImage(url, currentPageIndex);
			updateBarStatus();
			setComicReadHistory(history, tid);
		}
	}

	updateBarStatus = (current, length) => {
		const { updateBarData } = this.pageBarStatus;
		const { getMaxPageLength, getCurrentPageIndex } = this.dataStatus
		updateBarData(current || getCurrentPageIndex(), length || getMaxPageLength());
	}


	jumpToPreviousPosition = () => {
		const { tid } = this.media;
		const { jumpPagePostion, updateBarStatus } = this;
		const { displayImage, getCurrentImage  } = this.imagePipe
		const { checkReadFunc, getComicReadHistory, getCurrentPageIndex } = this.dataStatus
		
		const { offset, readPageIndex } = getComicReadHistory(tid);
		console.log("🚀 ~ file: pageEvent.js:198 ~ pageEvent ~ offset, readPageIndex:", offset, readPageIndex)
		const mode = checkReadFunc(tid)
		switch (mode) {
			case 'scroll':
				if(offset){
					$('html, body').animate({
						scrollTop: offset,
					}, 500);
				}else{
					jumpPagePostion.scorll(readPageIndex)
				}
				
			case 'turn':
				const pageIndex = readPageIndex || getCurrentPageIndex();
				console.log("🚀 ~ file: pageEvent.js:212 ~ pageEvent ~ pageIndex:", pageIndex)
				jumpPagePostion.turn(null, pageIndex);
				// location.replace(`#${readPageIndex}`);
		}
	}
}


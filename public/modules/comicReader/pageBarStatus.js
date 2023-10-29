export default class pageBarStatus {
	constructor(dataStatus) {
		this.dataStatus = dataStatus;
	}

	bindButtonEvent = () => {
		if (this.dataStatus.checkTpl('topic_manhua')) {
			const { media, checkReadFunc } = this.dataStatus;
			const readFuc = checkReadFunc(media.tid);
			// const readFuc = history.readFuc;
			$('.bar-stauts-cotainer .prev-btn').on('click', () => { location.replace(`./${media.index - 1}?readFuc=${readFuc}`); });
			$('.bar-stauts-cotainer .next-btn').on('click', () => { location.replace(`./${media.index + 1}?readFuc=${readFuc}`); });
			$('.return-to-comic a').on('click', () => { location.replace(`../`); });
			$('.chapter-list a').each(function () {
				$(this).on('click', function () {
					const sort = $(this).attr('index-data');
					const url = `./${sort}?readFuc=${readFuc}`;
					location.replace(url);
				});
			});
			$('.chapter-list a').eq(this.dataStatus.media.index - 1).addClass('active');
		}
	}



	// eslint-disable-next-line class-methods-use-this
	updateBarData(currentPageNumber, maxPageNumber) {
		const count = $('.comic-page-count');
		const slider = $('#comic-page-slider');
		currentPageNumber = parseInt(currentPageNumber, 10);
		maxPageNumber = parseInt(maxPageNumber, 10);
		count.text(currentPageNumber + '/' + maxPageNumber);
		slider.val(currentPageNumber);
		slider.attr('max', maxPageNumber);
	}
}

'use strict';

// 返回重新定位到上次点击的帖子
define('handlePageBack', [
	'storage',
	'navigator',
], function (storage, navigator) {
	const handlePageBack = {};
	// eslint-disable-next-line no-unused-vars
	let loadComponentsMethod;

	handlePageBack.init = function (_loadComponentsMethod, template, selectorArr) {
		loadComponentsMethod = _loadComponentsMethod;
		saveClickedIndex(...selectorArr);
		$(window).on('action:popstate', onBackClicked(template, selectorArr[0]));
	};

	// handlePageBack.onBackClicked = onBackClicked;

	function saveClickedIndex(page, clickedComponent, selectedComponentIndex) {
		$(page).on('click', clickedComponent, function () {
			const windowScrollTop = $(window).scrollTop();
			$(selectedComponentIndex).each(function () {
				if (windowScrollTop > 0) {
					storage.setItem(`${page}:bookmark:offset`, windowScrollTop);
					return false;
				}
			});
		});
	}

	function onBackClicked(name, page) {
		// 是否存在属性
		if (ajaxify.data.template[name]) {
			handlePageBack.scrollToTopic(page);
		}
	}

	handlePageBack.scrollToTopic = function (page) {
		const offset = storage.getItem(`${page}:bookmark:offset`);
		if (offset) {
			storage.removeItem(`${page}:bookmark:offset`);
			$(window).scrollTop(offset);
			navigator.update();
		}
	};


	$(window).on('action:ajaxify.contentLoaded', function () {
		handlePageBack.init(true, 'home', ['template-home,[component="homePage"]', '', 'a']);
		// handlePageBack.init(true, 'account/bookmarks', ['.account', '', 'a']);

		// handlePageBack.init(true, 'category', ['ul[component="category"]', '', 'a']);
	});
});

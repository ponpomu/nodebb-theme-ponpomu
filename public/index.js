// Swatch Applet
$(window).on('action:ajaxify.coldLoad', function () {
	function generateRandomString(length) {
		let text = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (let i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}
	const string = generateRandomString(10);
	$('#random_string').text(string);
	let whichTheme = localStorage.getItem('theme');
	let activeTheme = localStorage.getItem('activeTheme');

	if (!whichTheme) {
		const matched = window.matchMedia('(prefers-color-scheme: dark)').matches;
		if (matched) {
			whichTheme = 'nord';
			activeTheme = '/assets/customcss/nord.css?version=' + string;
		} else {
			whichTheme = 'default';
			activeTheme = '/assets/customcss/nord.css?version=' + string;
		}
		if (whichTheme === 'default') {
			activeTheme = '/assets/customcss/nord.css?version=' + string;
		}
	}
	if (whichTheme) {
		$.get(activeTheme, function (css) {
			$('<style type="text/css"></style>')
				.html(css)
				.appendTo('head');
		});
		$(document).ready(function () {
			$('body').on('click change', '#theme li', function () {
				const string = generateRandomString(10);
				$('#random_string').text(string);
				const thishref = $(this).attr('rel') + '?version=' + string;
				$.get(thishref, function (css) {
					$('<style type="text/css"></style>')
						.html(css)
						.appendTo('head');
				});
				const selected = 'logo';
				const theTheme = $(this).attr('rel');
				const theID = $(this).attr('id');
				if (selected === 'default') {
					localStorage.setItem('theme', selected);
					localStorage.setItem('activeLogo', selected);
					localStorage.setItem('activeTheme', '/assets/customcss/flatly.css?version=' + string);
				} else {
					localStorage.setItem('theme', selected);
					localStorage.setItem('savedTheme', theID);
					localStorage.setItem('activeLogo', selected);
					localStorage.setItem('activeTheme', theTheme);
				}
				return false;
			});
		});
	}
});

// $(window).on('action:ajaxify.loadingTemplates action:ajaxify.end', function () {

// $(document).ready(() => {
// 	$(window).on('action:ajaxify.loadingTemplates action:ajaxify.end action:ajaxify.loadingData action:app.load action:popstate', function () {
// 		console.log('test');
// 		const getcurrentUrlParme = function (prop, currentURL = window.location.href) {
// 			currentURL = new URL(currentURL);
// 			const params = new URLSearchParams(currentURL.search);
// 			const paramValue = params.get(`${prop}`);
// 			return paramValue;
// 		};
// 		// if (/\/comic\//g.test(ajaxify.currentPage)) {
// 		if (getcurrentUrlParme('readFuc')) {
// 			const getcurrentUrlParme = function (prop, currentURL = window.location.href) {
// 				currentURL = new URL(currentURL);
// 				const params = new URLSearchParams(currentURL.search);
// 				const paramValue = params.get(`${prop}`);
// 				return paramValue;
// 			};
// 			const getComicReadHistory = function (relatTid) {
// 				return JSON.parse(localStorage.getItem(`COMIC:${relatTid}`)) || [];
// 			};
// 			const tid = window.location.href.match(/(?<=topic\/).*(?=\/comic)/g)[0];
// 			window.config.theme.readFuc = getcurrentUrlParme('readFuc') || getComicReadHistory(tid).readFuc;
// 			console.log(`🚀 ~ file: index.js:78 ~ window.config.theme.readFuc:`, window.config.theme.readFuc);
// 		}
// 	});
// });

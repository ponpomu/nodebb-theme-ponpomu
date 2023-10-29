'use strict';

define('admin/plugins/ponpomu', ['settings', 'alerts', 'api'], function (Settings, alerts, api) {
	var ACP = {};
	let themeConfig = {};
	api.get('/api/config').then((data) => {
		themeConfig = data.theme;
	});
	ACP.init = function () {
		var nbbId = ajaxify.data.nbbId;
		var klass = nbbId + '-settings';
		var wrapper = $('.' + klass);

		Settings.load(nbbId, $(wrapper));

		const setting_hash = window.location.hash;
		$(`[href="${setting_hash}"]`).tab('show');

		// let otherLinks = $(`a.nav-link:not([href="${setting_hash}"])`);




		$('#changeComicContent').on('click', function () {
			api.get('/api/admin/plugins/ponpomu/changeComicContent', {}, function (err, data) {
				alerts.alert({
					type: 'success',
					alert_id: nbbId,
					title: '测试',
					message: '测试',
				});
			});
		});


		$('#fetchTachiComic_button').on('click', function () {
			const siblingInput = $('#fetchTachiComic_input');
			const comic_id = siblingInput.val();
			const requestOptions = {
				method: 'GET',
				headers: { 'Content-Type': 'text/plain' },
				credentials: 'include',
			};
			fetch(`${themeConfig.apiResource}/comic/gallery/fetch/${comic_id}`, requestOptions);
			alerts.alert({
				type: 'success',
				alert_id: nbbId,
				title: '测试',
				message: '测试',
			});
		});

		$('#save').on('click', function () {
			Settings.save(nbbId, wrapper, function () {
				alerts.alert({
					type: 'success',
					alert_id: nbbId,
					title: '重启请求',
					message: '请重新加载您的 NodeBB 以使您的更改生效',
					clickfn: function () {
						socket.emit('admin.reload');
					},
				});
			});
		});
	};
	return ACP;
});

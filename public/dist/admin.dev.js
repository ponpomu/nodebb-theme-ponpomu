'use strict';

define('admin/plugins/harmony', ['settings', 'alerts'], function (Settings, alerts) {
  var ACP = {};

  ACP.init = function () {
    var nbbId = ajaxify.data.nbbId;
    var klass = nbbId + '-settings';
    var wrapper = $('.' + klass);
    Settings.load(nbbId, $(wrapper));

    function onChange(e) {
      var target = $(e.target);
      var input = wrapper.find(target.attr('data-toggle-target'));
      input.prop('disabled', !target.is(':checked'));
    }

    wrapper.find('input[type="checkbox"][data-toggle-target]').on('change', onChange);
    Settings.load(nbbId, wrapper, function () {
      wrapper.find('input[type="checkbox"][data-toggle-target]').each(function () {
        onChange({
          target: this
        });
      });
    });
    $('#save').on('click', function () {
      Settings.save(nbbId, wrapper, function () {
        alerts.alert({
          type: 'success',
          alert_id: nbbId,
          title: '重启请求',
          message: '请重新加载您的 NodeBB 以使您的更改生效',
          clickfn: function clickfn() {
            socket.emit('admin.reload');
          }
        });
      });
    });
  };

  return ACP;
});
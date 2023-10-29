'use strict';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

define('forum/account/theme', ['forum/account/header', 'api', 'settings', 'alerts'], function (header, api, settings, alerts) {
  var Theme = {};

  Theme.init = function () {
    header.init();
    Theme.setupForm();
  };

  Theme.setupForm = function () {
    var saveEl = document.getElementById('save');

    if (saveEl) {
      var formEl = document.getElementById('theme-settings');
      saveEl.addEventListener('click', function _callee() {
        var themeSettings;
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                themeSettings = settings.helper.serializeForm($(formEl));
                _context.next = 3;
                return regeneratorRuntime.awrap(api.put("/users/".concat(app.user.uid, "/settings"), {
                  settings: _objectSpread({}, themeSettings)
                }));

              case 3:
                _context.next = 5;
                return regeneratorRuntime.awrap(api.get('/api/config'));

              case 5:
                config.theme = _context.sent.theme;
                alerts.success('[[success:settings-saved]]');

              case 7:
              case "end":
                return _context.stop();
            }
          }
        });
      });
    }
  };

  return Theme;
});
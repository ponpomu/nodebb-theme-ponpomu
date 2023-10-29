'use strict';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var fs = require('fs');

var path = require('path');

var nconf = require('nconf');

var meta = require.main.require('./src/meta');

var _ = require.main.require('lodash');

var user = require.main.require('./src/user');

var controllers = require('./lib/controllers');

var Plugin = module.exports;

var routeHelpers = require.main.require('./src/routes/helpers');

var defaults = {
  enableQuickReply: 'on',
  centerHeaderElements: 'off',
  stickyToolbar: 'on',
  autohideBottombar: 'off',
  openSidebars: 'off'
};

var pluginData = require('./plugin.json');

pluginData.nbbId = pluginData.id.replace(/nodebb-theme-/, '');
Plugin.nbbId = pluginData.nbbId;

Plugin.init = function _callee(params) {
  var router, middleware;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          router = params.router, middleware = params.middleware; // const settings = await Meta.settings.get(pluginData.nbbId);

          routeHelpers.setupAdminPageRoute(router, "/admin/plugins/".concat(Plugin.nbbId), [], controllers.renderAdminPage(pluginData));
          routeHelpers.setupPageRoute(router, '/user/:userslug/theme', [middleware.exposeUid, middleware.ensureLoggedIn, middleware.canViewUsers, middleware.checkAccountPermissions], controllers.renderThemeSettings);
          routeHelpers.setupPageRoute(router, "/topic/:topic_id/comic?", [middleware.ensureLoggedIn], controllers.renderTopicomic);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

Plugin.addAdminNavigation = function _callee2(header) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          header.plugins.push({
            route: "/plugins/".concat(Plugin.nbbId),
            icon: 'fa-paint-brush',
            name: 'Ponpomu Theme'
          });
          return _context2.abrupt("return", header);

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
};

Plugin.addProfileItem = function _callee3(data) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          data.links.push({
            id: 'theme',
            route: 'theme',
            icon: 'fa-paint-brush',
            name: '[[harmony:settings.title]]',
            visibility: {
              self: true,
              other: false,
              moderator: false,
              globalMod: false,
              admin: false
            }
          });
          return _context3.abrupt("return", data);

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
};

Plugin.defineWidgetAreas = function _callee4(areas) {
  var locations, templates, capitalizeFirst;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          capitalizeFirst = function _ref(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
          };

          locations = ['header', 'sidebar', 'footer'];
          templates = ['categories.tpl', 'category.tpl', 'topic.tpl', 'users.tpl', 'unread.tpl', 'recent.tpl', 'popular.tpl', 'top.tpl', 'tags.tpl', 'tag.tpl', 'login.tpl', 'register.tpl'];
          templates.forEach(function (template) {
            locations.forEach(function (location) {
              areas.push({
                name: "".concat(capitalizeFirst(template.split('.')[0]), " ").concat(capitalizeFirst(location)),
                template: template,
                location: location
              });
            });
          });
          areas = areas.concat([{
            name: 'Main post header',
            template: 'topic.tpl',
            location: 'mainpost-header'
          }, {
            name: 'Main post footer',
            template: 'topic.tpl',
            location: 'mainpost-footer'
          }, {
            name: 'Sidebar Footer',
            template: 'global',
            location: 'sidebar-footer'
          }]);
          return _context4.abrupt("return", areas);

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
};

function loadThemeConfig(uid) {
  var _ref2, _ref3, themeConfig, userConfig, config;

  return regeneratorRuntime.async(function loadThemeConfig$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(Promise.all([meta.settings.get(Plugin.nbbId), user.getSettings(uid)]));

        case 2:
          _ref2 = _context5.sent;
          _ref3 = _slicedToArray(_ref2, 2);
          themeConfig = _ref3[0];
          userConfig = _ref3[1];
          config = _objectSpread({}, defaults, {}, themeConfig, {}, _.pick(userConfig, Object.keys(defaults)));
          config.enableQuickReply = config.enableQuickReply === 'on';
          config.centerHeaderElements = config.centerHeaderElements === 'on';
          config.stickyToolbar = config.stickyToolbar === 'on';
          config.autohideBottombar = config.autohideBottombar === 'on';
          config.openSidebars = config.openSidebars === 'on';
          return _context5.abrupt("return", config);

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  });
}

Plugin.getThemeConfig = function _callee5(config) {
  return regeneratorRuntime.async(function _callee5$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(loadThemeConfig(config.uid));

        case 2:
          config.theme = _context6.sent;
          ;
          config.openDraftsOnPageLoad = false;
          return _context6.abrupt("return", config);

        case 6:
        case "end":
          return _context6.stop();
      }
    }
  });
};

Plugin.getAdminSettings = function _callee6(hookData) {
  return regeneratorRuntime.async(function _callee6$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          if (hookData.plugin === 'harmony') {
            hookData.values = _objectSpread({}, defaults, {}, hookData.values);
          }

          return _context7.abrupt("return", hookData);

        case 2:
        case "end":
          return _context7.stop();
      }
    }
  });
};

Plugin.saveUserSettings = function _callee7(hookData) {
  return regeneratorRuntime.async(function _callee7$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          Object.keys(defaults).forEach(function (key) {
            if (hookData.data.hasOwnProperty(key)) {
              hookData.settings[key] = hookData.data[key] || undefined;
            }
          });
          return _context8.abrupt("return", hookData);

        case 2:
        case "end":
          return _context8.stop();
      }
    }
  });
};

Plugin.filterMiddlewareRenderHeader = function _callee8(hookData) {
  var userSettings, lightSkins, darkSkins, parseSkins;
  return regeneratorRuntime.async(function _callee8$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          parseSkins = function _ref4(skins) {
            skins = skins.map(function (skin) {
              return {
                name: _.capitalize(skin),
                value: skin === 'default' ? '' : skin
              };
            });
            skins.forEach(function (skin) {
              skin.selected = skin.value === userSettings.bootswatchSkin;
            });
            return skins;
          };

          _context9.next = 3;
          return regeneratorRuntime.awrap(user.getSettings(hookData.req.uid));

        case 3:
          userSettings = _context9.sent;
          lightSkins = ['default'];
          darkSkins = ['cyborg'];
          hookData.templateData.bootswatchSkinOptions = {
            light: parseSkins(lightSkins),
            dark: parseSkins(darkSkins)
          };
          hookData.templateData.currentBSSkin = _.capitalize(hookData.templateData.bootswatchSkin);
          return _context9.abrupt("return", hookData);

        case 9:
        case "end":
          return _context9.stop();
      }
    }
  });
};

Plugin.removeFinalBreadcrumb = function _callee9(hookData) {
  var templateData, breadcrumbs, applyTo;
  return regeneratorRuntime.async(function _callee9$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          templateData = hookData.templateData;
          breadcrumbs = templateData.breadcrumbs;
          applyTo = ['category', 'topic']; // Remove the last breadcrumb (the current page) as it is not part of Harmony's design

          if (applyTo.includes(hookData.templateData.template.name) && breadcrumbs && breadcrumbs.length) {
            breadcrumbs.pop();
          }

          return _context10.abrupt("return", hookData);

        case 5:
        case "end":
          return _context10.stop();
      }
    }
  });
};

Plugin.parseCategoryData = function _callee10() {
  var hookData,
      themeConfig,
      comicsWhitelist,
      cid,
      isVisible,
      newHookData,
      _args11 = arguments;
  return regeneratorRuntime.async(function _callee10$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          hookData = _args11.length > 0 && _args11[0] !== undefined ? _args11[0] : {};
          _context11.next = 3;
          return regeneratorRuntime.awrap(meta.settings.get('ponpomu'));

        case 3:
          themeConfig = _context11.sent;
          comicsWhitelist = themeConfig.comicsWhitelist.split(',').map(Number);
          cid = hookData.category.cid;
          isVisible = comicsWhitelist.includes(cid);
          newHookData = _objectSpread({}, hookData, {
            category: _objectSpread({}, hookData.category, {
              isVisibleBug: isVisible
            })
          });
          return _context11.abrupt("return", newHookData);

        case 9:
        case "end":
          return _context11.stop();
      }
    }
  });
};

Plugin.topicCreateHandle = function _callee11(hookData) {
  var tid;
  return regeneratorRuntime.async(function _callee11$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          tid = hookData.topic.tid;
          console.log("🚀 ~ file: library.js:234 ~ Plugin.topicCreateHandle= ~ hookData.topic:", hookData.topic);
          console.log("🚀 ~ file: library.js:234 ~ Plugin.topicCreateHandle= ~ hookData.topic:", hookData.data);
          hookData.topic.slug = "".concat(tid, "/topic");
          return _context12.abrupt("return", hookData);

        case 5:
        case "end":
          return _context12.stop();
      }
    }
  });
};
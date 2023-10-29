'use strict';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

define('bugdialog', ['api', 'bootbox', 'alerts'], function (api, bootbox, alerts) {
  $(window).on('action:ajaxify.contentLoaded', function (ev, data) {
    function createATopic(page) {
      var requestOptions, galleryData, _galleryData$page$gal, title, images, topicTags, path, postData;

      return regeneratorRuntime.async(function createATopic$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              requestOptions = {
                method: 'GET',
                headers: {
                  'Content-Type': 'text/plain'
                },
                credentials: 'include'
              };
              _context.next = 3;
              return regeneratorRuntime.awrap(fetch("https://api.ponpomu.com/nh/".concat(page.id), requestOptions).then(function (res) {
                return res.json();
              }));

            case 3:
              galleryData = _context.sent;
              _galleryData$page$gal = _objectSpread({}, galleryData.page, {}, galleryData),
							title = _galleryData$page$gal.title,
							images = _galleryData$page$gal.images,
							topicTags = _galleryData$page$gal.topicTags,
							path = _galleryData$page$gal.path;
              console.log("🚀 ~ file: bugdialog.js:14 ~ createATopic ~ galleryData:", galleryData);

              if (galleryData) {
                postData = {
                  "title": title.topicTitle,
                  "content": "[^&^]".concat(JSON.stringify(galleryData), "[^&^]"),
                  "thumb": "",
                  "cid": 5,
                  "tags": topicTags
                };
                api.post('/topics', postData).then(function (data) {
                  console.log('文章提交成功:', data);
                })["catch"](function (error) {
                  console.error('文章提交失败:', error);
                });
              }

            case 7:
            case "end":
              return _context.stop();
          }
        }
      });
    }

    function fetchGalleryData() {
      var id, selector, requestOptions, response, _data, _data$gallery, req, page;

      return regeneratorRuntime.async(function fetchGalleryData$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              id = document.getElementById('url-input').value;
              selector = document.getElementById('selector-input').value;
              localStorage.setItem('gallery_id', id);
              requestOptions = {
                method: 'GET',
                headers: {
                  'Content-Type': 'text/plain'
                },
                credentials: 'include'
              };
              _context2.prev = 4;
              _context2.next = 7;
              return regeneratorRuntime.awrap(fetch("https://api.ponpomu.com/gallery/".concat(id, "?selector=").concat(selector), requestOptions));

            case 7:
              response = _context2.sent;
              _context2.next = 10;
              return regeneratorRuntime.awrap(response.json());

            case 10:
              _data = _context2.sent;

              if (!(response.status === 200)) {
                _context2.next = 18;
                break;
              }

              _data$gallery = _data.gallery, req = _data$gallery.req, page = _data$gallery.page;
              _context2.next = 15;
              return regeneratorRuntime.awrap(createATopic(page));

            case 15:
              if (page !== null && req.success) {
                alerts.success('抓取请求成功，请等待服务器爬取...');
              } else {
                alerts.error("".concat(req.msg));
              }

              _context2.next = 19;
              break;

            case 18:
              alerts.error("".concat(_data.msg));

            case 19:
              _context2.next = 25;
              break;

            case 21:
              _context2.prev = 21;
              _context2.t0 = _context2["catch"](4);
              console.error(_context2.t0);
              alerts.error('请求失败，请稍后再试', _context2.t0);

            case 25:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[4, 21]]);
    }

    var $bugModuleButton = $('#bugmodule');

    if (data.tpl === 'category') {
      $bugModuleButton.on('click', function () {
        bootbox.dialog({
          title: "网站爬虫工具",
          message: '<form>\
                    <div class="form-group">\
                      <label for="url-input" class="control-label">id号：</label>\
                      <input type="text" id="url-input" class="form-control">\
                    </div>\
                    <div class="form-group">\
                      <label for="selector-input" class="control-label">选择器：</label>\
                      <select id="selector-input" class="form-control">\
                        <option value="nhentai">nhentai</option>\
                        <option value="animal">animal</option>\
                      </select>\
                    </div>\
                  </form>',
          backdrop: "static",
          closeButton: false,
          buttons: {
            cancel: {
              label: "取消",
              className: "btn-default"
            },
            confirm: {
              label: "提交",
              className: "btn-primary",
              callback: fetchGalleryData
            }
          }
        });
        var cachedId = localStorage.getItem('gallery_id');

        if (cachedId) {
          document.getElementById('url-input').value = cachedId;
        }
      });
    } else {
      $bugModuleButton.off('click');
    }
  });
});
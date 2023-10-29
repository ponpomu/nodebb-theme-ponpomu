'use strict';

$(document).ready(function () {
  setupNProgress();
  setupMobileMenu();
  setupSearch();
  setupDrafts();
  handleMobileNavigator();
  setupNavTooltips();
  fixPlaceholders();
  $('[component="skinSwitcher"]').on('click', '.dropdown-item', function () {
    var skin = $(this).attr('data-value');
    $('[component="skinSwitcher"] .dropdown-item .fa-check').addClass('invisible');
    $(this).find('.fa-check').removeClass('invisible');

    require(['forum/account/settings'], function (accountSettings) {
      $('[component="skinSwitcher"] [component="skinSwitcher/icon"]').addClass('fa-fade');
      accountSettings.changeSkin(skin);
    });
  });

  require(['hooks'], function (hooks) {
    hooks.on('action:skin.change', function () {
      $('[component="skinSwitcher"] [component="skinSwitcher/icon"]').removeClass('fa-fade');
    });
    $(window).on('action:composer.resize action:sidebar.toggle', function () {
      $('[component="composer"]').css({
        left: $('.sidebar-left').outerWidth(true),
        width: $('#panel').width()
      });
    });
    hooks.on('filter:chat.openChat', function (hookData) {
      // disables chat modals & goes straight to chat page
      hookData.modal = false;
      return hookData;
    });
  });

  function setupMobileMenu() {
    require(['hooks', 'api', 'navigator'], function (hooks, api, navigator) {
      $('[component="sidebar/toggle"]').on('click', function _callee() {
        var sidebarEl;
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                sidebarEl = $('.sidebar');
                sidebarEl.toggleClass('open');

                if (!app.user.uid) {
                  _context.next = 5;
                  break;
                }

                _context.next = 5;
                return regeneratorRuntime.awrap(api.put("/users/".concat(app.user.uid, "/settings"), {
                  settings: {
                    openSidebars: sidebarEl.hasClass('open') ? 'on' : 'off'
                  }
                }));

              case 5:
                $(window).trigger('action:sidebar.toggle');

                if (ajaxify.data.template.topic) {
                  hooks.fire('action:navigator.update', {
                    newIndex: navigator.getIndex()
                  });
                }

              case 7:
              case "end":
                return _context.stop();
            }
          }
        });
      });
      var bottomBar = $('[component="bottombar"]');
      var $body = $('body');
      var $window = $(window);
      $body.on('shown.bs.dropdown', '.sticky-tools', function () {
        bottomBar.addClass('hidden');
      });
      $body.on('hidden.bs.dropdown', '.sticky-tools', function () {
        bottomBar.removeClass('hidden');
      });
      var lastScrollTop = 0;
      var newPostsLoaded = false;

      function onWindowScroll() {
        var st = $window.scrollTop();

        if (newPostsLoaded) {
          newPostsLoaded = false;
          lastScrollTop = st;
          return;
        }

        if (st !== lastScrollTop && !navigator.scrollActive) {
          var diff = Math.abs(st - lastScrollTop);
          var scrolledDown = st > lastScrollTop;
          var scrolledUp = st < lastScrollTop;

          if (diff > 5) {
            bottomBar.css({
              bottom: !scrolledUp && scrolledDown ? -bottomBar.find('.bottombar-nav').outerHeight(true) : 0
            });
          }
        }

        lastScrollTop = st;
      }

      var delayedScroll = utils.throttle(onWindowScroll, 250);

      function enableAutohide() {
        $window.off('scroll', delayedScroll);

        if (config.theme.autohideBottombar) {
          lastScrollTop = $window.scrollTop();
          $window.on('scroll', delayedScroll);
        }
      }

      hooks.on('action:posts.loading', function () {
        $window.off('scroll', delayedScroll);
      });
      hooks.on('action:posts.loaded', function () {
        newPostsLoaded = true;
        setTimeout(enableAutohide, 250);
      });
      hooks.on('action:ajaxify.end', function () {
        $window.off('scroll', delayedScroll);
        $body.removeClass('chat-loaded');
        bottomBar.css({
          bottom: 0
        });
        setTimeout(enableAutohide, 250);
      });
      hooks.on('action:chat.loaded', function () {
        $body.toggleClass('chat-loaded', !!(ajaxify.data.template.chats && ajaxify.data.roomId));
      });
    });
  }

  function setupSearch() {
    $('[component="sidebar/search"]').on('shown.bs.dropdown', function () {
      $(this).find('[component="search/fields"] input[name="query"]').trigger('focus');
    });
  }

  function setupDrafts() {
    require(['composer/drafts', 'bootbox'], function (drafts, bootbox) {
      var draftsEl = $('[component="sidebar/drafts"]');

      function updateBadgeCount() {
        var count = drafts.getAvailableCount();

        if (count > 0) {
          draftsEl.removeClass('hidden');
        }

        $('[component="drafts/count"]').toggleClass('hidden', count <= 0).text(count);
      }

      function renderDraftList() {
        var draftListEl, draftItems, html;
        return regeneratorRuntime.async(function renderDraftList$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                draftListEl = $('[component="drafts/list"]');
                draftItems = drafts.listAvailable();

                if (draftItems.length) {
                  _context2.next = 7;
                  break;
                }

                draftListEl.find('.no-drafts').removeClass('hidden');
                draftListEl.find('.placeholder-wave').addClass('hidden');
                draftListEl.find('.draft-item-container').html('');
                return _context2.abrupt("return");

              case 7:
                draftItems.reverse().forEach(function (draft) {
                  if (draft) {
                    draft.text = utils.escapeHTML(draft.text).replace(/(?:\r\n|\r|\n)/g, '<br>');
                  }
                });
                _context2.next = 10;
                return regeneratorRuntime.awrap(app.parseAndTranslate('partials/sidebar/drafts', 'drafts', {
                  drafts: draftItems
                }));

              case 10:
                html = _context2.sent;
                draftListEl.find('.no-drafts').addClass('hidden');
                draftListEl.find('.placeholder-wave').addClass('hidden');
                draftListEl.find('.draft-item-container').html(html).find('.timeago').timeago();

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        });
      }

      draftsEl.on('shown.bs.dropdown', renderDraftList);
      draftsEl.on('click', '[component="drafts/open"]', function () {
        drafts.open($(this).attr('data-save-id'));
      });
      draftsEl.on('click', '[component="drafts/delete"]', function () {
        var save_id = $(this).attr('data-save-id');
        bootbox.confirm('[[modules:composer.discard-draft-confirm]]', function (ok) {
          if (ok) {
            drafts.removeDraft(save_id);
            renderDraftList();
          }
        });
        return false;
      });
      $(window).on('action:composer.drafts.save', updateBadgeCount);
      $(window).on('action:composer.drafts.remove', updateBadgeCount);
      updateBadgeCount();
    });
  }

  function setupNProgress() {
    require(['nprogress'], function (NProgress) {
      window.nprogress = NProgress;

      if (NProgress) {
        $(window).on('action:ajaxify.start', function () {
          NProgress.set(0.7);
        });
        $(window).on('action:ajaxify.end', function () {
          NProgress.done(true);
        });
      }
    });
  }

  function handleMobileNavigator() {
    var paginationBlockEl = $('.pagination-block');

    require(['hooks'], function (hooks) {
      hooks.on('action:ajaxify.end', function () {
        paginationBlockEl.find('.dropdown-menu.show').removeClass('show');
      });
      hooks.on('filter:navigator.scroll', function (hookData) {
        paginationBlockEl.find('.dropdown-menu.show').removeClass('show');
        return hookData;
      });
    });
  }

  function setupNavTooltips() {
    // remove title from user icon in sidebar to prevent double tooltip
    $('.sidebar [component="header/avatar"] .avatar').removeAttr('title');
    var tooltipEls = $('.sidebar [title]');
    tooltipEls.tooltip({
      trigger: 'manual',
      animation: false
    });
    tooltipEls.on('mouseenter', function (ev) {
      var target = $(ev.target);
      var isDropdown = target.hasClass('dropdown-menu') || !!target.parents('.dropdown-menu').length;

      if (!$('.sidebar').hasClass('open') && !isDropdown) {
        $(this).tooltip('show');
      }
    });
    tooltipEls.on('click mouseleave', function () {
      $(this).tooltip('hide');
    });
  }

  function fixPlaceholders() {
    if (!config.loggedIn) {
      return;
    }

    ['notifications', 'chat'].forEach(function (type) {
      var countEl = document.querySelector("[component=\"".concat(type, "/count\"]"));

      if (!countEl) {
        return;
      }

      var count = parseInt(countEl.innerText, 10);

      if (count > 1) {
        var listEls = document.querySelectorAll("[component=\"".concat(type, "/list\"]"));
        listEls.forEach(function (listEl) {
          var placeholder = listEl.querySelector('li');

          for (var x = 0; x < count - 1; x++) {
            var cloneEl = placeholder.cloneNode(true);
            listEl.insertBefore(cloneEl, placeholder);
          }
        });
      }
    });
  }
});
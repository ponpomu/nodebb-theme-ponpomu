"use strict";

var delay,
    targetCard,
    currentCard,
    destroyDelay,
    events = 'mouseenter mouseleave',
    selector = '.topic-thumb';
$(document).ready(function () {
  // Listen for events on body, we don't have to re-add on every ajaxify
  $(document.body).off(events, selector).on(events, selector, onEvent);
  $(window).on('action:ajaxify.start', function () {
    if (delay) {
      clearTimeout(delay);
      delay = 0;
    } // Destroy any cards before ajaxifying


    if (currentCard) {
      destroyCard(currentCard, true);
    }

    targetCard = null;
  });
});

function onEvent(e) {
  var target = $(e.currentTarget);
  console.log("🚀 ~ file: index.js:27 ~ onEvent ~ target:", e);
  var tooltipContent = target.find('#tooltip').html();

  if (e.type === 'mouseenter') {
    delay = createCard(target, tooltipContent);
  } else {
    clearTimeout(delay);
    delay = 0;
    destroyCard(target, false);
  }
}

function destroyCard(target, instantly) {
  if (target) {
    // console.log("🚀 ~ file: index.js:40 ~ destroyCard ~ target:", target)
    if (instantly) {
      target.popover('dispose');
      currentCard = null;
    } else {
      return setTimeout(function () {
        target.popover('dispose');
        currentCard = null;
      }, 150);
    }
  }
}

function calculatePopoverPosition(target) {
  var offset = target.offset();
  var width = $(document).width();
  var height = $(document).height();

  if (offset.left > 300) {
    return 'left';
  }

  if (width - offset.left > 300) {
    return 'right';
  }

  if (offset.top > 400) {
    return 'top';
  }

  if (height - offset.top > 400) {
    return 'bottom';
  }

  return 'right';
}

function createCard(target, tooltip) {
  return setTimeout(function () {
    target.popover({
      html: true,
      content: tooltip,
      placement: calculatePopoverPosition(target),
      trigger: 'manual',
      container: 'body'
    }).popover('show');
    currentCard = target;
  }, 150);
} // $(window).on('action:ajaxify.contentLoaded', function (ev, data) {
// 	const icon = [
// 		{ origin: "i.fa-list", replace: "fa-list.svg" },
// 		{ origin: "i.fa-gear", replace: "fa-gear.svg" },
// 		{ origin: "i.fa-inbox", replace: "fa-inbox.svg" },
// 		{ origin: "i.fa-clock-o", replace: "fa-clock-io.svg" },
// 		{ origin: "i.fa-tags", replace: "fa-tag.png" }
// 	]
// 	const domain = window.location.origin;
// 	icon.forEach(data => {
// 		const $icon = $(data.origin);
// 		const $img = $('<img>').attr({
// 			'src': `${domain}/assets/custom/icon/${data.replace}`,
// 			'alt': 'Icon',
// 			'class': 'fa fa-fw'
// 		}).css({
// 			'width': '1.45em',
// 		});
// 		const $container = $('<div>').css({
// 			'display': 'flex',
// 			'align-items': 'center'
// 		}).css({
// 			'display': 'var(--fa-display,inline-block)'
// 		}).append($img);
// 		$icon.replaceWith($container);
// 	});
// })
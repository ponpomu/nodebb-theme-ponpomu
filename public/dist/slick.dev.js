'use strict';

define('topic_mh', ['jquery', 'slick'], function ($) {
  // $(window).on('action:ajaxify.end', function (ev, data) {
  // 	$('.comic-box').slick({
  // 		arrows: false,
  // 		touchMove: true,
  // 		// vertical: true,
  // 		// verticalSwiping: true,
  // 		infinite: false,
  // 		accessibility: true,
  // 		adaptiveHeight: true,
  // 		mobileFirst: true,
  // 	});
  // 	$('.comic-box').click(function(){
  // 		$('.comic-box').slick('next');
  // 	});
  // })
  // $('.container.brand-container').hide()
  $(window).on('action:ajaxify.start', function (ev, data) {// $('.container.brand-container').show()
  });
});
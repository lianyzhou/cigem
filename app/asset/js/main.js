(function() {
	var $slider = $('#slider');
	var $bestlist = $('#bestlist');
	var $header_links = $('#header_links');
	var $playlist = $('#play_list');
	var $video = $('#video_embed');
	function anchor() {
		var elementClicked = $(this).attr("href").split('#');
	    var temp = '#'+ elementClicked[1];
	    var destination = $(temp).offset().top;
	    $("html:not(:animated),body:not(:animated)").animate({ scrollTop: destination-102}, 300);
	}
	function slide_image() {
		var $me = $(this);
		var pos = $me.attr('data-pos');
		var $fadeInDom = $slider.find('li').eq(pos);
		var $fadeOutDom = $slider.find('li.cur');
		if($fadeInDom[0] === $fadeOutDom[0]) {
			return;
		}
		function doAnimate() {
			$fadeOutDom.stop(true,true).animate({opacity:0}, 200,"easeOutQuad",function() {
				$fadeOutDom.removeClass('cur');
				$fadeInDom.stop(true,true).animate({opacity:1} , 200 , "easeInCubic",function() {
					$fadeInDom.addClass('cur');
				});
			});	
		}
		var $datasrc = $fadeInDom.find('img[data-src]');
		if($datasrc[0]) {
			var src = $datasrc.attr('data-src');
			var img = new Image();
			img.onload = function() {
				img.onload = undefined;
				$datasrc.attr('src' , src).removeAttr('data-src');
				doAnimate();
			};
			img.src = src;
		} else {
			doAnimate();
		}
	}
	$header_links.on('mouseover' , 'li' , slide_image)
				 .on('click' , 'li' , anchor);
	//生成overlay
	var overlayTemplate = '<div class="overlay text-center">' + 
							'<p class="title ellipsis">{title}</p>' + 
							'<p class="content ellipsis">{content}</p>' + 
						'</div>';
	$bestlist.find('a').each(function(i,dom) {
		var $me = $(dom);
		var obj = {
			title : $me.attr('data-title'),
			content : $me.attr('data-content')
		};
		var html = overlayTemplate.replace(/\{([^}]+)\}/g , function($0,$1) {
			return obj[$1];
		});
		$(html).appendTo($me);
	});
	function showDialog(e) {
		e.preventDefault();
		$.imgDialog(this);
	}
	var videoHtml = '<embed src="http://static.youku.com/v1.0.0149/v/swf/loader.swf?VideoIDS={play_id}&winType=adshow&isAutoPlay=true" quality="high" width="552" height="291" align="middle" allowScriptAccess="never" allowNetworking="internal" allowfullscreen="true" autostart="0" type="application/x-shockwave-flash"></embed>';
	function playVideo(e) {
		e.preventDefault();
		var $me = $(this);
		var play_id = $me.attr('data-id');
		if(!play_id) {
			$me = $me.closest('li').find('.pic');
			play_id = $me.attr('data-id');
		}
		var obj = {
			'play_id' : play_id
		};
		var html = videoHtml.replace(/\{([^}]+)\}/g , function($0,$1) {
			return obj[$1];
		});
		$video.html(html);
	}
	$bestlist.on('click' , 'a' , showDialog);
	$playlist.on('click' , 'a' , playVideo);
	function preLoadPics() {
		var arr = [] , map = {};
		$('a' , $bestlist).each(function(i,dom) {
			var src = $(dom).attr('data-bigsrc');
			arr.push(src);
		});
		$('img[data-src]' , $slider).each(function(i , dom) {
			var src = $(dom).attr('data-src');
			arr.push(src);
		});
		function load() {
			if(!arr.length) {
				return;
			}
			var src = arr.shift();
			var img = new Image();
			img.onload = function() {
				img.onload = undefined;
				load();
			};
			img.src = src;
		}
		load();
	}
	function setMapIframeSrc() {
		$('#map_iframe').attr('src' , $('#map_iframe').attr('data-src')).removeAttr('data-src');
	}
	$(window).load(function() {
		preLoadPics();
		setMapIframeSrc();
	});
})();

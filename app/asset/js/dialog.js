(function($) {
	var cfg = {
		img : null,
		desp : null
	};
	var ImagePic
		,$dialog
		,$dialogdiv
		,$imgdom
		,$load;
	var html = '<div class="imgdialog ellipsis text-center">' +
					'<img src="{img}"/>' +
					'<p>{desp}</p>' +
					'<a href="javascript:void(0)" class="loadico prev"></a>' + 
					'<a href="javascript:void(0)" class="loadico next"></a>' + 
			 '</div>';
	function getData(dom) {
		cfg.img = $(dom).attr('data-bigsrc');
		cfg.desp = $(dom).attr('data-desp');
	} 
	function loopPicState(callback) {
		ImagePic.onload = function() {
			callback();
		};
	}
	function setCenter() {
		var top = ($(window).height() - (ImagePic.height + 60 + 48)) / 2;
		$dialogdiv.css({
			marginTop : top
		});
	}
	function bindSetCenter() {
		$(window).bind('resize' , setCenter);
	}
	function removeSetCenter() {
		$(window).unbind('resize' , setCenter);
	}
	function prev() {
		var $prev = $imgdom.closest('li').prev('li').find('a');
		if(!$prev.length) {
			return;
		}
		getData($prev);
		loadPic();
		$imgdom = $prev;
	}
	function next() {
		var $next = $imgdom.closest('li').next('li').find('a');
		if(!$next.length) {
			return;
		}
		getData($next);
		loadPic();
		$imgdom = $next;
	}
	function bindEvt() {
		$dialogdiv.on('click' , '.prev' , prev);
		$dialogdiv.on('click' , '.next' , next);
	}
	function showLoad() {
		if(!$load) {
			$load = $('<div class="loadico loading"></div>').appendTo('body');
		}
		$load.show();
		clearInterval(loadTimer);
		loadTimer = setInterval(changeLoadPos , 66);
	}
	var loadTimer , loadPos = 0;
	function changeLoadPos() {
		loadPos += 40;
		if(loadPos >= 480) {
			loadPos = 0;
		}
		$load.css('background-position', '0 ' + (-1 * loadPos) + 'px');
	}
	function hideLoad() {
		clearInterval(loadTimer);
		$load.hide();
	}
	function loadPic() {
		showLoad();
		ImagePic = new Image();
		loopPicState(function() {
			imageOnload();
		});
		ImagePic.src = cfg.img;
	}
	
	function imageOnload() {
		hideLoad();
		if(!$dialog) {
			var dialogHtml = html.replace(/\{([^}]+)\}/g , function($0,$1) {
				return cfg[$1];
			});
			$dialog = $.alert(dialogHtml);
			$dialogdiv = $dialog.getDom().find('.modal-content');
			bindSetCenter();
			$dialog.addEvt('afterhide' , function() {
				removeSetCenter();
				ImagePic.onload = undefined;
				hideLoad();
				$dialog = $dialogdiv = $imgdom = undefined;
			});
			bindEvt();
		} else {
			$dialogdiv.find('img').attr('src' , cfg.img);
			$dialogdiv.find('p').html(cfg.desp);
		}
		setCenter();
	}
	function imgDialog(dom) {
		$imgdom = $(dom);
		getData(dom);
		loadPic();
	}
	$.imgDialog = imgDialog;
})(jQuery);
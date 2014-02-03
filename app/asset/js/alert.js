(function() {
	var id  = new Date().getTime().toString(16) , index = 0;
	var dialogHtml = '<div class="modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' + 
'<div class="modal-dialog">' + 
'<div class="modal-content">' + 
'<div class="modal-header">' + 
'<button type="button" class="close ico" data-dismiss="modal" aria-hidden="true"></button>' + 
'<h4 class="modal-title"></h4>' + 
'</div>' + 
'<div class="modal-body">' + 
'</div>' + 
'</div>' + 
'</div>' + 
'</div>'; 
	
	var hasDialogShown = false;
	
	function uuid() {
		return 'dialog_' + id + '_' + index++; 
	}
	function createDialog(opts) {
		var divid = uuid();
		var div = $(dialogHtml).attr({
			id : divid
		}).appendTo($('body')).addClass("modal");
		var modal = div.modal({
			backdrop : 'static'
		} ,'show');
		modal.on('shown.bs.modal' , function() {
			hasDialogShown = true;
		}).on('hidden.bs.modal' , function() {
			hasDialogShown = false;
			if(opts.removeOnClose) {
				div.remove();
			}
			$('body').removeClass('modal-open');
		});
		
		return {
			setHtml : function(cont) {
				div.find('.modal-body').html(cont);
			},
			getDom : function() {
				return div;
			},
			getModal : function() {
				return modal;
			},
			addEvt : function(evtType , func) {
				var targetEvtType;
				switch(evtType) {
					case 'beforeshow':
						targetEvtType = 'show.bs.modal';
						break;
					case 'aftershow':
						targetEvtType = 'shown.bs.modal';
						break;
					case 'beforehide':
						targetEvtType = 'hide.bs.modal';
						break;
					case 'afterhide' :
						targetEvtType = 'hidden.bs.modal';
						break;
				}
				modal.on(targetEvtType , function (e) {
					func.apply(div , [e]);
				});
			}
		};
	}
	$.alert = function(html , opts) {
		opts = $.extend({
			//关闭之后，dom会在页面中移除
			removeOnClose : true
		} , opts);
		if(hasDialogShown || !html) {
			return;
		}
		var dialog = createDialog(opts);
		dialog.setHtml(html);
		return dialog;
	};
})();
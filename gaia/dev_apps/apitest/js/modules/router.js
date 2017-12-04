define(["jQuery",
		"Backbone",
		"modules/options/modified",
		"modules/options/effects",
		"modules/options/borders",
		"modules/options/contrast",
		"modules/options/blur",
		"modules/options/sharpen",
		"modules/options/downloadimg",
		"modules/options/imgur",
      "modules/options/pass"],
			function(
				$,
				Backbone,
				Modified,
				Effects,
				Borders,
				Contrast,
				Blur,
				Sharpen,
				DownloadImg,
				Imgur,
            PassOn) {
	return {
		routing : function() {
			var Router = Backbone.Router.extend({
				routes: {
					'edit-photo-page#modified': 'modified',
					'edit-photo-page#effects': 'effects',
					'edit-photo-page#borders': 'borders',
					'edit-photo-page#contrast': 'contrast',
					'edit-photo-page#blur': 'blur',
					'edit-photo-page#sharpen': 'sharpen',
					'edit-photo-page#share': 'share',
					'edit-photo-page#downloadimg': 'downloadimg',
					'edit-photo-page#imgur': 'imgur',
					'edit-photo-page#pass': 'pass_on'
				},
				modified: function() {
					$("#content").html("");
					$("#slider-holder").hide();
					$("#select-mode ul > li").removeClass("ui-btn-active-override");
					$("#edit-header > h1").text("Picked photo");
					
					Modified.render();
				},
				effects: function() {
					$("#content").html("");
					$("#slider-holder").hide();
					$("#select-mode ul > li").removeClass("ui-btn-active-override");
					$("#panel-effects").addClass("ui-btn-active-override");
					$("#edit-header > h1").text("Effects");
					
					Effects.render();
				},
				borders: function() {
					$("#content").html("");
					$("#slider-holder").hide();
					$("#select-mode ul > li").removeClass("ui-btn-active-override");
					$("#panel-borders").addClass("ui-btn-active-override");
					$("#edit-header > h1").text("Frames");
					
					Borders.render();
				},
				contrast: function() {
					$("#content").html("");
					$("#select-mode ul > li").removeClass("ui-btn-active-override");
					$("#panel-contrast").addClass("ui-btn-active-override");
					$("#edit-header > h1").text("Contrast filter");
					
					Contrast.render();
				},
				blur: function() {
					$("#content").html("");
					$("#select-mode ul > li").removeClass("ui-btn-active-override");
					$("#panel-blur").addClass("ui-btn-active-override");
					$("#edit-header > h1").text("Blur filter");
					
					Blur.render();
				},
				sharpen: function() {
					$("#content").html("");
					$("#select-mode ul > li").removeClass("ui-btn-active-override");
					$("#panel-sharpen").addClass("ui-btn-active-override");
					$("#edit-header > h1").text("Sharpen filter");
					
					Sharpen.render();
				},
				share: function() {
					$("#content").html("");
					$("#slider-holder").hide();
					$("#select-mode ul > li").removeClass("ui-btn-active-override");
					$("#panel-share").addClass("ui-btn-active-override");
					$("#edit-header > h1").text("Simple Share");
					
					Modified.render(true);
				},
            pass_on: function(){
               $("#content").html("");
               $("#slider-holder").hide();
               $("#select-mode ul > li").removeClass("ui-btn-active-override");
               $("#panel-pass").addClass("ui-btn-active-override");
               $("edit-header > h1").text("Pass On");
               PassOn.render();
            },
				downloadimg: function() {
					$("#content").html("");
					$("#slider-holder").hide();
					$("#select-mode ul > li").removeClass("ui-btn-active-override");
					$("#panel-downloadimg").addClass("ui-btn-active-override");
					$("#edit-header > h1").text("Download Photo");
					
					DownloadImg.render();
				},
				imgur: function() {
					$("#content").html("");
					$("#slider-holder").hide();
					$("#select-mode ul > li").removeClass("ui-btn-active-override");
					$("#panel-imgur").addClass("ui-btn-active-override");
					$("#edit-header > h1").text("Social Share");
					
					Imgur.render();
				}
			});

			var Router = new Router();
			try {
				Backbone.history.start();
			} catch(err) {
				Backbone.history.loadUrl();
			}
		
			return Router;
		}
	};
});

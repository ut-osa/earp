define(["modules/app_registry",
		"jQuery",
		"jQueryMobile",
		"modules/canvas/viewport",
		"modules/canvas/create_main",
		"modules/canvas/border"],
			function(	AppRegistry,
						$,
						$m,
						Viewport,
						MainCanvas,
						Border) {	
return {
		render : function() {
			Caman.Event.events["renderFinished"] = [];

			var imgSrc = AppRegistry.image.selectedImage;
			var argumentsObj = {
				onLoadFunc : function (id, params, canvas) {
					var context = canvas.getContext("2d");
					
					$("body").addClass('ui-disabled-override');
					$m.showPageLoadingMsg();
					
					Caman("#picked-photo", function () {
						if (AppRegistry.effects.selectedEffect) {
							this[AppRegistry.effects.selectedEffect]();	
						}
						if (AppRegistry.contrast.val > 0) {
							this.contrast(AppRegistry.contrast.val);
						}
						if (AppRegistry.stackBlur.val > 0) {
							this.stackBlur(AppRegistry.stackBlur.val);
						}
						if (AppRegistry.sharpen.val > 0) {
							this.sharpen(AppRegistry.sharpen.val);
						}
						this.render();
					});
							
					$("#slider-holder input").val(AppRegistry.stackBlur.val * 5);
					$("#slider-holder a").css("left", AppRegistry.stackBlur.val * 5 + "%");
					$("#slider-holder .ui-slider-bg").css("width", AppRegistry.stackBlur.val * 5 + "%");
				},
				params : {}
			};
			$("#slider-holder input").val(0);
			$("#slider-holder a").css("left", "0%");
			$("#slider-holder .ui-slider-bg").css("width", "0%");

			MainCanvas("picked-photo", imgSrc, "#content", "", argumentsObj);
			
			$("#picked-photo").hide();
			$("#picked-photo").fadeIn(2000);
			$("#slider-holder input").attr("step", "5");
			
			$("#slider-holder").fadeIn(2000);
			$("#slider-holder").css("margin-top", Viewport.height - $("#slider-holder").height() * 2 - $("#edit-header").height() + "px");
			$("#slider-holder input").off("slidestop");
			$("#slider-holder input").on("slidestop", function(event, ui) {
				AppRegistry.stackBlur.val = parseInt($(this).val() / 5, 10);
				
				var argumentsObj = {
					onLoadFunc : function (id, params, canvas) {
						var context = canvas.getContext("2d");
						
						$("body").addClass('ui-disabled-override');
						$m.showPageLoadingMsg();
						
						Caman("#picked-photo", function () {
							if (AppRegistry.effects.selectedEffect) {
								this[AppRegistry.effects.selectedEffect]();	
							}
							if (AppRegistry.contrast.val > 0) {
								this.contrast(AppRegistry.contrast.val);
							}
							if (AppRegistry.stackBlur.val > 0) {
								this.stackBlur(AppRegistry.stackBlur.val);
							}
							if (AppRegistry.sharpen.val > 0) {
								this.sharpen(AppRegistry.sharpen.val);
							}
							this.render();
						});
					},
					params : {}
				};
			
				$("#picked-photo").remove();	
				MainCanvas("picked-photo", imgSrc, "#content", "", argumentsObj);
				$("#picked-photo").click(function(event) {
					document.location.href = "#edit-photo-page#modified";
				});
			});
		
			$("#picked-photo").click(function(event) {
				document.location.href = "#edit-photo-page#modified";
			});
			
			Caman.Event.events["renderFinished"] = [];
			Caman.Event.listen("renderFinished", function (job) {
				setTimeout(function() {
					if (AppRegistry.borders.selectedBorder) {
						Border.render($("#picked-photo").get(0), AppRegistry.borders.selectedBorder);
					}

					$("body").removeClass('ui-disabled-override');
					$m.hidePageLoadingMsg();
				},250);
			});
		}
	};
});
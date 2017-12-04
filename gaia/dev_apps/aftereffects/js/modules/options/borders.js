define(["modules/app_registry",
		"jQuery",
		"jQueryMobile",
		"modules/canvas/create_centered",
		"modules/canvas/viewport",
		"modules/canvas/border"],
			function(
				AppRegistry,
				$,
				$m,
				CenteredCanvas,
				Viewport,
				Border) {
	return {
		render : function() {
			Caman.Event.events["renderFinished"] = [];
			
			var imgSrc = AppRegistry.image.selectedImage;
			var imgWidth = parseInt((Viewport.width / 3), 10) - 20;
			var borders = AppRegistry.borders.borders;

			$("body").addClass('ui-disabled-override');
			$m.showPageLoadingMsg();

			var argumentsObj = {
				onLoadFunc : function (id, params, canvas) {
					Caman("#" + id + " canvas", function () {
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
		
			CenteredCanvas("img_1", imgSrc, "canvas-holder canvas-holder20", imgWidth * 2 + 20, imgWidth * 2 + 20, "#content", argumentsObj);
			$("#img_1").hide();
			$("#img_1").fadeIn(1000);
			$("#img_1").attr("data-border", "normal");
			
			for (var i=1,l=borders.length; i < l; i++) {
				var argumentsObj = {
					onLoadFunc : function (id, params, canvas) {
						Caman("#" + id + " canvas", function () {
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
					params : {
						forIndex : (i + 1)
					}
				};

				CenteredCanvas("img_" + (i + 1), imgSrc, "canvas-holder canvas-holder20", imgWidth, imgWidth, "#content", argumentsObj);
				
				$("#img_" + (i + 1)).hide();
				$("#img_" + (i + 1)).fadeIn(1000);
				$("#img_" + (i + 1)).attr("data-border", borders[i]);
			}
		
			$(".canvas-holder").click(function(event) {
				AppRegistry.borders.selectedBorder = $(this).attr("data-border");
				document.location.href = "#edit-photo-page#modified";
			});
		
			i = 1;
			Caman.Event.events["renderFinished"] = [];
			Caman.Event.listen("renderFinished", function (job) {
				if (i === borders.length) {
					setTimeout(function() {
						for (j=2,l=borders.length; j <= l; j++) {
							Border.render($("#img_" + j + " canvas").get(0), borders[j - 1]);
						}

						$("body").removeClass('ui-disabled-override');
						$m.hidePageLoadingMsg();
					}, 500);
				}
				++i;
			});
		}
	};
});
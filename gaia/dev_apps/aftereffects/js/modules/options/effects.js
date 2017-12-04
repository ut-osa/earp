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
			var imgSrc = AppRegistry.image.selectedImage;
			var imgWidth = parseInt((Viewport.width / 3), 10) - 5;
			var effects = AppRegistry.effects.effects;

			$("body").addClass('ui-disabled-override');
			$m.showPageLoadingMsg();
			
			var argumentsObj = {
				onLoadFunc : function (id, params, canvas) {
					Caman("#" + id + " canvas", function () {
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
			
			CenteredCanvas("img_1", imgSrc, "canvas-holder canvas-holder5", imgWidth * 2 + 5, imgWidth * 2 + 5, "#content", argumentsObj);
			$("#img_1").hide();
			$("#img_1").fadeIn(1000);
			$("#img_1").attr("data-effect", "");

			for (var i=1,l=effects.length; i < l; i++) {
				var argumentsObj = {
					onLoadFunc : function (id, params, canvas) {
						Caman("#" + id + " canvas", function () {
							if (AppRegistry.contrast.val > 0) {
								this.contrast(AppRegistry.contrast.val);
							}
							if (AppRegistry.stackBlur.val > 0) {
								this.stackBlur(AppRegistry.stackBlur.val);
							}
							if (AppRegistry.sharpen.val > 0) {
								this.sharpen(AppRegistry.sharpen.val);
							}
							this[effects[params.forIndex - 1]]();
							this.render();
						});
					},
					params : {
						forIndex : (i + 1)
					}
				};

				CenteredCanvas("img_" + (i + 1), imgSrc, "canvas-holder canvas-holder5", imgWidth, imgWidth, "#content", argumentsObj);
				
				$("#img_" + (i + 1)).hide();
				$("#img_" + (i + 1)).fadeIn(1000);
				$("#img_" + (i + 1)).attr("data-effect", effects[i]);
			}
		
			$(".canvas-holder").click(function(event) {
				AppRegistry.effects.selectedEffect = $(this).attr("data-effect");
				document.location.href = "#edit-photo-page#modified";
			});

			i = 1;
			Caman.Event.events["renderFinished"] = [];
			Caman.Event.listen("renderFinished", function (job) {
				if (i === effects.length) {
					setTimeout(function() {
						for (j=1,l=effects.length; j <= l; j++) {
							if (AppRegistry.borders.selectedBorder) {
								Border.render($("#img_" + j + " canvas").get(0), AppRegistry.borders.selectedBorder);
							}
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
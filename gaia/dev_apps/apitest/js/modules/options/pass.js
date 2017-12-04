define(["modules/app_registry",
		"jQuery",
		"jQueryMobile",
		"modules/canvas/create_main",
		"modules/canvas/create_original",
		"modules/canvas/border"],
			function(	AppRegistry,
						$,
						$m,
						MainCanvas,
						OriginalCanvas,
						Border) {

	function uploadPicture() {
		try {
			var img = $("#picked-photo").get(0).toDataURL('image/jpeg', 0.9).split(',')[1];
		} catch(e) {
			var img = $("#picked-photo").get(0).toDataURL().split(',')[1];
		}
      console.log("uploading Picture yo!");

      var activ = new MozActivity({
         name: "upload",
         data: {
            type: "image/*",
            //photo: new Blob(img)
         },
      });

	}
		
	return {
		render : function(wantToShare) {
         console.log("rendering!");
			Caman.Event.events["renderFinished"] = [];
			
			var imgSrc = AppRegistry.image.selectedImage;
			var wantToShare = (typeof wantToShare === "undefined") ? false : wantToShare;
			
			var argumentsObj = {
				onLoadFunc : function (id, params, canvas) {
					var context = canvas.getContext("2d");
					
					$("body").addClass('ui-disabled-override');
					$m.showPageLoadingMsg();
					
					Caman("#" + id, function () {
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

			MainCanvas("picked-photo", imgSrc, "#content", "", argumentsObj);
			
			$("#picked-photo").hide();
			$("#picked-photo").fadeIn(2000);
			
			Caman.Event.events["renderFinished"] = [];
			Caman.Event.listen("renderFinished", function (job) {
				setTimeout(function() {
					if (AppRegistry.borders.selectedBorder) {
						Border.render($("#picked-photo").get(0), AppRegistry.borders.selectedBorder);
					}

					$m.showPageLoadingMsg();
					setTimeout(function() {
						uploadPicture();
					}, 150);

					$("body").removeClass('ui-disabled-override');
					//$m.hidePageLoadingMsg();
				}, 250);
			});
			
			$("#picked-photo").click(function(event) {
				$("#picked-photo").get(0).toBlob(function (blob) {
					var sharingImage = new MozActivity({
						name: "share",
						data: {
							type: "image/*",
							number: 1,
							blobs: [blob]
						}
					});
				});
			});
		}
	};
});

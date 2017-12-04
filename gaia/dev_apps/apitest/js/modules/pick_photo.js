define(["modules/app_registry",
		"jQuery",
		"modules/router",
		"modules/options/modified"],
			function(
				AppRegistry,
				$,
				Router,
				Modified) {
	return {
		MozActivityPick: function() {
			$("#pick-photo").click(function() {
				setTimeout(function() {					
					var pickImg = new MozActivity({
						name: "pick",
						data: {
							type: ["image/png", "image/jpg", "image/jpeg"],
							nocrop: true
						}
					});
					pickImg.onsuccess = function () { 
						AppRegistry.image.selectedImage = window.URL.createObjectURL(this.result.blob);
						
						$("#edit-header").show();
						$("#select-mode").removeClass("hidden");
						Modified.render();
						
						Router.routing();
					};							
					pickImg.onerror = function () { 
						alert("Please select or shoot a photo");
						$("#pick-photo").trigger("click");
					};
				}, 500);
			});
		
			$("#home-button").click(function() {
				setTimeout(function() {
					$("#edit-header").hide();
					$("#slider-holder").hide();
					$("#content").html("");
					$("#select-mode ul > li").removeClass("ui-btn-active-override");
					$("#edit-header > h1").text("Picked photo");
					AppRegistry.reset();
				}, 500);
			});
		}
	};
});
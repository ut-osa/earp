define(["modules/app_registry",
		"jQuery", 
		"CamanJs", 
		"modules/canvas/resize_to_client", 
		"modules/canvas/viewport"],
			function(
				AppRegistry,
				$,
				CamanJs,
				Resize,
				Viewport) {
	return function(id, imgSrc, em, classes, argumentsObj) {
		var canvas = $("<canvas/>", {id: id, class: classes});
		$(em).append(canvas);
		canvas = canvas.get(0);
		
		var context = canvas.getContext("2d");

		var imageObj = new Image();
		imageObj.src = imgSrc;

		imageObj.onload = function() {
			
			// Save the size of the original image
			if (AppRegistry.image.original.width === null) {
				AppRegistry.image.original.width = this.width;
				AppRegistry.image.original.height = this.height;
			}
			
			var newSize = Resize(this.width, Viewport.width, this.height, Viewport.height - 2);
			
			canvas.width = newSize.width;
			canvas.height = newSize.height;

			if (canvas.width < Viewport.width) {
				canvas.style.left = parseInt((Viewport.width - canvas.width) / 2.0, 10) + "px";
			}
			if (canvas.height < Viewport.height) {
				canvas.style.top = parseInt((Viewport.height - canvas.height) / 2.0, 10) + "px";
			}

			context.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
			
			if (typeof argumentsObj !== "undefined") {
				if (argumentsObj.hasOwnProperty("onLoadFunc")) {
					argumentsObj.onLoadFunc(id, argumentsObj.params, canvas);
				}
			}
		};
	
		return canvas;
	};
});
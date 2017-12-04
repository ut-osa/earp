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
			context.drawImage(imageObj, 0, 0, this.width, this.height);
			
			if (typeof argumentsObj !== "undefined") {
				if (argumentsObj.hasOwnProperty("onLoadFunc")) {
					argumentsObj.onLoadFunc(id, argumentsObj.params, canvas);
				}
			}
		};
	
		return canvas;
	};
});

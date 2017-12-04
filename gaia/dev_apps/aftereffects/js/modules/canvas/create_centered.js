define(["jQuery"], function($) {
	return function(id, imgSrc, classes, width, height, em, argumentsObj) {
		var div = $("<div/>", {id: id, class: classes});
		$(em).append(div);
		
		var canvas = $("<canvas/>");
		div.append(canvas);
		
		canvas = canvas.get(0);
		
		var context = canvas.getContext("2d");
		
		var imageObj = new Image();
		imageObj.onload = function() {
			canvas.width = width;
			canvas.height = height;
			
			var ratio = ((this.width / width)/1);
			this.width = this.width / ratio;
			this.height = this.height / ratio;
			
			var xx = parseInt((this.width - canvas.width) / 2, 10);
			var yy = parseInt((this.height - canvas.height) / 2, 10);
			
			context.drawImage(imageObj, -xx, -yy, this.width, this.height);
			
			if (typeof argumentsObj !== "undefined") {
				if (argumentsObj.hasOwnProperty("onLoadFunc")) {
					argumentsObj.onLoadFunc(id, argumentsObj.params, canvas);
				}
			}
		};
		
		imageObj.src = imgSrc;
	
		return canvas;
	};
});
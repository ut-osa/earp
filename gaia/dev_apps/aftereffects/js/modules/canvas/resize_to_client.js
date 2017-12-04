define([], function() {
	return function(width, maxWidth, height, maxHeight) {
			var newSize = {
			width: 0,
			height: 0
			};
			var widthRatio = maxWidth / width;
			var heightRatio = maxHeight / height;

			if (widthRatio >= heightRatio) {
				newSize.width = parseInt(width * heightRatio, 10);
				newSize.height = maxHeight;
			}
			else {
				newSize.width = maxWidth;
				newSize.height = parseInt(height * widthRatio, 10);

			}

			return newSize;
	};
});


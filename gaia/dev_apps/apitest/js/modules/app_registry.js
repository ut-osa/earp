define([], function() {
    var appRegistry = {};
	
	appRegistry.reset = function() {
		appRegistry.image.selectedImage = null;
		appRegistry.image.original.width = null;
		appRegistry.image.original.height = null;
		appRegistry.effects.selectedEffect = null;
		appRegistry.borders.selectedBorder = null;
		appRegistry.contrast.val = 0;
		appRegistry.stackBlur.val = 0;
		appRegistry.sharpen.val = 0;
	};

	appRegistry.image = {
		selectedImage : null,
		original : {
			width: null,
			height: null
		}
	};
	
    appRegistry.effects = {
		selectedEffect : null,
		effects : [
			"normal",
			"vintage",
			"lomo",
			"clarity",
			"sinCity",
			"sunrise",
			"crossProcess",
			"orangePeel",
			"love",
			"grungy",
			"jarques",
			"pinhole",
			"oldBoot",
			"glowingSun",
			"hazyDays",
			"herMajesty",
			"nostalgia",
			"hemingway",
			"concentrate"
		]
	};
	
	appRegistry.borders = {
		selectedBorder : null,
		borders : [
			"normal",
			"polaroid",
			"rect-thin-white",
			"rect-white",
			"round-rect-thin-white",
			"round-rect-white",
			"rect-thin-black",
			"rect-black",
			"round-rect-thin-black",
			"round-rect-black"
		]
	};

	appRegistry.contrast = {
		val : 0
	};

	appRegistry.stackBlur = {
		val : 0
	};

	appRegistry.sharpen = {
		val : 0
	};
	
    return appRegistry;
});
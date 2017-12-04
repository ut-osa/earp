define(["jQuery"], function($) {
	
	var div = $("<div>", {width: 1, height: 10000});
	$("body").append(div);
	var width = $(window).width();
	var height = $(window).height();
	$(div).remove();
	
	return {
		width: width,
		height: height
	};
});
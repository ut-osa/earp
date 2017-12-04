define([], function() {
	/* roundedRect(ctx,x,y,width,height,radius,fill,stroke)
		Arguments:  ctx - the context to be used to draw with.
		x,y - the top left corner
		width - how wide the rectangle
		height - how high the rectangle
		radius - the radius of the corner
		fill   - true if the rectangle should be filled
		stroke - true if the rectangle should be stroked */
	// From : http://www.dbp-consulting.com/tutorials/canvas/CanvasArcTo.html
	return function(context, x, y, width, height, radius, fill, stroke) {
		context.save();	// save the context so we don't mess up others
		context.beginPath();

		// draw top and top right corner
		context.moveTo(x+radius,y);
		context.arcTo(x+width,y,x+width,y+radius,radius);

		// draw right side and bottom right corner
		context.arcTo(x+width,y+height,x+width-radius,y+height,radius); 

		// draw bottom and bottom left corner
		context.arcTo(x,y+height,x,y+height-radius,radius);

		// draw left and top left corner
		context.arcTo(x,y,x+radius,y,radius);

		if(fill){
			context.fill();
		}
		if(stroke){
			context.stroke();
		}
		context.restore();	// restore context to what it was on entry
	};
});
define(["modules/canvas/round_rect"], function(RoundRect) {
	return {
		render : function(canvas, type) {
			var context = canvas.getContext("2d");
			
			switch (type) {
				case "polaroid":
					var ratio = parseInt(Math.ceil((canvas.width + canvas.height) / 2 / 80), 10);
					context.lineWidth = parseInt(ratio * 9, 10);
					context.strokeStyle = "white";
					context.rect(0, 0, canvas.width, canvas.height);
					context.stroke();
					
					context.fillStyle = "white";
					context.fillRect(0, canvas.height - canvas.height / 4, canvas.width, canvas.height);
					break;
				case "rect-thin-white":
					var ratio = parseInt(Math.ceil((canvas.width + canvas.height) / 2 / 80), 10);
					context.lineWidth = parseInt(ratio * 9, 10);
					context.strokeStyle = "white";
					context.rect(0, 0, canvas.width, canvas.height);
					context.stroke();
					break;
				case "rect-white":
					var ratio = parseInt(Math.ceil((canvas.width + canvas.height) / 2 / 40), 10);
					context.lineWidth = parseInt(ratio * 9, 10);
					context.strokeStyle = "white";
					context.rect(0, 0, canvas.width, canvas.height);
					context.stroke();
					break;
				case "round-rect-thin-white":
					var ratio = parseInt(Math.ceil((canvas.width + canvas.height) / 2 / 80), 10);
					context.lineWidth = parseInt(ratio * 9, 10);
					context.strokeStyle = "white";
					RoundRect(context, 0, 0, canvas.width, canvas.height, ratio * 10, false, true);
					break;
				case "round-rect-white":
					var ratio = parseInt(Math.ceil((canvas.width + canvas.height) / 2 / 40), 10);
					context.lineWidth = parseInt(ratio * 9, 10);
					context.strokeStyle = "white";
					RoundRect(context, 0, 0, canvas.width, canvas.height, ratio * 10, false, true);
					break;
				case "rect-thin-black":
					var ratio = parseInt(Math.ceil((canvas.width + canvas.height) / 2 / 80), 10);
					context.lineWidth = parseInt(ratio * 9, 10);
					context.strokeStyle = "black";
					context.rect(0, 0, canvas.width, canvas.height);
					context.stroke();
					break;
				case "rect-black":
					var ratio = parseInt(Math.ceil((canvas.width + canvas.height) / 2 / 40), 10);
					context.lineWidth = parseInt(ratio * 9, 10);
					context.strokeStyle = "black";
					context.rect(0, 0, canvas.width, canvas.height);
					context.stroke();
					break;
				case "round-rect-thin-black":
					var ratio = parseInt(Math.ceil((canvas.width + canvas.height) / 2 / 80), 10);
					context.lineWidth = parseInt(ratio * 9, 10);
					context.strokeStyle = "black";
					RoundRect(context, 0, 0, canvas.width, canvas.height, ratio * 10, false, true);
					break;
				case "round-rect-black":
					var ratio = parseInt(Math.ceil((canvas.width + canvas.height) / 2 / 40), 10);
					context.lineWidth = parseInt(ratio * 9, 10);
					context.strokeStyle = "black";
					RoundRect(context, 0, 0, canvas.width, canvas.height, ratio * 10, false, true);
					break;
				default:
					// nop
			}
		}
	};
});


